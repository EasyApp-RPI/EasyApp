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
    let textContent = data.text;

    // Define regular expressions to match email addresses, phone numbers, and house addresses
    const emailRegex = /\b[\w\.-]+@[\w\.-]+\.\w+\b/g;
    const phoneRegex = /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
    const addressRegex = /\b\d+\s[\w\s]+,\s[\w\s]+,\s[\w\s\d]+\b/g;

    // Match and categorize email addresses
    const emails = textContent.match(emailRegex);
    if (emails) {
      textContent = textContent.replace(emailRegex, '');
      textContent += '\nEmail Addresses:\n' + emails.join('\n') + '\n';
    }

    // Match and categorize phone numbers
    const phoneNumbers = textContent.match(phoneRegex);
    if (phoneNumbers) {
      textContent = textContent.replace(phoneRegex, '');
      textContent += '\nPhone Numbers:\n' + phoneNumbers.join('\n') + '\n';
    }

    // Match and categorize house addresses
    const addresses = textContent.match(addressRegex);
    if (addresses) {
      textContent = textContent.replace(addressRegex, '');
      textContent += '\nAddresses:\n' + addresses.join('\n') + '\n';
    }

    // Array of important keywords
    const keywords = ['experience', 'skills', 'education', 'projects', 'achievements', 'interests'];

    // Highlight keywords in uppercase
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi'); // Using RegExp for whole word matching
      textContent = textContent.replace(regex, match => match.toUpperCase());
    });

    // Handle multi-word categories
    textContent = textContent.replace(/\b(Skills & Interests|Projects & Activities)\b/gi, match => match.toUpperCase());

    // Create output file path
    const jsonPath = path.join(__dirname, 'output.json');

    // Write modified text content to a JSON file
    fs.writeFileSync(jsonPath, textContent);

    console.log('Conversion successful! Text saved to output.json.');
  } catch (error) {
    console.error('Error converting PDF to JSON:', error.message);
  }
}

// Call the function to start the conversion
convertPdfToJson();
