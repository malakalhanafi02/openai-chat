//use the Web Speech API for speech recognition and integrates it with a form submission to an API endpoint that interacts with the OpenAI API

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)(); // Create a new instance of SpeechRecognition or webkitSpeechRecognition for diff compatibility

const user_input = document.getElementById('user_input'); // textarea for user input
const startRecordBtn = document.getElementById('start-record-btn'); // button to start recording
const responseDiv = document.getElementById('response'); // display the response from GPT-3.5
const statusDiv = document.getElementById('status'); // display the status messages


recognition.continuous = false; // to stop after the first result is returned
recognition.interimResults = false; // to get the final result only not interim 
recognition.lang = 'ar-SA'; // language for speech recognition

startRecordBtn.addEventListener('click', () => {
    statusDiv.innerHTML = 'الاستماع...'; // indicates it's listening
    recognition.start();
});

recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript; // get the transcript of the speech and set the value of the textarea to the transcript
    user_input.value = transcript; 
    statusDiv.innerHTML = 'تم التعرف على الكلام. جاري الإرسال إلى GPT-3.5...'; // indicates it's processing

    const user_input_value = user_input.value;
    responseDiv.innerHTML = 'جاري المعالجة...';

    // handles the result of speech recognition (when the user clicks the speak button)
    // it processes the result in the recognition.onresult event handler
    try {
        const response = await fetch('/chat', { // send the user input to the server via a POST request
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded' //url encoding
            },
            body: `user_input=${encodeURIComponent(user_input_value)}` // encode the user input before sending it
        });

        if (response.ok) { // check if the response is successful
            const responseText = await response.text(); // get the response from the server
            responseDiv.innerHTML = `GPT-3.5 يقول: ${responseText}`; // display the response from GPT-3.5
            statusDiv.innerHTML = 'تم استلام الرد.'; // indicates the response has been received
            adjustHeight(responseDiv);
        } else { // handle errors
            responseDiv.innerHTML = 'حدث خطأ. حاول مرة أخرى.';  
            statusDiv.innerHTML = 'حدث خطأ أثناء معالجة الطلب.'; 
        }
    } catch (error) { 
        responseDiv.innerHTML = 'حدث خطأ. حاول مرة أخرى.';
        statusDiv.innerHTML = 'حدث خطأ أثناء معالجة الطلب.';
    }
};


recognition.onerror = (event) => { 
    console.error('Recognition error:', event.error); // log the error to the console
    statusDiv.innerHTML = 'حدث خطأ في التعرف: ' + event.error; // display the error message
};

//event listener for when the user manually types input into the text area and submits the form
document.getElementById('chatForm').addEventListener('submit', async (event) => { // 'submit' event listener 
    event.preventDefault(); // prevent the default form submission
    statusDiv.innerHTML = 'جارٍ الإرسال إلى GPT-3.5...'; // indicates it's processing

    const user_input_value = user_input.value;
    responseDiv.innerHTML = 'جاري المعالجة...';

    try {  // send the user input to the server via a POST request
        const response = await fetch('/chat', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `user_input=${encodeURIComponent(user_input_value)}`
        });

        if (response.ok) {
            const responseText = await response.text();
            responseDiv.innerHTML = `GPT-3.5 يقول: ${responseText}`;
            statusDiv.innerHTML = 'تم استلام الرد.';
            adjustHeight(responseDiv);
        } else {
            responseDiv.innerHTML = 'حدث خطأ. حاول مرة أخرى.';
            statusDiv.innerHTML = 'حدث خطأ أثناء معالجة الطلب.';
        }
    } catch (error) {
        responseDiv.innerHTML = 'حدث خطأ. حاول مرة أخرى.';
        statusDiv.innerHTML = 'حدث خطأ أثناء معالجة الطلب.';
    }
});

function adjustHeight(element) {
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`; // adjust height based on content
}
