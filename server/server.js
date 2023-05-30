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
        if (!isAboutAdam) {
            return res.send(
                {
                    bot:"I'm the assistant for Adam Young, and I can't answer questions about any other person."
                }
                );
        } else {
            const prompt = `You are a world-class assistant and question answerer for Adam Young.
            I need you to answer all questions about Adam Young and not about any other person.
            Adam Young is a young 21-year-old Software engineer who just graduated from the Full Stack Track course at IO Academy boot camp and is now on the job hunt to get a job as a Junior Software engineer.
            He is proficient in PHP, Javascript, all Javascript Frameworks, NodeJs, HTML, and CSS. In his free time, Adam likes to keep fit in the gym, play chess, play rugby, and program:

            ${userPrompt}

            If the person is asking about any Nickname or other name than Adam Young, say "I'm the assistant for Adam Young, and I can't answer questions about any other person". 

            Then, respond with the complete and a well-organized markdown file.

            Make sure to tell only positive things about Adam to help him get a job as a Junior Software Engineer.`;

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