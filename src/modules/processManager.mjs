import { exec, execSync } from 'child_process';
import { TEAMVIEWER_PATH } from '../config.mjs';
import robot from 'robotjs';
import win from 'win-control'; // Import win-control for window management

// Function to switch to English input method if not already English
export function switchToEnglishInput() {
  // PowerShell command to get the current input method
  const psCommand = `
    $currentLang = (Get-WinUserLanguageList).InputMethodTip;
    if ($currentLang -eq '0409:00000409') {
      Write-Output 'English';
    } else {
      Write-Output 'Other';
    }
  `;

  // Execute PowerShell command to check current input language
  exec(`powershell -Command "${psCommand}"`, (err, stdout, stderr) => {
    if (err) {
      console.error('Error checking input language:', stderr);
    } else {
      const currentLanguage = stdout.trim();
      
      if (currentLanguage === 'English') {
        console.log('Input language is already English.');
      } else {
        console.log('Current input language is not English. Switching to English...');
        
        // Manually switch to English using Alt+Shift
        robot.keyToggle('alt', 'down');
        robot.keyTap('shift');
        robot.keyToggle('alt', 'up');
        
        console.log('Language switched to English (Alt+Shift).');
      }
    }
  });
}

// Check if TeamViewer is running
export function isTeamViewerRunning() {
  try {
    execSync('tasklist | findstr /I "TeamViewer.exe"');
    console.log('TeamViewer is running.');
    return true;
  } catch {
    console.log('TeamViewer is not running.');
    return false;
  }
}

// Terminate TeamViewer
export function terminateTeamViewer() {
  try {
    console.log('Terminating TeamViewer...');
    execSync('taskkill /F /IM TeamViewer.exe');
    console.log('TeamViewer terminated.');
  } catch (error) {
    console.error('Error terminating TeamViewer:', error);
  }
}

// Launch TeamViewer and bring it to the front
export function launchTeamViewer() {
  console.log('Launching TeamViewer...');
  const command = `"${TEAMVIEWER_PATH}"`;
  exec(command, (err) => {
    if (err) {
      console.error('Error launching TeamViewer:', err);
    } else {
      console.log('TeamViewer launched successfully.');
      bringTeamViewerToFront(); // Ensure it is brought to the front
    }
  });
}

// Function to bring TeamViewer to the front
function bringTeamViewerToFront() {
  setTimeout(() => {
    console.log('Attempting to bring TeamViewer window to the front...');

    // Get a list of windows with "TeamViewer" in their title
    const windows = win.findByTitle(/TeamViewer/i);
    if (windows.length > 0) {
      const teamViewerWindow = windows[0]; // Assume the first match is correct

      // Bring the window to the front
      teamViewerWindow.bringToTop();
      console.log('Brought TeamViewer window to the front.');

      // Verify if it's the active window
      setTimeout(() => {
        const activeWindow = win.getActiveWindow();
        if (activeWindow.getTitle().match(/TeamViewer/i)) {
          console.log('TeamViewer is now the active window.');
        } else {
          console.error('Failed to bring TeamViewer to the front.');
        }
      }, 1000); // Delay to ensure focus change
    } else {
      console.error('No TeamViewer window found.');
    }
  }, 5000); // Wait for 5 seconds to allow TeamViewer to fully launch
}

// Function to minimize the TeamViewer window
export function minimizeTeamViewerWindow() {
  const windows = win.findByTitle(/TeamViewer/i); // Find the window by title
  if (windows.length > 0) {
    const teamViewerWindow = windows[0];
    teamViewerWindow.minimize(); // Minimize the window
    console.log('TeamViewer window minimized.');
  } else {
    console.error('TeamViewer window not found to minimize.');
  }
}