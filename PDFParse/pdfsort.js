"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
function isName(line, isFirstNonEmptyLine) {
    var trimmedLine = line.trim();
    return isFirstNonEmptyLine && trimmedLine.length > 0 ? trimmedLine : null;
}
function parseResume(txtPath) {
    var lines = fs.readFileSync(txtPath, 'utf-8').split('\n');
    var parsedInfo = [];
    var currentCategory = null;
    var isFirstNonEmptyLine = true;
    lines.forEach(function (line) {
        // Skip empty lines
        if (!line.trim()) {
            return;
        }
        // Check if the line is the name
        var name = isName(line, isFirstNonEmptyLine);
        if (name) {
            parsedInfo.push({ category: 'Name', content: [name] });
            isFirstNonEmptyLine = false; // Set to false after finding the first non-empty line
            return;
        }
        // Identify section headers and set the current category
        var sectionMatch = line.match(/^[A-Z\s]+$/);
        if (sectionMatch) {
            currentCategory = sectionMatch[0].trim();
            return;
        }
        // Add content to the current category
        if (currentCategory !== null) {
            var index = parsedInfo.findIndex(function (info) { return info.category === currentCategory; });
            if (index === -1) {
                parsedInfo.push({ category: currentCategory, content: [line.trim()] });
            }
            else {
                parsedInfo[index].content.push(line.trim());
            }
        }
    });
    return parsedInfo;
}
// Example usage:
var txtPath = path.join(__dirname, 'output.txt'); // Update with your actual file path
var parsedInfo = parseResume(txtPath);
console.log('Parsed Information:');
console.log(parsedInfo);
