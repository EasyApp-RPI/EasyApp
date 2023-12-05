const fs = require('fs');
const pdf = require('pdf-parse');
const readline = require('readline');

//create a readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//structure of the parsed cover letter
interface ParsedCoverLetter {
  name: string;
  address: string;
  body: string;
}

//open IndexedDB or create it if it doesn't exist
const openDB = (): Promise<IDBDatabase> => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = window.indexedDB.open('FilesDB', 1);

    //error when database is not found
    request.onerror = (event: Event) => {
      reject(new Error('Error opening database'));
    };

    request.onsuccess = (event: Event) => {
      const target = event.target as IDBOpenDBRequest;
      const db = target.result as IDBDatabase;

      if (db) {
        resolve(db);
      } else {
        reject(new Error('Failed to open database'));
      }
    };

    request.onupgradeneeded = (event: Event) => {
      const target = event.target as IDBOpenDBRequest;
      const db = target.result as IDBDatabase;

      //stores the files in this object
      db.createObjectStore('files', { keyPath: 'id' });
    };
  });
};

//data from the parsed pdf is saved to IndexDB
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
      //error message when request fails
      request.onerror = () => {
        console.error('Error saving data to database');
        reject(new Error('Error saving data to database'));
      };
    });
  } catch (error) {
    console.error('Error opening database:', error.message);
    throw error;
  }
};

//This function parses the cover letter into the name, address, and the body message
const parseCoverLetterFromPdf = async (pdfPath: string): Promise<void> => {
  try {
    //reads the pdf
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

    //calls the function to save data into IndexDB
    await savePdfDataToDB('coverLetter', Buffer.from(JSON.stringify(outputJson)));

    console.log('Cover letter data saved to IndexedDB.');
  } catch (error) {
    console.error('Error parsing PDF:', error.message);
  }
};

//this function retrieves data from the database
async function getPdfDataFromDB(): Promise<Uint8Array | null> {
  try {
    //opens the database and retrieves the cover letter data and saves it into the request
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
