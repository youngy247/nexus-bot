# Personal Assistant Chat Bot

Welcome to the Personal Assistant Chat Bot project! This chat bot is an AI-powered virtual assistant that is aimed to help me get a job as a software developer. It has been developed using JavaScript on the client-side and Node.js with Express.js on the server-side. By integrating with the OpenAI API, this chat bot provides intelligent responses and engages in meaningful conversations.

## Features

- **AI-powered responses**: The chat bot leverages the power of the OpenAI API to generate intelligent and context-aware responses, making it a smart and helpful assistant.

- **Secure communication**: The chat bot implements rate limiting and validation mechanisms to ensure secure and controlled communication between the client and server.

## Requirements

- OpenAI API access token (refer to OpenAI documentation on how to obtain an API key)

## Getting Started

Follow the steps below to set up and run the Personal Assistant Chat Bot on your machine:

1. Clone this repository to your local machine using the following command:

   ```shell
   git clone https://github.com/your-username/personal-assistant-chat-bot.git
   
2. Navigate to the project directory:

    ```shell
    cd personal-assistant-chat-bot

3. Install the required dependencies using NPM:
    
    ```shell
    npm install
    
4. Create a .env file in the project root directory and add your OpenAI API access token to it:

    ```shell
    OPENAI_API_KEY=your-api-key
 
 5. Start the development server using nodemon:

    ```shell
    nodemon server/server.js

  Or, if you don't have nodemon configured, use npm start:
   ```shell
    npm start

