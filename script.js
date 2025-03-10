document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");
    const speakButton = document.getElementById("speak-button");
    const finishRecordingButton = document.getElementById("finish-recording-button");

    let isRecording = false;
    let recognition;

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
                handleBotOptions(data.options);
            } else {
                displayMessage("AI", "Sorry, I didn't understand that. Could you clarify?");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            displayMessage("AI", "There was a problem connecting to the AI.");
        });
    }

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

    sendButton.addEventListener("click", () => sendMessage(userInput.value.trim()));
    userInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") sendMessage(userInput.value.trim());
    });

    // ---- 🎤 Voice Recognition Logic ----
    function startSpeechRecognition() {
        if (isRecording) return; // Prevent multiple recognitions
        isRecording = true;
        speakButton.innerText = "Recording... Click 'Finished Recording'";

        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onresult = function (event) {
            const transcript = event.results[0][0].transcript;
            userInput.value = transcript;
        };

        recognition.onerror = function (event) {
            console.error("Speech Recognition Error:", event.error);
            displayMessage("AI", "Sorry, I couldn't understand. Try again.");
        };

        recognition.onend = function () {
            isRecording = false;
            speakButton.innerText = "Speak";
            finishRecordingButton.style.display = "block";
        };

        recognition.start();
    }

    function stopSpeechRecognition() {
        if (recognition) {
            recognition.stop();
            finishRecordingButton.style.display = "none";
            sendMessage(userInput.value.trim()); // Send message after recording
        }
    }

    speakButton.addEventListener("click", startSpeechRecognition);
    finishRecordingButton.addEventListener("click", stopSpeechRecognition);

    // ---- Start the AI Conversation ----
    displayMessage("AI", "Welcome to your Sales Growth Roadmap! Let's get started.");
    setTimeout(() => {
        displayMessage("AI", "What's your full name?");
    }, 1000);
});
