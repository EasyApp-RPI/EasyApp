const fs = require('fs');
const pdf = require('pdf-parse');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function parseCoverLetterFromPdf(pdfPath) {
  return new Promise(async (resolve, reject) => {
    try {
      // Read the PDF file
      const dataBuffer = fs.readFileSync(pdfPath);

      // Parse the PDF
      const data = await pdf(dataBuffer);

      // Extract text content from the PDF
      const pdfText = data.text;

      // Regular expression to match the name, address, and body
      const regex = /([^]+?)(\b\d{1,5}(?:[-\s]\d{1,5})?(?:[A-Za-z]+\b|\b)[^]+?)([\s\S]*)/;

      // Find matches using the regular expression
      const match = pdfText.match(regex);

      if (!match) {
        console.error('Unable to extract name, address, and body from PDF.');
        resolve(null);
      }

      // Extract the name, address, and body
      const name = match[1].replace(/[\n\r]/g, ' ').trim();
      const address = match[2].replace(/[\n\r]/g, ' ').trim();
      const body = match[3].trim();

      // Create and return the output JSON
      const outputJson = JSON.stringify({ name, address, body });
      resolve(outputJson);
    } catch (error) {
      console.error('Error parsing PDF:', error.message);
      reject(error);
    }
  });
}

// Ask the user for the PDF file path
rl.question('Enter the path to the PDF file: ', (pdfPath) => {
  // Parse cover letter from PDF
  parseCoverLetterFromPdf(pdfPath)
    .then(outputJson => {
      // Output the result
      console.log(outputJson);
      rl.close();
    })
    .catch(error => {
      console.error(error);
      rl.close();
    });
});
