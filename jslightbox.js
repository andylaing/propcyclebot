// Function to send an initial AI greeting when the chat opens
function sendInitialGreeting() {
    fetch("https://www.propcycle.com.au/_functions/chatWithAI", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: "Hello, I just opened the chat." })
    })
    .then(response => response.json())
    .then(data => {
        if (data.response) {
            displayMessage("AI", data.response); // Show AI's first message
        } else {
            displayMessage("AI", "Sorry, I couldn't generate a response.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        displayMessage("AI", "There was a problem connecting to the AI.");
    });
}

// Ensure the script runs when the Lightbox loads
document.addEventListener("DOMContentLoaded", function() {
    sendInitialGreeting();
});

// Function to display messages in the chat
function displayMessage(sender, message) {
    const chatBox = document.getElementById("chatBox"); // Update with actual chatbox element ID
    if (chatBox) {
        chatBox.innerHTML += `<p><strong>${sender}:</strong> ${message}</p>`;
    } else {
        console.error("Chatbox element not found.");
    }
}
