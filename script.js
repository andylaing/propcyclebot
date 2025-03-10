// Select elements
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
const speakButton = document.getElementById("speak-button");
const stopRecordingButton = document.getElementById("stop-recording-btn");

// Display messages in chat box
function displayMessage(sender, message, isUser = false) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("chat-message", isUser ? "user-message" : "bot-message");
    msgDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Send user input to backend
function sendMessage(userText) {
    if (!userText) return;
    displayMessage("You", userText, true);
    userInput.value = "";

    fetch("https://propcycle-ai-bot.andy-fc3.workers.dev/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText })
    })
    .then(response => response.json())
    .then(data => {
        if (data.response) {
            displayMessage("AI", data.response);
        } else {
            displayMessage("AI", "Sorry, I couldn't generate a response.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        displayMessage("AI", "There was a problem connecting to the AI.");
    });
}

// Event listeners for send button and enter key
sendButton.addEventListener("click", () => sendMessage(userInput.value.trim()));
userInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") sendMessage(userInput.value.trim());
});

// Voice recognition setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.interimResults = false;
recognition.lang = "en-US";

// Start recording
speakButton.addEventListener("click", () => {
    speakButton.style.display = "none"; 
    stopRecordingButton.style.display = "block"; 
    displayMessage("AI", "Recording your response...");
    recognition.start();
});

// Stop recording & process response
stopRecordingButton.addEventListener("click", () => {
    recognition.stop();
    speakButton.style.display = "block";
    stopRecordingButton.style.display = "none";
});

// Capture voice and send as text
recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    displayMessage("You", transcript, true);
    sendMessage(transcript);
};

// Error handling for voice recognition
recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    displayMessage("AI", "Sorry, I couldn't understand that.");
};

// Initial AI greeting
window.onload = function() {
    displayMessage("AI", "Welcome to your Sales Growth Roadmap! Let’s get started.");
};
