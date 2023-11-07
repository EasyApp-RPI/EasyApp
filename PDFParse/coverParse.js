function parseCoverLetter(coverLetter) {
    // Regular expression to match the name, assuming it ends with a comma
    var nameRegex = /^(.*?),/;
    // Find the name using the regular expression
    var nameMatch = coverLetter.match(nameRegex);
    var name = nameMatch ? nameMatch[1].trim() : '';
    // Remove the name part from the cover letter to get the body
    var body = coverLetter.replace(nameRegex, '').trim();
    return { name: name, body: body };
}
// Sample cover letter
var sampleCoverLetter = "\n  John Doe,\n  \n  I am writing to express my interest in the Software Developer position at your company. \n  ...\n  Thank you for considering my application.\n\n  Sincerely,\n  John Doe\n";
var result = parseCoverLetter(sampleCoverLetter);
console.log('Name:', result.name);
console.log('Body:', result.body);
