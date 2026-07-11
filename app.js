import {
    getMessages,
    postMessage,
    getSummary
} from "./api.js";


// Get HTML elements
const notesGrid = document.getElementById("notesGrid");

const promptInput = document.getElementById("promptInput");
const postButton = document.getElementById("postButton");

const geminiResponse = document.getElementById("geminiResponse");

const analyzeMoodButton = document.getElementById("analyzeMoodButton");
const moodWord = document.getElementById("mood-word");


// -----------------------------
// Load existing notes
// -----------------------------

async function loadNotes() {

    try {

        const messages = await getMessages();


        // Clear placeholder notes
        notesGrid.innerHTML = "";


        messages.forEach(message => {

            const card = document.createElement("div");

            card.className = "card";

            card.textContent = message.text;


            notesGrid.appendChild(card);

        });


    } catch(error) {

        console.error(error);

    }

}



// -----------------------------
// Create new note/post
// -----------------------------

postButton.addEventListener("click", async()=>{


    const text = promptInput.value.trim();


    if(text === "") {
        alert("Please write something first.");
        return;
    }


    try {

        await postMessage(text);


        promptInput.value = "";


        // refresh notes
        loadNotes();


        geminiResponse.textContent =
            "Post saved!";


    } catch(error){

        geminiResponse.textContent =
            error.message;

    }


});




// -----------------------------
// Analyze mood using Gemini
// -----------------------------

analyzeMoodButton.addEventListener("click", async()=>{


    try {


        const result = await getSummary();


        /*
          Expected backend response:

          {
             "summary": "Happy and reflective"
          }

        */


        geminiResponse.textContent =
            result.summary;


        moodWord.textContent =
            result.summary;



    } catch(error){


        geminiResponse.textContent =
            error.message;


    }


});


