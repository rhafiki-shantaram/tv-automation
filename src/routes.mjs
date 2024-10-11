// src/routes.mjs
import express from 'express';
const router = express.Router();

// Import necessary modules
import { triggerTeamViewerLogic } from './modules/logicHandler.mjs';

// Original route handling TeamViewer logic
router.post('/message', async (req, res) => {
  const { message } = req.body;

  if (message === 'booples') {
    console.log('Received correct password. Triggering TeamViewer logic...');

    try {
      const credentials = await triggerTeamViewerLogic();
      res.json(credentials);
    } catch (error) {
      console.error('Error during TeamViewer logic execution:', error);
      res.status(500).send('An error occurred while processing your request.');
    }
  } else {
    console.log('Incorrect password received.');
    res.status(403).send('Forbidden: Incorrect password.');
  }
});

export default router;
