document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");
    const speakButton = document.getElementById("speak-button");
    const stopSpeakButton = document.getElementById("stop-speak-button");

    let recognition;
    let isRecording = false;

    function displayMessage(sender, message, isUser = false) {
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("chat-message", isUser ? "user-message" : "bot-message");
        msgDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

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
                displayMessage("AI", "Sorry, I couldn't understand that.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            displayMessage("AI", "There was a problem connecting to the AI.");
        });
    }

    sendButton.addEventListener("click", () => sendMessage(userInput.value.trim()));

    userInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") sendMessage(userInput.value.trim());
    });

    function startVoiceRecognition() {
        if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
            alert("Your browser does not support speech recognition.");
            return;
        }

        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onstart = function () {
            isRecording = true;
            speakButton.style.display = "none";
            stopSpeakButton.style.display = "block";
            displayMessage("AI", "Recording your response... Click 'Finished Recording' when done.");
        };

        recognition.onresult = function (event) {
            let transcript = event.results[0][0].transcript;
            displayMessage("You", transcript, true);
            sendMessage(transcript);
        };

        recognition.onerror = function (event) {
            console.error("Speech recognition error:", event);
            displayMessage("AI", "Voice input error. Please try again.");
        };

        recognition.onend = function () {
            isRecording = false;
            speakButton.style.display = "block";
            stopSpeakButton.style.display = "none";
        };

        recognition.start();
    }

    function stopVoiceRecognition() {
        if (recognition && isRecording) {
            recognition.stop();
            isRecording = false;
        }
    }

    speakButton.addEventListener("click", startVoiceRecognition);
    stopSpeakButton.addEventListener("click", stopVoiceRecognition);

    // Start the chat with an initial AI message
    displayMessage("AI", "Welcome to your Sales Growth Roadmap! Let's get started.");
    setTimeout(() => displayMessage("AI", "What's your full name?"), 1500);
});
