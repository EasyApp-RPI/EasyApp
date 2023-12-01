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
        while (_) try {
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
var _this = this;
var fs = require('fs');
var pdf = require('pdf-parse');
var readline = require('readline');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var openDB = function () {
    return new Promise(function (resolve, reject) {
        var request = window.indexedDB.open('FilesDB', 1);
        request.onerror = function (event) {
            reject('Error opening database');
        };
        request.onsuccess = function (event) {
            var target = event.target;
            var db = target.result;
            if (db) {
                resolve(db);
            }
            else {
                reject('Failed to open database');
            }
        };
        request.onupgradeneeded = function (event) {
            var target = event.target;
            var db = target.result;
            db.createObjectStore('files', { keyPath: 'id' });
        };
    });
};
var parseCoverLetterFromPdf = function (pdfPath) { return __awaiter(_this, void 0, void 0, function () {
    var dataBuffer, data, pdfText, regex, match, name_1, address, body, outputJson, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                dataBuffer = fs.readFileSync(pdfPath);
                return [4 /*yield*/, pdf(dataBuffer)];
            case 1:
                data = _a.sent();
                pdfText = data.text;
                regex = /([^]+?)(\b\d{1,5}(?:[-\s]\d{1,5})?(?:[A-Za-z]+\b|\b)[^]+?)([\s\S]*)/;
                match = pdfText.match(regex);
                if (!match) {
                    console.error('Unable to extract name, address, and body from PDF.');
                    return [2 /*return*/];
                }
                name_1 = match[1].replace(/[\n\r]/g, ' ').trim();
                address = match[2].replace(/[\n\r]/g, ' ').trim();
                body = match[3].trim();
                outputJson = { name: name_1, address: address, body: body };
                // Save the parsed data to IndexedDB
                //await savePdfDataToDB('coverLetter', Buffer.from(JSON.stringify(outputJson)));
                console.log('Cover letter data saved to IndexedDB.');
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('Error parsing PDF:', error_1.message);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
function getPdfDataFromDB() {
    return __awaiter(this, void 0, void 0, function () {
        var db, transaction, objectStore, request_1, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, openDB()];
                case 1:
                    db = _a.sent();
                    transaction = db.transaction('files', 'readonly');
                    objectStore = transaction.objectStore('files');
                    request_1 = objectStore.get('coverLetter');
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            request_1.onsuccess = function () {
                                var result = request_1.result;
                                if (result && result.data instanceof Uint8Array) {
                                    resolve(result.data);
                                }
                                else {
                                    resolve(null);
                                }
                            };
                            request_1.onerror = function () {
                                console.error('Error fetching data from database');
                                resolve(null);
                            };
                        })];
                case 2:
                    error_2 = _a.sent();
                    console.error('Error opening database:', error_2.message);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Ask the user for the PDF file path
rl.question('Enter the path to the PDF file: ', function (pdfPath) {
    // Parse cover letter from PDF
    parseCoverLetterFromPdf(pdfPath)
        .then(function () {
        // Retrieve cover letter data from IndexedDB
        return getPdfDataFromDB();
    })
        .then(function (outputJson) {
        // Output the result
        console.log('Retrieved data from IndexedDB:', outputJson);
        rl.close();
    })["catch"](function (error) {
        console.error(error);
        rl.close();
    });
});
