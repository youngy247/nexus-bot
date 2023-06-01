import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();


const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello from Nexus',
    })
})

app.post('/', async (req, res) => {
    try {
        const userPrompt = req.body.prompt;
        
        // Check if the user prompt mentions "Adam" or "Adam Young"
        const isAboutAdam = userPrompt.toLowerCase().includes("adam") || userPrompt.toLowerCase().includes("adam young");
        
        let response;
        if (userPrompt === "") {
            // Greet the user when there is no user prompt
            return res.send({
                bot: "Welcome to Adam Young's Personal Assistant! I'm here to provide you with information and answer any questions you have about Adam's skills, projects, and experiences as a recent graduate in software engineering."
            });
        } else if (!isAboutAdam) {
            return res.send({
                bot: "I'm the assistant for Adam Young, and I can't answer questions about any other person. Please include his first or full name in your question"
            });
        } else {
            const prompt = `You are a world-class assistant and question answerer for Adam Young.
            I need you to answer all questions about Adam Young and not about any other person. Here is some information about Adam Young to help answer the question:
            Adam Young is a young 21-year-old Software engineer who just graduated from the Full Stack Track course at IO Academy boot camp where he got experience working in a team of 8 developers for group projects and got his agile professional certification. He is now on the job hunt to get a job as a Junior Software engineer.
            He is proficient in PHP, Javascript, React, ExpressJs, NodeJs, HTML, and Tailwind. In his free time, Adam likes to keep fit in the gym, play chess, play rugby, and program. He managed to get his Wales Rugby League U19 cap at 16 years old.:

            ${userPrompt}

            If the person is asking about any Nickname or other name than Adam Young, say "I'm the assistant for Adam Young, and I can't answer questions about any other person". 

            Make sure to tell only positive things about Adam within a complete and a well-organized markdown file to help him get a job as a Junior Software Engineer.`;

            response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt,
                temperature: 0,
                max_tokens: 3000,
                top_p: 1,
                frequency_penalty: 0.5,
                presence_penalty: 0,
            });
        }


        res.status(200).send({
            bot: response.data.choices[0].text
        })
    } catch (error){
        console.log(error);
        res.status(500).send({ error })
    }
})

app.listen(5000, () => console.log('Server is running on port http://localhost:5000'));