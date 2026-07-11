import { getMessages, postMessage, deleteMessage, getSummary } from "./api.js";

const notesGrid = document.getElementById("notesGrid");
const promptInput = document.getElementById("promptInput");
const postButton = document.getElementById("postButton");
const analyzeMoodButton = document.getElementById("analyzeMoodButton");
const moodWord = document.getElementById("mood-word");

async function loadNotes() {
    try {
        const messages = await getMessages();
        notesGrid.innerHTML = "";
        messages.forEach(message => {
            const card = document.createElement("div");
            card.className = "card";

            const text = document.createElement("span");
            text.textContent = message.text;
            card.appendChild(text);

            const deleteButton = document.createElement("button");
            deleteButton.className = "delete-btn";
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", async () => {
                try {
                    await deleteMessage(message.id);
                    loadNotes();
                } catch (error) { console.error(error); }
            });
            card.appendChild(deleteButton);

            notesGrid.appendChild(card);
        });
    } catch (error) { console.error(error); }
}

postButton.addEventListener("click", async () => {
    const text = promptInput.value.trim();
    if (text === "") { alert("Please write something first."); return; }
    try {
        await postMessage(text);
        promptInput.value = "";
        loadNotes();
    } catch (error) { alert(error.message); }
});

analyzeMoodButton.addEventListener("click", async () => {
    try {
        const result = await getSummary();
        moodWord.textContent = result.summary;
    } catch (error) {
        moodWord.textContent = error.message;
    }
});

loadNotes();
