// src/index.mjs
import { isTeamViewerRunning, terminateTeamViewer, launchTeamViewer } from './modules/processManager.mjs';
import { startInteractivityCheckLoop } from './modules/interactivityChecker.mjs';

async function main() {
  console.log('Running main logic: Checking TeamViewer and Interactivity...');
  
  // Main logic to run immediately (e.g., TeamViewer logic)
  if (isTeamViewerRunning()) {
    console.log('TeamViewer is running. Restarting...');
    terminateTeamViewer();
    launchTeamViewer();
  } else {
    console.log('TeamViewer is not running. Launching...');
    launchTeamViewer();
  }

  // Wait a bit before checking interactivity
  await new Promise((resolve) => setTimeout(resolve, 5000)); // 5-second delay for TeamViewer to start

  startInteractivityCheckLoop(
    (credentials) => {
      console.log('Interactivity check passed and credentials extracted:', credentials);
    },
    (error) => {
      console.error('Interactivity check failed:', error);
    }
  );
}

main(); // Run the main function immediately
