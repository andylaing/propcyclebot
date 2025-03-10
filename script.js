// Select elements
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
const speakButton = document.getElementById("speak-button");

// Create Submit Response Button for Voice
const stopRecordingButton = document.createElement("button");
stopRecordingButton.innerText = "Click Here When Finished";
stopRecordingButton.style.display = "none";
stopRecordingButton.classList.add("stop-recording-btn");
speakButton.parentNode.insertBefore(stopRecordingButton, speakButton.nextSibling);

// Store conversation history
let conversationHistory = [];
let isRecording = false;

// Function to display messages in chatbox
function displayMessage(sender, message, isUser = false) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("chat-message", isUser ? "user-message" : "bot-message");
    msgDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to send messages
function sendMessage(userText) {
    if (!userText) return;
    displayMessage("You", userText, true);
    userInput.value = "";

    // Store user input
    conversationHistory.push({ role: "user", message: userText });

    // Send to AI backend
    fetch("https://propcycle-ai-bot.andy-fc3.workers.dev/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, history: conversationHistory })
    })
    .then(response => response.json())
    .then(data => {
        if (data.response) {
            displayMessage("AI", data.response);
            conversationHistory.push({ role: "bot", message: data.response });
        } else {
            displayMessage("AI", "I didn't quite get that. Could you try again?");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        displayMessage("AI", "There was a problem connecting to the AI.");
    });
}

// Event listeners for text input
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

let transcriptCaptured = false; // Prevent duplicate responses

// Start recording
speakButton.addEventListener("click", () => {
    transcriptCaptured = false; 
    isRecording = true;
    speakButton.style.display = "none";
    stopRecordingButton.style.display = "block";
    displayMessage("AI", "Recording your response...");
    recognition.start();
});

// Stop recording & process response when user clicks "Finished"
stopRecordingButton.addEventListener("click", () => {
    if (isRecording) {
        isRecording = false;
        recognition.stop();
        speakButton.style.display = "block";
        stopRecordingButton.style.display = "none";
    }
});

// Capture voice input & prevent duplicates
recognition.onresult = (event) => {
    if (!transcriptCaptured) {
        transcriptCaptured = true;
        const transcript = event.results[0][0].transcript;
        displayMessage("You", transcript, true);
        sendMessage(transcript);
    }
};

// Handle voice errors
recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    displayMessage("AI", "Sorry, I couldn't understand that.");
};

// **✅ AI Starts Automatically with First Question**
window.onload = function() {
    displayMessage("AI", "Welcome to your Sales Growth Roadmap! Let’s get started.");
    setTimeout(() => displayMessage("AI", "What's your full name?"), 1000);
};
