const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
let sessionHistory = []; // Store conversation history

// Function to display messages
function displayMessage(sender, message, isUser = false) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("chat-message", isUser ? "user-message" : "bot-message");
    msgDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to send messages to the AI backend
function sendMessage(userText) {
    if (!userText) return;
    
    displayMessage("You", userText, true);
    userInput.value = "";

    sessionHistory.push({ user: userText });

    fetch("https://propcycle-ai-bot.andy-fc3.workers.dev/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, sessionHistory })
    })
    .then(response => response.json())
    .then(data => {
        if (data.response) {
            displayMessage("AI", data.response);
            sessionHistory.push({ bot: data.response });
        }
        if (data.options && data.options.length > 0) {
            displayOptions(data.options);
        }
    })
    .catch(error => {
        console.error("Error:", error);
        displayMessage("AI", "There was a problem connecting to the AI.");
    });
}

// Function to show AI options as buttons
function displayOptions(options) {
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

// Automatically start conversation when the page loads
window.onload = function() {
    fetch("https://propcycle-ai-bot.andy-fc3.workers.dev/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "", sessionHistory })
    })
    .then(response => response.json())
    .then(data => {
        if (data.response) {
            displayMessage("AI", data.response);
            sessionHistory.push({ bot: data.response });
        }
        if (data.options && data.options.length > 0) {
            displayOptions(data.options);
        }
    })
    .catch(error => {
        console.error("Error:", error);
        displayMessage("AI", "There was a problem connecting to the AI.");
    });
};

// Attach event listeners
sendButton.addEventListener("click", () => sendMessage(userInput.value.trim()));
userInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") sendMessage(userInput.value.trim());
});
