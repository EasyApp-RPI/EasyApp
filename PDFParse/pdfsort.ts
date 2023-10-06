import * as fs from 'fs';
import * as path from 'path';

interface ParsedInfo {
  category: string;
  content: string[];
}

function isName(line: string, isFirstNonEmptyLine: boolean): string | null {
  const trimmedLine = line.trim();
  return isFirstNonEmptyLine && trimmedLine.length > 0 ? trimmedLine : null;
}

function parseResume(txtPath: string): ParsedInfo[] {
  const lines = fs.readFileSync(txtPath, 'utf-8').split('\n');

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

// Example usage:
const txtPath = path.join(__dirname, 'output.txt'); // Update with your actual file path
const parsedInfo = parseResume(txtPath);

console.log('Parsed Information:');
console.log(parsedInfo);
