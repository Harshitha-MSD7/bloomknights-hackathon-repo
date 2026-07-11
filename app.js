import {
    getMessages,
    postMessage,
    deleteMessage,
    getSummary
} from "./api.js";


// Get HTML elements
const notesGrid = document.getElementById("notesGrid");
const promptInput = document.getElementById("promptInput");
const postButton = document.getElementById("postButton");
const analyzeMoodButton = document.getElementById("analyzeMoodButton");
const moodWord = document.getElementById("mood-word");


// -----------------------------
// Load existing notes
// -----------------------------
async function loadNotes() {
    try {
        const messages = await getMessages();

        notesGrid.innerHTML = "";

        messages.forEach(message => {
            const card = document.createElement("div");
            card.className = "card";

            // the note text
            const text = document.createElement("span");
            text.textContent = message.text;
            card.appendChild(text);

            // delete button for this note
            const deleteButton = document.createElement("button");
            deleteButton.className = "delete-btn";
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", async () => {
                try {
                    await deleteMessage(message.id);
                    loadNotes(); // refresh after deleting
                } catch (error) {
                    console.error(error);
                }
            });
            card.appendChild(deleteButton);

            notesGrid.appendChild(card);
        });

    } catch (error) {
        console.error(error);
    }
}


// -----------------------------
// Create new note/post
// -----------------------------
postButton.addEventListener("click", async () => {
    const text = promptInput.value.trim();

    if (text === "") {
        alert("Please write something first.");
        return;
    }

    try {
        await postMessage(text);
        promptInput.value = "";
        loadNotes();
    } catch (error) {
        alert(error.message);
    }
});


// -----------------------------
// Analyze mood using Gemini
// -----------------------------
analyzeMoodButton.addEventListener("click", async () => {
    try {
        const result = await getSummary();
        moodWord.textContent = result.summary;
    } catch (error) {
        moodWord.textContent = error.message;
    }
});


// Load notes when the page opens
loadNotes();
