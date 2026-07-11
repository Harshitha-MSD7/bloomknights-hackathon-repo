    # BLoomknigts project by:
    # Alexandria Schmitz
    # Harshitha Sathees Kumar
    # Brittany Torres
    # Ria Balwalli

    import os
    from datetime import datetime

    from dotenv import load_dotenv
    from fastapi import FastAPI, HTTPException
    from fastapi.middleware.cors import CORSMiddleware
    from google import genai
    from pydantic import BaseModel
    from sqlalchemy import Column, Text
    from sqlmodel import Field, SQLModel, Session, create_engine, select

    # Loads GEMINI_API_KEY from the .env file (which is kept out of git).
    load_dotenv()

    # ---- DATABASE CONNECTION ----
    # We use a local SQLite database file (dailyelpis.db).
    DATABASE_URL = "sqlite:///dailyelpis.db"

    engine = create_engine(DATABASE_URL)


    class Message(SQLModel, table=True):
        __tablename__ = "posts"
        id: int | None = Field(default=None, primary_key=True)
        # Called "text" in our API (so the frontend stays the same), stored in the
        # "message" column in the database.
        text: str = Field(sa_column=Column("message", Text, nullable=False))
        created_at: datetime = Field(default_factory=datetime.now)


    class NewMessage(BaseModel):
        text: str


    SQLModel.metadata.create_all(engine)

    app = FastAPI(title="BloomKnights")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
    )


    @app.get("/messages")
    def get_messages():
        with Session(engine) as session:
            return session.exec(select(Message).order_by(Message.id.desc())).all()


    @app.post("/messages")
    def post_message(new: NewMessage):
        text = new.text.strip()
        if not text:
            raise HTTPException(
                status_code=400,
                detail="Please write something before posting.",
            )

        message = Message(text=text)
        with Session(engine) as session:
            session.add(message)
            session.commit()
            session.refresh(message)
            return message


    @app.delete("/messages/{message_id}")
    def delete_message(message_id: int):
        with Session(engine) as session:
            message = session.get(Message, message_id)
            if message is None:
                raise HTTPException(
                    status_code=404,
                    detail="That message doesn't exist or was already deleted.",
                )
            session.delete(message)
            session.commit()
            return {"deleted": message_id}


    @app.get("/summary")
    def summarize_messages():
        with Session(engine) as session:
            messages = session.exec(select(Message).order_by(Message.id)).all()

        if not messages:
            return {"summary": "No messages yet."}

        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise HTTPException(
                status_code=500,
                detail="The AI summary isn't set up yet. Please try again later.",
            )

        joined = "\n".join(f"- {m.text}" for m in messages)
        prompt = (
            "Below are messages that different people posted about their day.\n"
            f"{joined}\n\n"
            "In 2-3 plain sentences, describe how people are generally feeling and "
            "the most common issues or concerns they mention. Only use what is "
            "actually in the messages, do not make anything up."
        )

        client = genai.Client(api_key=api_key)
        try:
            response = client.models.generate_content(
                model="gemini-flash-latest",
                contents=prompt,
            )
        except Exception as error:
            print(f"Gemini error: {error}")  # full details in the terminal for debugging
            raise HTTPException(
                status_code=502,
                detail="Sorry, we couldn't create a summary right now. Please try again in a moment.",
            )
        return {"summary": response.text}
