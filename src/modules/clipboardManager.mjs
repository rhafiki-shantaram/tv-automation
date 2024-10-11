import clipboardy from 'clipboardy';
import util from 'util';
import { exec } from 'child_process';
import { ID_REGEX, PASSWORD_REGEX } from '../utils/regexPatterns.mjs';
import { keyTapMultipleTimes, keyTap } from './screenInteractor.mjs';

// Get clipboard content with fallback
export async function getClipboardContent() {
  try {
    const { stdout } = await util.promisify(exec)('powershell Get-Clipboard');
    return stdout.trim();
  } catch (error) {
    console.error('Fallback clipboard read failed:', error);
    return null;
  }
}

// Extract credentials from clipboard content
export function extractCredentials(clipboardContent) {
  const idMatch = clipboardContent.match(ID_REGEX);
  const passwordMatch = clipboardContent.match(PASSWORD_REGEX);

  if (idMatch && passwordMatch) {
    const id = idMatch[1].replace(/\s+/g, ''); // Remove spaces in ID
    const password = passwordMatch[1];
    console.log(`Extracted ID: ${id}, Password: ${password}`); // LOG credentials
    return { id, password };
  } else {
    console.error('Failed to extract ID or password.');
    return null;
  }
}

// Copy and extract credentials
export async function copyAndExtractCredentials() {
  // Navigate to the credentials area
  keyTapMultipleTimes('tab', null, 1); // Adjust modifier if necessary

  // Copy to clipboard
  keyTap('a', 'control');
  keyTap('c', 'control');

  // Wait for clipboard to update
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const clipboardValue = await getClipboardContent();
  if (clipboardValue) {
    const credentials = extractCredentials(clipboardValue.trim());
    if (credentials) {
      console.log('Credentials successfully extracted:', credentials); // LOG credentials
      return credentials;
    } else {
      throw new Error('Failed to extract credentials.');
    }
  } else {
    throw new Error('Clipboard is empty.');
  }
}
