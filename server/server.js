import express from 'express';
import rateLimit from 'express-rate-limit';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';
import cronjob from 'node-cron';
import fetch from 'node-fetch';


dotenv.config();


const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.set('trust proxy', 3)
app.get('/ip', (request, response) => response.send(request.ip))

 // Create a rate limiter


 const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  keyGenerator: (req) => req.ip,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Please do not spam me'
});

// Apply the rate limiter to all routes except the cron job route
app.use((req, res, next) => {
  if (req.path === '/cron-job-route') {
    next();
  } else {
    limiter(req, res, next);
  }
  });

  // Define a route for the cron job

app.get('/cron-job-route', (req, res) => {

  const serverUrl = 'https://nexus-bnue.onrender.com';

  console.log(`Server ${serverUrl} is alive.`);

  res.sendStatus(200);
});


// Schedule the cron job to run every 10 minutes
cronjob.schedule('*/10 * * * *', () => {
  // Send a GET request to the cron job route to execute the logic
  const cronJobUrl = 'https://nexus-bnue.onrender.com/cron-job-route';

  fetch(cronJobUrl)
    .then((response) => {
      if (response.ok) {
        console.log('Cron job executed successfully.');
      } else {
        throw new Error('Request failed with status code ' + response.status);
      }
    })
    .catch((error) => {
      console.log('Error executing cron job:', error.message);
    });
});

app.get('/', async (_, res) => {
    try {
        res.status(200).send({
            bot: "Welcome to Nexus Adam Young's Personal Assistant! I'm here to provide you with information and answer any questions you have about Adam's skills, projects and experiences as a recent graduate in software engineering.",
            suggestions: [
              "Provide a list of sample questions to ask about Adam", 
          ]
        });
    } catch (error) {
        res.status(500).send({ error });
    }
});


