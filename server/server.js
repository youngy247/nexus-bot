import express from 'express';
import rateLimit from 'express-rate-limit';
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


const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 requests per minute
    keyGenerator: (req) => req.ip,
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: 'Please do not spam me'
});

app.use(limiter);


app.get('/', async (_, res) => {
    try {
        res.status(200).send({
            bot: "Welcome to Nexus Adam Young's Personal Assistant! I'm here to provide you with information and answer any questions you have about Adam's skills, projects, and experiences as a recent graduate in software engineering.",
            suggestions: [
              "Provide a list of sample questions to ask about Adam", 
              "Can you provide a picture of Adam Young?",
              "Show me the projects that Adam has done so far",
          ]
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ error });
    }
});


app.post('/', async (req, res) => {
    try {
      const userPrompt = req.body.prompt;
  
      // Check if the user prompt mentions "Adam" 
      const isAboutAdam = userPrompt.toLowerCase().includes("adam");
      const isAboutProjects =  userPrompt.toLowerCase().includes("project")
      const isAboutPicture = userPrompt.toLowerCase().includes("picture")
      const isAboutSampleQuestions = userPrompt.toLowerCase().includes("sample questions")

      // Projects object and formatting html
      const projects = [
        {
          name: 'Wordle Clone',
          description: 'Responsive wordle game in vanilla JavaScript',
          liveLink: 'https://23-mar-wordgame.dev.io-academy.uk/',
          sourceCodeLink: 'https://github.com/iO-Academy/2023-mar-wordle',
        },
        {
          name: 'Job Search React App',
          description: 'A web application for users in their job search journey',
          liveLink: 'https://23-mar-icantbelieveitsnotmonster.netlify.app/',
          sourceCodeLink: 'https://github.com/iO-Academy/23-mar-icantbelieveitsnotmonster',
        },
        {
          name: 'Music Player API',
          description: 'A REST API built in PHP for a pre-existing Music Player front-end.',
          liveLink: 'https://23-mar-icantbelieveitsnotspotify.netlify.app/',
          sourceCodeLink: 'https://github.com/iO-Academy/23-mar-icantbelieveitsnotspotify',
        },
        {
          name: '3D Portfolio',
          description: "Interactive website to showcase Adam's skills using React and Three.js",
          liveLink: 'https://adamyoung.netlify.app/',
          sourceCodeLink: 'https://github.com/youngy247/3d-portfolio',
        },
      ];

      projects.forEach(project => {
          if (project.liveLink) {
            project.liveLink = `<a href="${project.liveLink}" target="_blank">${project.liveLink}</a>`;
          }
          if (project.sourceCodeLink) {
            project.sourceCodeLink = `<a href="${project.sourceCodeLink}" target="_blank">${project.sourceCodeLink}</a>`;
          }
        });
  
  
        const projectList = projects
              .map(
              project =>
              ` \n${project.name}: ${project.description}\n  - Live link: ${project.liveLink || 'N/A'}\n  - Source code: ${project.sourceCodeLink || 'N/A'}`
          )
          .join('\n\n');

          const adamPicture = ` \n<img src="grad-pic.jpeg" alt="Adam's graduation picture" class="grad-pic"/>`
  
      let response;
      if (userPrompt === "") {
        // Greet the user when there is no user prompt
        return res.send({
          bot: "Hi there! How can I help you?",
          suggestions: [
            "Provide a list of sample questions to ask about Adam", 
            "Can you provide a picture of Adam Young?",
            "Show me the projects that Adam has done so far",
          ]
        });
      } else if (isAboutProjects && isAboutAdam){
        return res.send({
          bot: `<h2>Here is a selection of Adam's projects that he has worked on:</h2> ${projectList}`,
          suggestions: [
            "Provide a list of sample questions to ask about Adam",
            "Can you provide a picture of Adam Young?"
          ],
        })
      } else if (isAboutPicture && isAboutAdam){
        return res.send({
          bot: `<h2>Here is a picture of Adam from his graduation day:</h2> ${adamPicture}`,
          suggestions: [
            "Provide a list of sample questions to ask about Adam",
            "Show me the projects that Adam has done so far",
        ],
        })
      } else if (isAboutSampleQuestions && isAboutAdam){
        return res.send({
          bot: `Sample questions about Adam Young: 

1) What are Adam's skills and technologies expertise?
2) Can you provide more details about Adam Young's experience at iO Academy boot camp?
3) What are Adam's hobbies and interests outside of work?
4) How does Adam Young stay updated with the latest trends in software development?
5) What certifications has Adam Young earned?
        `,
                suggestions: [
                  "Can you provide a picture of Adam Young?",
                  "Show me the projects that Adam has done so far",
              ],
        })
      }
      
      else if (!isAboutAdam) {
        return res.send({
          bot: "I'm the assistant for Adam Young, and I can only answer questions about Adam. Please include his first name in your question or you can use the suggestion buttons below.",
          suggestions: [
            "Provide a list of sample questions to ask about Adam", 
            "Can you provide a picture of Adam Young?",
            "Show me the projects that Adam has done so far",
          ],
        });
      } else {
        
        const prompt = `You are a world-class assistant and question answerer for Adam Young.
              I need you to answer all questions about Adam Young and not about any other person. Here is some information about Adam Young to help answer the question that you get given, first scan through the information after reading the user prompt and try to only answer the question they ask first:
  
              Introduction:
              - Adam Young is a 21 years old talented software engineer from Weston-super-Mare, UK. 
              - He recently graduated from the Full Stack Track course at iO Academy boot camp. 
              - Adam gained valuable experience working in a team of 8 developers on various group projects and earned his agile professional certification. 
              - He is now on the job hunt to get a job as a Junior Software engineer.
  
              Skills:
              - Adam has a strong proficiency in technologies like PHP, JavaScript, React, ExpressJS, Node.js, HTML, and Tailwind.
              - Experienced hosting using Netlify, Render and Azure
              - Utilised PHPUnit and Jest for testing
              - He has hands-on experience developing web applications, creating RESTful APIs, and implementing responsive UI designs.
  
              Projects:
              Wordle Clone game in vanilla JavaScript, Job Search React App, Music Player API, interactive 3D Portfolio using React and ThreeJS

              Picture of Adam:
              ${adamPicture}
  
              Education:
              - Adam completed his undergraduate studies at Cardiff Metropolitan University, graduating in the summer of 2022 with a BSc in Sports Conditioning, Rehabilitation, and Massage. 
              - He honed his problem-solving and analytical skills during his time at university, which are essential for his success as a software engineer.
  
              Passion and Hobbies:
              - Adam's passion for continuous learning and growth drives him to stay updated with the latest trends and technologies in the software development field.
              - He is committed and passionate to delivering high-quality code and building robust and scalable applications.
              - Outside of work, Adam enjoys staying fit by regularly visiting the gym. He also has a keen interest in chess and rugby, having achieved his Wales Rugby League U19 cap at the age of 16. 
              
              Adam's diverse set of interests, dedication, and strong technical skills make him an ideal candidate for a junior software engineering position:
  
              ${userPrompt}
  
              If the user's question is not relevant to Adam answer the question first then remind them it is not relevant to Adam.

              Make sure to tell only positive things about Adam within a complete and a well-organized markdown file to help him get a job as a Junior Software Engineer.`;
  
        response = await openai.createCompletion({
          model: "text-davinci-003",
          prompt,
          temperature: 0.4,
          max_tokens: 1000,
          top_p: 1,
          frequency_penalty: 0.5,
          presence_penalty: 0.4,
        });
      }
    
    const formattedResponse = response.data.choices[0].text;
    const confidenceScore = response["top_p"];

      res.status(200).send({
        bot: formattedResponse,
        suggestions: [
          "Provide a list of sample questions to ask about Adam", 
          "Can you provide a picture of Adam Young?",
          "Show me the projects that Adam has done so far",
        ],
        confidenceScore
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error });
    }
  });
  

app.listen(5000, () => console.log('Server is running on port http://localhost:5000'));