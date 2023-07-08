import express from 'express';

const router = express.Router();

router.get('/cron-job-route', (req, res) => {
  const serverUrl = 'https://nexus-bnue.onrender.com';
  console.log(`Server ${serverUrl} is alive.`);
  res.sendStatus(200);
});

router.get('/', async (_, res) => {
  try {
    res.status(200).send({
      bot: "Welcome to Nexus Adam Young's Personal Assistant! I'm here to provide you with information and answer any questions you have about Adam's skills, projects, and experiences as a recent graduate in software engineering.",
      suggestions: [
        "Provide a list of sample questions to ask about Adam",
      ]
    });
  } catch (error) {
    res.status(500).send({ error });
  }
});

// Export the router
export default router;
