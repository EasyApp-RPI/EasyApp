function parseCoverLetter(coverLetter) {
  // Regular expression to match the name, assuming it ends with a comma
  const nameRegex = /^(.*?),/;

  // Find the name using the regular expression
  const nameMatch = coverLetter.match(nameRegex);
  const name = nameMatch ? nameMatch[1].trim() : '';

  // Remove the name part from the cover letter to get the body
  const body = coverLetter.replace(nameRegex, '').trim();

  return { name, body };
}

// Sample cover letter
const sampleCoverLetter = `
  John Doe,
  
  I am writing to express my interest in the Software Developer position at your company. 
  ...
  Thank you for considering my application.

  Sincerely,
  John Doe
`;

const result = parseCoverLetter(sampleCoverLetter);

console.log('Name:', result.name);
console.log('Body:', result.body);
