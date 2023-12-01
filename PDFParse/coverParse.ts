const fs = require('fs');
const pdf = require('pdf-parse');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

interface ParsedCoverLetter {
  name: string;
  address: string;
  body: string;
}

const openDB = (): Promise<IDBDatabase> => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = window.indexedDB.open('FilesDB', 1);

    request.onerror = (event: Event) => {
      reject('Error opening database');
    };

    request.onsuccess = (event: Event) => {
      const target = event.target as IDBOpenDBRequest;
      const db = target.result as IDBDatabase;

      if (db) {
        resolve(db);
      } else {
        reject('Failed to open database');
      }
    };

    request.onupgradeneeded = (event: Event) => {
      const target = event.target as IDBOpenDBRequest;
      const db = target.result as IDBDatabase;

      db.createObjectStore('files', { keyPath: 'id' });
    };
  });
};

const parseCoverLetterFromPdf = async (pdfPath: string): Promise<void> => {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);

    const pdfText = data.text;

    const regex = /([^]+?)(\b\d{1,5}(?:[-\s]\d{1,5})?(?:[A-Za-z]+\b|\b)[^]+?)([\s\S]*)/;
    const match = pdfText.match(regex);

    if (!match) {
      console.error('Unable to extract name, address, and body from PDF.');
      return;
    }

    const name = match[1].replace(/[\n\r]/g, ' ').trim();
    const address = match[2].replace(/[\n\r]/g, ' ').trim();
    const body = match[3].trim();

    const outputJson: ParsedCoverLetter = { name, address, body };

    // Save the parsed data to IndexedDB
    //await savePdfDataToDB('coverLetter', Buffer.from(JSON.stringify(outputJson)));

    console.log('Cover letter data saved to IndexedDB.');
  } catch (error) {
    console.error('Error parsing PDF:', error.message);
  }
};

async function getPdfDataFromDB(): Promise<Uint8Array | null> {
  try {
    const db = await openDB();
    const transaction = db.transaction('files', 'readonly');
    const objectStore = transaction.objectStore('files');
    const request = objectStore.get('coverLetter');

    return new Promise<Uint8Array | null>((resolve, reject) => {
      request.onsuccess = () => {
        const result = request.result;

        if (result && result.data instanceof Uint8Array) {
          resolve(result.data);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => {
        console.error('Error fetching data from database');
        resolve(null);
      };
    });
  } catch (error) {
    console.error('Error opening database:', error.message);
    return null;
  }
}

// Ask the user for the PDF file path
rl.question('Enter the path to the PDF file: ', (pdfPath) => {
  // Parse cover letter from PDF
  parseCoverLetterFromPdf(pdfPath)
    .then(() => {
      // Retrieve cover letter data from IndexedDB
      return getPdfDataFromDB();
    })
    .then((outputJson) => {
      // Output the result
      console.log('Retrieved data from IndexedDB:', outputJson);
      rl.close();
    })
    .catch((error) => {
      console.error(error);
      rl.close();
    });
});
