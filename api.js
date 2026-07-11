// BloomKnights API helper
// Drop this file into the frontend project and call these functions.
// Points at the deployed backend on Render.

const BASE_URL = "https://bloomknights-hackathon-repo.onrender.com";

// Small helper: runs a request and returns the JSON.
// If the backend sends an error, it throws with the friendly message.
async function request(path, options) {
  const res = await fetch(`${BASE_URL}${path}`, options);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || "Something went wrong");
  }
  return data;
}

// Get all messages (newest first).
// Returns: [ { id, text, created_at }, ... ]
async function getMessages() {
  return request("/messages");
}

// Post a new message.
// Returns the created message: { id, text, created_at }
async function postMessage(text) {
  return request("/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
}

// Delete a message by its id.
// Returns: { deleted: id }
async function deleteMessage(id) {
  return request(`/messages/${id}`, { method: "DELETE" });
}

// Get the AI summary of everyone's messages.
// Returns: { summary: "..." }
async function getSummary() {
  return request("/summary");
}

// --- Example of how to use these ---
//
// async function loadPage() {
//   try {
//     const messages = await getMessages();
//     console.log(messages);
//
//     await postMessage("Had a great day!");
//     const summary = await getSummary();
//     console.log(summary.summary);
//   } catch (err) {
//     alert(err.message); // shows the friendly error to the user
//   }
// }

export { getMessages, postMessage, deleteMessage, getSummary };
