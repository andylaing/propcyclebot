// Function to send an initial AI greeting when the chat opens
function sendInitialGreeting() {
    fetch("https://www.propcycle.com.au/_functions/chatWithAI", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

// Run the greeting when the Lightbox opens
$w.onReady(() => {
    sendInitialGreeting();
});

// Function to display messages in chat
function displayMessage(sender, message) {
    const chatBox = $w("#chatBox"); // Update with your actual chatbox element ID
    chatBox.text += `\n${sender}: ${message}`; // Append AI message to the chat UI
}
