import express from 'express';
import limiter from './src/middlewares/rateLimiter.js';
import cors from 'cors';
import routes from './src/routes/routes.js';
import promptHandler from './src/controllers/prompt.js';
import './src/cron/cronJob.js';


const app = express();
app.use(cors());
app.use(express.json());

app.set('trust proxy', 4)

// Mount the routes from routes.js
app.use(routes);

// Apply the rate limiter to all routes except the cron job route
app.use((req, res, next) => {
  if (req.path === '/cron-job-route') {
    next();
  } else {
    limiter(req, res, next);
  }
  });

app.post('/', promptHandler);
  

app.listen(5000, () => console.log('Server is running on port http://localhost:5000'));
