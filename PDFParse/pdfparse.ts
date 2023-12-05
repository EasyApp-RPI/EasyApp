import * as fs from 'fs';
import * as path from 'path';
import * as pdf from 'pdf-parse';

const openDB = (): Promise<IDBDatabase> => {
  // Return a Promise that wraps the logic for opening or upgrading the IndexedDB database
  return new Promise<IDBDatabase>((resolve, reject) => {
    // Use window.indexedDB to open the 'FilesDB' database with version 1
    const request = window.indexedDB.open('FilesDB', 1);

    // Handle errors that may occur during the attempt to open the database
    request.onerror = (event: Event) => {
      reject('Error opening database');
    };

    // Handle successful opening of the database
    request.onsuccess = (event: Event) => {
      // Extract the result from the event and cast it to an IDBDatabase instance
      const target = event.target as IDBOpenDBRequest;
      const db = target.result as IDBDatabase;

      // Check if the database instance is valid and resolve the Promise with it
      if (db) {
        resolve(db);
      } else {
        // Reject the Promise if the database instance is not valid
        reject('Failed to open database');
      }
    };

    // Handle the case where the database version needs an upgrade
    request.onupgradeneeded = (event: Event) => {
      // Extract the result from the event and cast it to an IDBDatabase instance
      const target = event.target as IDBOpenDBRequest;
      const db = target.result as IDBDatabase;

      // Create an object store named 'files' with 'id' as the key path
      db.createObjectStore('files', { keyPath: 'id' });
    };
  });
};

const savePdfDataToDB = async (id: string, data: Uint8Array): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction('files', 'readwrite');
    const objectStore = transaction.objectStore('files');

    const request = objectStore.put({ id, data });

    return new Promise<void>((resolve, reject) => {
      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        console.error('Error saving data to database');
        reject('Error saving data to database');
      };
    });
  } catch (error) {
    console.error('Error opening database:', error.message);
    throw error;
  }
};

interface ParsedInfo {
  category: string;
  content: string[];
}

async function getPdfDataFromDB(): Promise<Uint8Array | null> {
  try {
    // Opens the IndexedDB
    const db = await openDB();

    // Start a 'readonly' transaction on the 'files' object
    const transaction = db.transaction('files', 'readonly');
    
    // Get the object store within the transaction
    const objectStore = transaction.objectStore('files');

    // Gets file based on id
    const request = objectStore.get('resume');

    return new Promise<Uint8Array | null>((resolve, reject) => {
      // When the file is found
      request.onsuccess = () => {
        const result = request.result;
        if (result && result.data instanceof Uint8Array) {
          resolve(result.data);
        } else {
          resolve(null);
        }
      };
      
      // When the file is not found
      request.onerror = () => {
        console.error('Error fetching data');
        resolve(null);
      };
    });
  } catch (error) {
    console.error('Error opening database:', error.message);
    return null;
  }
}

async function convertPdfToJson(): Promise<void> {
  try {
    // Fetch PDF data from IndexedDB
    const pdfData = await getPdfDataFromDB();

    // Check if the file exists
    if (!pdfData) {
      console.error('Error: The specified file does not exist in the database.');
      return;
    }

    // Parse PDF
    const data = await pdf(pdfData);

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
