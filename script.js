document.addEventListener("DOMContentLoaded", function() {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");
    const speakButton = document.getElementById("speak-button");
    const stopRecordingButton = document.getElementById("stop-recording-btn");

    let recognition;
    let isRecording = false;

    // Function to display messages in chat
    function displayMessage(sender, message, isUser = false) {
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("chat-message", isUser ? "user-message" : "bot-message");
        msgDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Function to send user message to AI
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
                handleBotOptions(data.options);
            } else {
                displayMessage("AI", "Sorry, I couldn't generate a response.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            displayMessage("AI", "There was a problem connecting to the AI.");
        });
    }

    // Handle AI-generated option buttons
    function handleBotOptions(options) {
        if (!options || !Array.isArray(options)) return;
        const buttonsDiv = document.createElement("div");
        options.forEach(option => {
            const button = document.createElement("button");
            button.innerText = option;
            button.classList.add("option-button");
            button.onclick = () => sendMessage(option);
            buttonsDiv.appendChild(button);
        });
        chatBox.appendChild(buttonsDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Attach event listeners after DOM is fully loaded
    if (sendButton) {
        sendButton.addEventListener("click", () => sendMessage(userInput.value.trim()));
    }

    if (userInput) {
        userInput.addEventListener("keypress", function(event) {
            if (event.key === "Enter") sendMessage(userInput.value.trim());
        });
    }

    // Speech Recognition Setup
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onstart = function() {
            isRecording = true;
            displayMessage("System", "Recording your response...");
        };

        recognition.onresult = function(event) {
            let transcript = event.results[0][0].transcript;
            userInput.value = transcript;
        };

        recognition.onerror = function(event) {
            console.error("Speech Recognition Error: ", event);
            displayMessage("System", "Error capturing voice. Please try again.");
        };

        recognition.onend = function() {
            isRecording = false;
            stopRecordingButton.style.display = "none"; // Hide stop button after recording ends
        };
    } else {
        displayMessage("System", "Speech recognition is not supported in this browser.");
    }

    // Start voice recognition
    function startVoiceRecognition() {
        if (recognition && !isRecording) {
            recognition.start();
            stopRecordingButton.style.display = "block"; // Show stop button while recording
        }
    }

    // Stop recording and submit response
    function submitVoiceResponse() {
        if (recognition && isRecording) {
            recognition.stop();
            sendMessage(userInput.value.trim());
        }
    }

    // Attach event listeners for voice buttons
    if (speakButton) {
        speakButton.addEventListener("click", startVoiceRecognition);
    } else {
        console.error("Speak button not found in DOM.");
    }

    if (stopRecordingButton) {
        stopRecordingButton.addEventListener("click", submitVoiceResponse);
    } else {
        console.error("Stop Recording button not found in DOM.");
    }

    // Start the chat with a greeting message
    window.onload = function() {
        displayMessage("AI", "Welcome to your Sales Growth Roadmap! Let's get started.");
        sendMessage("start");
    };
});
