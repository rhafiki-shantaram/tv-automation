// test.mjs

import {
    isTeamViewerRunning,
    terminateTeamViewer,
    launchTeamViewer,
  } from './src/modules/processManager.mjs';
  
  import { startInteractivityCheckLoop } from './src/modules/interactivityChecker.mjs';
  
  // A helper function to wait for a specified number of milliseconds
  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  
  async function runTest() {
    try {
      console.log('--- Running Local Test for TeamViewer Logic ---');
      
      // Check if TeamViewer is running
      if (isTeamViewerRunning()) {
        console.log('TeamViewer is already running. Terminating it now...');
        terminateTeamViewer();
        await wait(3000); // Wait for termination to complete
      }
      
      // Launch TeamViewer
      launchTeamViewer();
  
      // Wait for TeamViewer to launch properly before proceeding
      await wait(10000); // 10 seconds
  
      console.log('TeamViewer should now be running and in focus.');
      
      // Start interactivity check loop (this simulates checking interaction as per the API flow)
      console.log('Starting interactivity check...');
      startInteractivityCheckLoop(
        (credentials) => {
          console.log('Interactivity check passed and credentials extracted:', credentials);
        },
        (error) => {
          console.error('Interactivity check failed:', error);
        }
      );
    } catch (error) {
      console.error('Error during the test run:', error);
    }
  }
  
  runTest();
  