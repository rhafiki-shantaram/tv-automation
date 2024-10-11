import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Emulate __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to format the current date and time for the filename
function getFormattedDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

// Function to walk through the directory and get file structure
function getProjectStructure(dir, excludeDirs = ['node_modules', 'projStructs'], excludeFiles = ['genrateProjectStructure.mjs', 'package-lock.json']) {
  let results = [];

  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    // Exclude directories and specific files
    if (stat && stat.isDirectory()) {
      if (!excludeDirs.includes(file)) {
        results.push({
          type: 'directory',
          name: file,
          path: fullPath,
          children: getProjectStructure(fullPath, excludeDirs, excludeFiles) // Recursively go into directories
        });
      }
    } else {
      if (!excludeFiles.includes(file)) {
        const fileContent = fs.readFileSync(fullPath, 'utf-8');
        results.push({
          type: 'file',
          name: file,
          path: fullPath,
          content: fileContent.replace(/\n/g, '\\n') // Replacing new lines with \n
        });
      }
    }
  });

  return results;
}

// Function to generate the JSON representation and save to a file
function generateProjectStructureJson() {
  const projectDir = path.resolve(__dirname); // Get current project directory

  // Exclude the script itself and "projStructs" directory
  const excludeDirs = ['node_modules', 'projStructs'];
  const excludeFiles = ['genrateProjectStructure.mjs', 'package-lock.json']; // Explicitly include 'genrateProjectStructure.mjs' and 'package-lock.json'

  const projectStructure = getProjectStructure(projectDir, excludeDirs, excludeFiles);

  // Format date and time for the filename
  const formattedDateTime = getFormattedDateTime();

  // Ensure "projStructs" directory exists
  const outputDir = path.join(__dirname, 'projStructs');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  // Create the output file path with date-time in the filename
  const outputFile = path.join(outputDir, `project_structure_${formattedDateTime}.json`);

  const jsonContent = JSON.stringify(projectStructure, null, 2); // Pretty print JSON

  // Save the JSON content to a file
  fs.writeFileSync(outputFile, jsonContent, 'utf-8');

  console.log(`Project structure saved to ${outputFile}`);
}

// Run the script to generate the project structure JSON file
generateProjectStructureJson();
