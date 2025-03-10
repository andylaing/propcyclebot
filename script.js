document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");
    const speakButton = document.getElementById("speak-button");

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
            console.log("AI Response:", data);
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

    function startRecording() {
        if (isRecording) return;
        isRecording = true;
        displayMessage("AI", "Recording your response...");
        
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = function (event) {
            const transcript = event.results[0][0].transcript;
            console.log("Voice Input:", transcript);
            displayMessage("You", transcript, true);
            sendMessage(transcript);
        };

        recognition.onerror = function (event) {
            console.error("Speech Recognition Error:", event.error);
            displayMessage("AI", "I couldn't hear you clearly. Try again.");
        };

        recognition.onend = function () {
            isRecording = false;
        };

        recognition.start();
    }

    sendButton.addEventListener("click", () => sendMessage(userInput.value.trim()));
    userInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") sendMessage(userInput.value.trim());
    });

    speakButton.addEventListener("click", startRecording);

    // Start the AI conversation immediately on page load
    displayMessage("AI", "Welcome to your Sales Growth Roadmap! Let's get started.");
    setTimeout(() => {
        sendMessage("Start the process");
    }, 2000);
});
