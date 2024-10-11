// src/modules/logicHandler.mjs
import {
  isTeamViewerRunning,
  terminateTeamViewer,
  launchTeamViewer,
} from './processManager.mjs';
import { startInteractivityCheckLoop } from './interactivityChecker.mjs';

// Function to trigger the TeamViewer logic and return credentials
export async function triggerTeamViewerLogic() {
  return new Promise((resolve, reject) => {
    try {
      // Ensure TeamViewer is running
      if (isTeamViewerRunning()) {
        terminateTeamViewer();
      }
      launchTeamViewer();

      // Wait for 10 seconds before starting the interactivity check loop
      setTimeout(() => {
        console.log('Starting interactivity check after confirming TeamViewer is active...');
        startInteractivityCheckLoop(resolve, reject);
      }, 10000); // Adjust the delay if needed
    } catch (error) {
      reject(error);
    }
  });
}