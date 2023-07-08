import cronjob from 'node-cron';
import fetch from 'node-fetch';

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
