const button = document.getElementById("postButton");
const input = document.getElementById("promptInput");
const output = document.getElementById("geminiResponse");

button.addEventListener("click", async () => {
    const userText = input.value;

    output.innerText = "Thinking...";

    // Gemini API request goes here

    output.innerText = "Gemini response goes here";
});