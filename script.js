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
        body: JSON.stringify({ message: userText, sessionHistory: [] })
    })
    .then(response => response.json())
    .then(data => {
        displayMessage("AI", data.response);
        if (data.options) {
            data.options.forEach(option => {
                const button = document.createElement("button");
                button.innerText = option;
                button.classList.add("option-button");
                button.onclick = () => sendMessage(option);
                chatBox.appendChild(button);
            });
        }
    })
    .catch(error => console.error("Error:", error));
}

sendButton.addEventListener("click", () => sendMessage(userInput.value.trim()));
userInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") sendMessage(userInput.value.trim());
});
