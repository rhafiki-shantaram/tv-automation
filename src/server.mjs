// src/server.mjs
import express from 'express';
import bodyParser from 'body-parser';
import ngrok from 'ngrok';
import routes from './routes.mjs'; // Existing routes
import { sendNgrokUrl } from './modules/ngrokSender.mjs'; // New module to send Ngrok URL

const app = express();

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

app.use('/api', routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  try {
    // Start ngrok when the server starts
    const url = await ngrok.connect(PORT); // Creates an ngrok tunnel
    console.log(`Ngrok tunnel is live at ${url}`);

    // Send the Ngrok URL to the external server via the HTTP request
    await sendNgrokUrl(url); // Send the URL to the external function

  } catch (error) {
    console.error('Error starting Ngrok or sending URL:', error);
  }
});
