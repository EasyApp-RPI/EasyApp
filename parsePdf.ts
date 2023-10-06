import * as fs from 'fs';
import * as PDFParser from 'pdf-parse';

async function parsePdf(file: string): Promise<void> {
    try {
        const dataRead = fs.readFileSync(file);
        const pdf = new PDFParser(dataRead);
        await pdf.load();
        const pdfText = pdf.getText();
    } catch(error) {
        console.error('Error with parsing:', error);
    }
}
const pdfFilePath = 'RPIVerificationWorksheet_662048737_Hongwei.Li.pdf';
parsePdf(pdfFilePath);