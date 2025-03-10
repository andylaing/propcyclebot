let isRecording = false;
let recognition;
let recordedText = "";

// Function to start recording
function startVoiceRecognition() {
    if (!isRecording) {
        recognition = new webkitSpeechRecognition() || new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onstart = function () {
            isRecording = true;
            displayMessage("AI", "Recording your response...");
            document.getElementById("stop-recording-btn").style.display = "block"; // Show submit button
        };

        recognition.onresult = function (event) {
            recordedText = event.results[0][0].transcript;
        };

        recognition.onerror = function (event) {
            console.error("Speech recognition error:", event.error);
            displayMessage("AI", "Sorry, I couldn’t hear that. Try again.");
            isRecording = false;
        };

        recognition.onend = function () {
            isRecording = false;
        };

        recognition.start();
    }
}

// Function to submit recorded response
function submitVoiceResponse() {
    if (recordedText.trim() !== "") {
        displayMessage("You", recordedText, true);
        sendMessage(recordedText);
    } else {
        displayMessage("AI", "I didn't catch that. Try again.");
    }
    document.getElementById("stop-recording-btn").style.display = "none"; // Hide submit button
}

// Attach event listeners
document.getElementById("speak-button").addEventListener("click", startVoiceRecognition);
document.getElementById("stop-recording-btn").addEventListener("click", submitVoiceResponse);
