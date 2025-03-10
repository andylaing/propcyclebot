// JavaScript Logic for AI Chatbot
const jsContent = `
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

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
window.onload = function() {
    displayMessage("AI", "Hello! How can I assist you today?");
};`;

export { htmlContent, jsContent };
