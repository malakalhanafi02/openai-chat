const express = require('express'); //express is a web application framework for Node.js
const bodyParser = require('body-parser'); // parse the body of incoming requests
const { Configuration, OpenAIApi } = require('openai'); //Configuration and OpenAIApi classes 

// Define the API key for the OpenAI API
const OPENAI_API_KEY = 'your_openai_api_key_here'; // Replace this with your actual API key

const app = express();
const configuration = new Configuration({ 
    apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/chat', async (req, res) => {
    const user_input = req.body.user_input; // extract the user's input from the request body
    console.log("User input received:", user_input); 

    try {
        const response = await openai.createChatCompletion({ // call the OpenAI API to generate a chat completion
            model: 'gpt-3.5-turbo', //model to use for the chat completion
            messages: [{ role: 'user', content: user_input }], //messages to use for the chat completion
            max_tokens: 150, // limit how long the response from the model will be
        });

        console.log("API response:", response.data);//log the API response to the console
        res.send(response.data.choices[0].message.content); // send the content of the response back to the client

    } catch (error) {
        if (error.response) {// handle errors from the response
            console.error("Error details:", error.response.status, error.response.data); //log the error details to the console
            res.status(500).send(`Error: ${error.response.status} - ${error.response.data}`); //send an error response to the client with the error details
        } else {
            console.error("Error message:", error.message); //log the error message to the console
            res.status(500).send(`Error: ${error.message}`);
        }
    }
});

app.listen(3000, () => { // start the server on port 3000
    console.log('Server is running on port 3000');
});
