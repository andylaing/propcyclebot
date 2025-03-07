const API_URL = "https://propcycle-ai-bot.andy-fc3.workers.dev/"; // Cloudflare Worker URL

// Function to send a message to the AI and display the response
function sendMessage() {
    const userInput = document.getElementById("userInput").value.trim();
    if (!userInput) return; // Prevent empty messages

    displayMessage("You", userInput); // Display user message in chat UI
    document.getElementById("userInput").value = ""; // Clear input box

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput })
    })
    .then(response => response.json())
    .then(data => {
        const aiMessage = data.choices?.[0]?.message?.content || "I couldn't generate a response. Try again.";
        displayMessage("AI", aiMessage); // Show AI response
    })
    .catch(error => {
        console.error("Error:", error);
        displayMessage("AI", "There was a problem connecting to the AI.");
    });
}

// Function to display messages in the chat UI
function displayMessage(sender, message) {
    const chatBox = document.getElementById("chatBox");
    const messageElement = document.createElement("div");
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to latest message
}

// Function to send an initial AI greeting when the chat opens
function sendInitialGreeting() {
    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Hello AI" }) // Initial AI greeting
    })
    .then(response => response.json())
    .then(data => {
        const greetingMessage = data.choices?.[0]?.message?.content || "Hello! How can I assist you today?";
        displayMessage("AI", greetingMessage);
    })
    .catch(error => {
        console.error("Error:", error);
        displayMessage("AI", "There was a problem connecting to the AI.");
    });
}

// Run the greeting when the chat UI loads
document.addEventListener("DOMContentLoaded", sendInitialGreeting);

// Allow pressing "Enter" to send a message
document.getElementById("userInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});
