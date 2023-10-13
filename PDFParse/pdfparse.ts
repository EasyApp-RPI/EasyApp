import * as fs from 'fs';
import * as path from 'path';
import * as pdf from 'pdf-parse';
import * as readlineSync from 'readline-sync';

async function convertPdfToJson(): Promise<void> {
  try {
    // Get PDF file path from user input
    const pdfPath = readlineSync.question('Enter the path to the PDF file: ');

    // Check if the file exists
    if (!fs.existsSync(pdfPath)) {
      console.error('Error: The specified file does not exist.');
      return;
    }

    // Read PDF file
    const dataBuffer = fs.readFileSync(pdfPath);

    // Parse PDF
    const data = await pdf(dataBuffer);

    // Extract text content
    const textContent = data.text;

    // Create output file path
    const jsonPath = path.join(__dirname, 'output.json');

    // Write text content to a JSON file
    fs.writeFileSync(jsonPath, textContent);

    console.log('Conversion successful! Text saved to output.json');
  } catch (error) {
    console.error('Error converting PDF to JSON:', error.message);
  }
}

// Call the function to start the conversion
convertPdfToJson();