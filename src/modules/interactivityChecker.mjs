import {
  clickMiddle,
  keyTapMultipleTimes,
  typeString,
  keyTap,
} from './screenInteractor.mjs';

import {
  getClipboardContent,
  copyAndExtractCredentials,
} from './clipboardManager.mjs';

import { switchToEnglishInput } from './processManager.mjs';
import { EXPECTED_VALUE, INTERACT_CHECK_INTERVAL } from '../config.mjs';

export async function performInteractionCheck() {
  console.log('Performing interactivity check...');

  // Ensure input method is English
  switchToEnglishInput();

  // Step 1: Click in the middle and perform Shift+Tab
  clickMiddle();
  keyTapMultipleTimes('tab', undefined, 3);

  // Step 2: Type the expected value
  typeString(EXPECTED_VALUE);
  console.log(`Typed "${EXPECTED_VALUE}" into the input field`);

  // Step 3: Copy the input value to clipboard
  keyTap('a', 'control');
  keyTap('c', 'control');

  // Step 4: Wait for clipboard to update
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Step 5: Check the clipboard value
  const clipboardValue = await getClipboardContent();
  if (clipboardValue.trim() === EXPECTED_VALUE) {
    console.log('Expected value check passed.');
    return true;
  } else {
    console.log('Expected value check failed.');
    return false;
  }
}

export function startInteractivityCheckLoop(resolve, reject) {
  const intervalFunction = async () => {
    const success = await performInteractionCheck();
    if (success) {
      console.log('Interactivity check passed.');
      try {
        const credentials = await copyAndExtractCredentials();
        console.log('Extracted credentials:', credentials);  // LOG credentials here
        resolve(credentials);
      } catch (error) {
        console.error('Error during credentials extraction:', error);
        reject(error);
      }
    } else {
      console.log('Interactivity check failed. Retrying...');
      setTimeout(intervalFunction, INTERACT_CHECK_INTERVAL);
    }
  };

  intervalFunction();
}