app.post('/', async (req, res) => {
    try {
      const userPrompt = req.body.prompt;
  
      // Check if the user prompt mentions
      const isAboutAdam = userPrompt.toLowerCase().includes("adam");
      const isAboutSkills = userPrompt.toLowerCase().includes("skills");
      const isAboutBootcamp = userPrompt.toLowerCase().includes("bootcamp")
      const isAboutProjects =  userPrompt.toLowerCase().includes("projects")
      const isAboutHobbies = userPrompt.toLowerCase().includes("hobbies")
      const isAboutPicture = userPrompt.toLowerCase().includes("picture")
      const isAboutSampleQuestions = userPrompt.toLowerCase().includes("sample")

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
          ]
        });
      } else if (isAboutSkills && isAboutAdam){
        return res.send({
          bot: 
`Adam is proficient in PHP, JavaScript, React, ExpressJS, Node.js, and Tailwind, with hands-on experience in developing web applications, creating RESTful APIs, and implementing responsive UI designs. Adam demonstrates proficiency in hosting technologies such as Netlify, Render, and Azure, enabling him to effectively deploy and manage web applications.

To ensure stability and quality, Adam utilizes industry-standard testing frameworks like PHPUnit and Jest. This allows him to conduct thorough testing, ensuring the reliability and robustness of his software solutions.

With experience working with Cloudflare CDN and a comprehensive skill set, Adam excels in delivering high-quality and performant web applications.`,
suggestions: [
  "Can you provide details about Adam Young's experience at iO Academy's Full Stack Track bootcamp?",
  "What projects has Adam has done so far?",
  "What are Adam's hobbies and interests outside of software development?",
  "Can you provide a picture of Adam Young?",
],
        })
      }
      
      else if (isAboutProjects && isAboutAdam){
        return res.send({
          bot: `<h2>Here is a selection of Adam's projects that he has worked on:</h2> ${projectList}`,
          suggestions: [
            "What are Adam's skills and technologies expertise?",
            "Can you provide details about Adam Young's experience at iO Academy's Full Stack Track bootcamp?",
            "What are Adam's hobbies and interests outside of software development?",
            "Can you provide a picture of Adam Young?",
          ],
        })
      } 
      else if (isAboutHobbies && isAboutAdam){
        return res.send({
          bot: `Outside of software development Adam enjoys playing chess to stimulate his strategic thinking. He keeps physically fit by regularly training in the gym, he likes to play rugby and achieved his Wales Rugby League U19 cap at the age of 16. Adam's passion for continuous learning drives him to stay updated with the latest trends and technologies in the software development field.`,
          suggestions: [
            "What are Adam's skills and technologies expertise?",
            "Can you provide details about Adam Young's experience at iO Academy's Full Stack Track bootcamp?",
            "What projects has Adam has done so far?",
            "Can you provide a picture of Adam Young?",
          ],
        })
      }
      
      else if (isAboutPicture && isAboutAdam){
        return res.send({
          bot: `<h2>Here is a picture of Adam from his graduation day:</h2> ${adamPicture}`,
          suggestions: [
            "What are Adam's skills and technologies expertise?",
            "What projects has Adam has done so far?",
            "Can you provide details about Adam Young's experience at iO Academy's Full Stack Track bootcamp?",
            "What are Adam's hobbies and interests outside of software development?",
        ],
        })
      } else if (isAboutBootcamp && isAboutAdam){
        return res.send({
          bot: `Adam Young recently graduated from the Full Stack Track course at iO Academy. Throughout his journey, Adam had the opportunity to collaborate and work closely with a diverse team of 8 developers, forming a cohesive SCRUM team that worked together on various projects to meet the product owner's requirements. He earned his agile professional certification and honed his problem-solving and analytical skills during his time there.`,
          suggestions: [
            "What are Adam's skills and technologies expertise?",
            "What projects has Adam has done so far?",
            "What are Adam's hobbies and interests outside of software development?",
            "Can you provide a picture of Adam Young?",
        ],
        })
      }
      
      else if (isAboutSampleQuestions && isAboutAdam){
        return res.send({
          bot: `Sample questions about Adam Young: 

1) What are Adam's skills and technologies expertise?
2) Can you provide details about Adam Young's experience at iO Academy's Full Stack Track bootcamp?
3) What projects has Adam has done so far?
4) What are Adam's hobbies and interests outside of software development?
5) Can you provide a picture of Adam Young?
        `,
                suggestions: [
                  "What are Adam's skills and technologies expertise?",
                  "Can you provide details about Adam Young's experience at iO Academy's Full Stack Track bootcamp?",
                  "What projects has Adam has done so far?",
                  "What are Adam's hobbies and interests outside of software development?",
                  "Can you provide a picture of Adam Young?",
              ],
        })
      }
      
      else if (!isAboutAdam) {
        return res.send({
          bot: "I'm the assistant for Adam Young, and I can only answer questions about Adam. Please include his first name in your question or you can use the suggestion buttons below.",
          suggestions: [
            "Provide a list of sample questions to ask about Adam", 
          ],
        });
      } else {
        
        const prompt = `You are a world-class assistant and question answerer for Adam Young.
              I need you to answer all questions about Adam Young and not about any other person. Here is some information about Adam Young to help answer the question that you get given, first scan through the information after reading the user prompt and give only relevant information:
  
              Introduction:
              - Adam Young is a 21 years old talented software engineer from Weston-super-Mare, UK. 
              - He recently graduated from the Full Stack Track course at iO Academy boot camp. 
              - Adam gained valuable experience working in a team of 8 developers on various group projects and earned his agile professional certification. 
              - He is now on the job hunt to get a job as a Junior Software engineer.
  
              Skills:
              - Adam has a strong proficiency in technologies like PHP, JavaScript, React, ExpressJS, Node.js and Tailwind.
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
  
              If the user's question is not relevant to Adam answer the question then remind them it is not relevant to Adam.

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


      res.status(200).send({
        bot: formattedResponse,
        suggestions: [
          "Provide a list of sample questions to ask about Adam", 
        ],
      });
    } catch (error) {
      res.status(500).send({ error });
    }
  });
  

app.listen(5000, () => console.log('Server is running on port http://localhost:5000'));