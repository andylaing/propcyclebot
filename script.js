const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
const voiceButton = document.getElementById("voice-button");
const confirmVoiceButton = document.getElementById("confirm-voice");

let tempVoiceInput = "";

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

sendButton.addEventListener("click", () => sendMessage(userInput.value.trim()));
userInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") sendMessage(userInput.value.trim());
});

voiceButton.addEventListener("click", async () => {
    const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();
    voiceButton.innerText = "Recording your response...";
    
    recognition.onresult = (event) => {
        tempVoiceInput = event.results[0][0].transcript;
        voiceButton.innerText = "🎤 Speak";
        confirmVoiceButton.style.display = "inline-block";
    };
});

confirmVoiceButton.addEventListener("click", () => {
    sendMessage(tempVoiceInput);
    confirmVoiceButton.style.display = "none";
});
