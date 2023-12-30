async function typeWriter(text, element) {
    let i = 0;
    const speed = 100; // Adjust typing speed as needed

    async function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            await new Promise(resolve => setTimeout(type, speed));
        }
    }

    await type();
}

async function sendQuery() {
    const userInput = document.getElementById('textSpeech').value;
    const responseDiv = document.getElementById('reponse_msg');
    responseDiv.innerHTML += `<p>User: ${userInput}</p>`;

    const response = await axios.post('http://127.0.0.1:8000/analyse', { texte: userInput });
    const responseData = response.data;

    const chatbotResponse = `<p>Chatbot: <span id="responseSpan"></span></p>`;
    responseDiv.innerHTML += chatbotResponse;

    // Use typewriter effect for the chatbot response
    await typeWriter(responseData.msg, document.getElementById('responseSpan'));

    // Clear input field
    document.getElementById('textSpeech').value = '';
    
}

function readResponse() {
    const chatbotResponse = document.getElementById('responseSpan').innerText;

    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(chatbotResponse);
        utterance.lang = 'en-US'; // Set the language to English (United States)

        speechSynthesis.speak(utterance);
    } else {
        alert('Speech synthesis is not supported in this browser.');
    }
}

function startSpeechToText() {
    const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
    
    recognition.lang = 'en-US'; 

    recognition.onresult = (event) => {
        const result = event.results[0][0].transcript;
        document.getElementById('textSpeech').value = result;
    };

    recognition.start();
}
