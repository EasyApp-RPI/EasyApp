"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var pdf = require("pdf-parse");
var readlineSync = require("readline-sync");
function convertPdfToJson() {
    return __awaiter(this, void 0, void 0, function () {
        var pdfPath, dataBuffer, data, textContent_1, emailRegex, phoneRegex, addressRegex, emails, phoneNumbers, addresses, keywords, jsonPath, parsedInfo, outputJsonPath, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    pdfPath = readlineSync.question('Enter the path to the PDF file: ');
                    // Check if the file exists
                    if (!fs.existsSync(pdfPath)) {
                        console.error('Error: The specified file does not exist.');
                        return [2 /*return*/];
                    }
                    dataBuffer = fs.readFileSync(pdfPath);
                    return [4 /*yield*/, pdf(dataBuffer)];
                case 1:
                    data = _a.sent();
                    textContent_1 = data.text;
                    emailRegex = /\b[\w\.-]+@[\w\.-]+\.\w+\b/g;
                    phoneRegex = /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
                    addressRegex = /\b\d+\s[\w\s]+,\s[\w\s]+,\s[\w\s\d]+\b/g;
                    emails = textContent_1.match(emailRegex);
                    if (emails) {
                        textContent_1 = textContent_1.replace(emailRegex, '');
                        textContent_1 += '\nEmail Addresses:\n' + emails.join('\n') + '\n';
                    }
                    phoneNumbers = textContent_1.match(phoneRegex);
                    if (phoneNumbers) {
                        textContent_1 = textContent_1.replace(phoneRegex, '');
                        textContent_1 += '\nPhone Numbers:\n' + phoneNumbers.join('\n') + '\n';
                    }
                    addresses = textContent_1.match(addressRegex);
                    if (addresses) {
                        textContent_1 = textContent_1.replace(addressRegex, '');
                        textContent_1 += '\nAddresses:\n' + addresses.join('\n') + '\n';
                    }
                    keywords = ['experience', 'skills', 'education', 'projects', 'achievements', 'interests'];
                    // Highlight keywords in uppercase
                    keywords.forEach(function (keyword) {
                        var regex = new RegExp("\\b".concat(keyword, "\\b"), 'gi'); // Using RegExp for whole word matching
                        textContent_1 = textContent_1.replace(regex, function (match) { return match.toUpperCase(); });
                    });
                    // Handle multi-word categories
                    textContent_1 = textContent_1.replace(/\b(Skills & Interests|Projects & Activities)\b/gi, function (match) { return match.toUpperCase(); });
                    jsonPath = path.join(__dirname, 'output.json');
                    // Write modified text content to a JSON file
                    fs.writeFileSync(jsonPath, textContent_1);
                    console.log('Conversion successful! Text saved to output.json.');
                    parsedInfo = parseResume(jsonPath);
                    outputJsonPath = path.join(__dirname, 'parsed_output.json');
                    fs.writeFileSync(outputJsonPath, JSON.stringify(parsedInfo, null, 2));
                    console.log('Parsed Information:');
                    console.log(parsedInfo);
                    console.log("Parsed information has been written to ".concat(outputJsonPath));
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error converting PDF to JSON:', error_1.message);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function isName(line, isFirstNonEmptyLine) {
    var trimmedLine = line.trim();
    return isFirstNonEmptyLine && trimmedLine.length > 0 ? trimmedLine : null;
}
function parseResume(jsonPath) {
    var lines = fs.readFileSync(jsonPath, 'utf-8').split('\n');
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
// Call the function to start the conversion
convertPdfToJson();
