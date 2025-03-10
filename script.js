document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");
    const speakButton = document.getElementById("speak-button");
    const stopRecordingButton = document.createElement("button");

    let isRecording = false;
    let recognition;
    let conversationState = "start";

    function displayMessage(sender, message, isUser = false) {
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("chat-message", isUser ? "user-message" : "bot-message");
        msgDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function processResponse(userText) {
        if (!userText) return;
        displayMessage("You", userText, true);
        userInput.value = "";

        let aiMessage = "";
        let nextState = conversationState;

        switch (conversationState) {
            case "start":
                aiMessage = "Let's begin. What's your full name?";
                nextState = "get_name";
                break;
            case "get_name":
                aiMessage = `Nice to meet you, ${userText}. What's your business name?`;
                nextState = "get_business_name";
                break;
            case "get_business_name":
                aiMessage = `Great! What is your role in ${userText}? (Owner, Sales Manager, Director, Other)`;
                nextState = "get_role";
                break;
            case "get_role":
                aiMessage = `Got it. Now, where does your business primarily operate? (Regions, States, Cities)`;
                nextState = "get_location";
                break;
            case "get_location":
                aiMessage = `Thanks! Let's talk about your customers. Who is your ideal buyer? (First Home Buyers, Investors, Upgraders, Downsizers, etc.)`;
                nextState = "get_buyer_profile";
                break;
            case "get_buyer_profile":
                aiMessage = `Understood. What motivates these buyers to purchase? (Affordability, Capital Growth, Lifestyle Upgrade, etc.)`;
                nextState = "get_buyer_motivation";
                break;
            case "get_buyer_motivation":
                aiMessage = `Thanks! What type of projects do you build? (Single-Family Homes, Townhouses, Apartments, etc.)`;
                nextState = "get_project_type";
                break;
            case "get_project_type":
                aiMessage = `Noted. What is the average sales price for these projects?`;
                nextState = "get_sales_price";
                break;
            case "get_sales_price":
                aiMessage = `What percentage of your total projects come from this type?`;
                nextState = "get_project_percentage";
                break;
            case "get_project_percentage":
                aiMessage = `Now, let's talk sales. How many sales did you close in 2024?`;
                nextState = "get_sales_volume";
                break;
            case "get_sales_volume":
                aiMessage = `What is your target for 2025?`;
                nextState = "get_sales_target";
                break;
            case "get_sales_target":
                aiMessage = `Thanks! What’s preventing you from reaching that goal? (Lack of Leads, Pricing Issues, Market Conditions, etc.)`;
                nextState = "get_sales_challenges";
                break;
            case "get_sales_challenges":
                aiMessage = `Understood. Finally, what makes you different from your competitors? (Speed, Quality, Price, Local Knowledge, etc.)`;
                nextState = "get_unique_value";
                break;
            case "get_unique_value":
                aiMessage = `Great! We've gathered the key information. Your Sales Growth Roadmap is being generated. Would you like to book a strategy call or download a PDF?`;
                nextState = "final_step";
                break;
            case "final_step":
                aiMessage = `Thanks for your time! A copy of your roadmap will be sent to your email. Have a great day!`;
                nextState = "complete";
                break;
            default:
                aiMessage = `I'm not sure I understood that. Can you clarify?`;
        }

        conversationState = nextState;
        displayMessage("AI", aiMessage);
    }

    function startRecording() {
        if (isRecording) return;
        isRecording = true;
        speakButton.innerText = "Recording...";
        speakButton.style.backgroundColor = "red";

        stopRecordingButton.innerText = "Finished Recording";
        stopRecordingButton.style.backgroundColor = "#007bff";
        stopRecordingButton.style.color = "white";
        stopRecordingButton.style.border = "none";
        stopRecordingButton.style.padding = "10px";
        stopRecordingButton.style.marginTop = "5px";
        stopRecordingButton.style.cursor = "pointer";
        stopRecordingButton.addEventListener("click", stopRecording);

        document.getElementById("chat-container").appendChild(stopRecordingButton);

        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        let capturedText = "";

        recognition.onresult = function (event) {
            capturedText = event.results[0][0].transcript;
        };

        recognition.onerror = function (event) {
            console.error("Speech Recognition Error:", event.error);
            displayMessage("AI", "I couldn't hear you clearly. Try again.");
        };

        recognition.onend = function () {
            isRecording = false;
            speakButton.innerText = "Speak";
            speakButton.style.backgroundColor = "green";
            document.getElementById("chat-container").removeChild(stopRecordingButton);
        };

        recognition.start();
    }

    function stopRecording() {
        if (recognition) {
            recognition.stop();
            setTimeout(() => {
                if (capturedText) {
                    displayMessage("You", capturedText, true);
                    processResponse(capturedText);
                }
            }, 1000);
        }
    }

    sendButton.addEventListener("click", () => processResponse(userInput.value.trim()));
    userInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") processResponse(userInput.value.trim());
    });

    speakButton.addEventListener("click", startRecording);

    // Start AI conversation immediately
    displayMessage("AI", "Welcome to your Sales Growth Roadmap! Let's get started.");
    setTimeout(() => {
        displayMessage("AI", "What's your full name?");
        conversationState = "get_name";
    }, 2000);
});
