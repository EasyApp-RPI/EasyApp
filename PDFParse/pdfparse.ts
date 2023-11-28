import * as fs from 'fs';
import * as path from 'path';
import * as pdf from 'pdf-parse';
import * as readlineSync from 'readline-sync';

interface ParsedInfo {
  category: string;
  content: string[];
}

async function convertPdfToJson(): Promise<void> {
  try {
    // CHANGE THIS LINE TO READ FROM THE DATABASE
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

    // Example usage of parseResume function
    const parsedInfo = parseResume(jsonPath);

    // Write the parsed information to a JSON file
    const outputJsonPath = path.join(__dirname, 'parsed_output.json');
    fs.writeFileSync(outputJsonPath, JSON.stringify(parsedInfo, null, 2));

    console.log('Parsed Information:');
    console.log(parsedInfo);
    console.log(`Parsed information has been written to ${outputJsonPath}`);
  } catch (error) {
    console.error('Error converting PDF to JSON:', error.message);
  }
}

function isName(line: string, isFirstNonEmptyLine: boolean): string | null {
  const trimmedLine = line.trim();
  return isFirstNonEmptyLine && trimmedLine.length > 0 ? trimmedLine : null;
}

function parseResume(jsonPath: string): ParsedInfo[] {
  const lines = fs.readFileSync(jsonPath, 'utf-8').split('\n');

  const parsedInfo: ParsedInfo[] = [];
  let currentCategory: string | null = null;
  let isFirstNonEmptyLine = true;

  lines.forEach(line => {
    // Skip empty lines
    if (!line.trim()) {
      return;
    }

    // Check if the line is the name
    const name = isName(line, isFirstNonEmptyLine);
    if (name) {
      parsedInfo.push({ category: 'Name', content: [name] });
      isFirstNonEmptyLine = false; // Set to false after finding the first non-empty line
      return;
    }

    // Identify section headers and set the current category
    const sectionMatch = line.match(/^[A-Z\s]+$/);
    if (sectionMatch) {
      currentCategory = sectionMatch[0].trim();
      return;
    }

    // Add content to the current category
    if (currentCategory !== null) {
      const index = parsedInfo.findIndex(info => info.category === currentCategory);

      if (index === -1) {
        parsedInfo.push({ category: currentCategory, content: [line.trim()] });
      } else {
        parsedInfo[index].content.push(line.trim());
      }
    }
  });

  return parsedInfo;
}

// Call the function to start the conversion
convertPdfToJson();
