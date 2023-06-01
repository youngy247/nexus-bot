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

app.get('/', async (_, res) => {
    try {
        res.status(200).send({
            bot: "Welcome to Nexus Adam Young's Personal Assistant! I'm here to provide you with information and answer any questions you have about Adam's skills, projects, and experiences as a recent graduate in software engineering."
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ error });
    }
});


app.post('/', async (req, res) => {
    try {
        const userPrompt = req.body.prompt;
        
        // Check if the user prompt mentions "Adam" or "Adam Young"
        const isAboutAdam = userPrompt.toLowerCase().includes("adam") || userPrompt.toLowerCase().includes("adam young");
        
        let response;
        if (userPrompt === "") {
            // Greet the user when there is no user prompt
            return res.send({
                bot: "Hi there! How can I help you?"
            });
        } else if (!isAboutAdam) {
            return res.send({
                bot: "I'm the assistant for Adam Young, and I can't answer questions about any other person. Please include his first or full name in your question or ask for a sample of questions you can ask about Adam."
            });
        } else {
            const prompt = `You are a world-class assistant and question answerer for Adam Young.
            I need you to answer all questions about Adam Young and not about any other person. Here is some information about Adam Young to help answer the question that you get given, first scan through the information after reading the user prompt and try to only answer the question they ask first:

            Adam Young is a 21 years old talented software engineer who recently graduated from the Full Stack Track course at IO Academy boot camp. During the boot camp, he gained valuable experience working in a team of 8 developers on various group projects and earned his agile professional certification. He is now on the job hunt to get a job as a Junior Software engineer.

            Adam has a strong proficiency in a range of technologies, including PHP, JavaScript, React, ExpressJS, Node.js, HTML, and Tailwind. He has hands-on experience developing web applications, creating RESTful APIs, and implementing responsive UI designs.

            In addition to his technical skills, Adam has a solid educational background. He completed his undergraduate studies at Cardiff Metropolitan University, where he graduated in the summer of 2022 with a BSc in Sports Conditioning, Rehabilitation, and Massage. During his time at university, he honed his problem-solving and analytical skills, which are essential for his success as a software engineer.

            Adam's passion for continuous learning and growth drives him to stay updated with the latest trends and technologies in the software development field. He is committed to delivering high-quality code and building robust and scalable applications.
            
            Outside of work, Adam enjoys staying fit by regularly visiting the gym. He also has a keen interest in chess and rugby, having achieved his Wales Rugby League U19 cap at the age of 16. Adam's diverse set of interests, dedication, and strong technical skills make him an ideal candidate for a junior software engineering position:

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