"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportToPdf = void 0;
const pdfkit_table_1 = __importDefault(require("pdfkit-table"));
const exportToPdf = async (title, headers, rows) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new pdfkit_table_1.default({ margin: 30, size: 'A4' });
            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });
            doc.fontSize(20).text(title, { align: 'center' });
            doc.moveDown();
            doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
            doc.moveDown(2);
            const table = {
                title: "",
                headers: headers,
                rows: rows
            };
            doc.table(table, {
                prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
                prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
                    doc.font("Helvetica").fontSize(10);
                },
            });
            doc.end();
        }
        catch (err) {
            reject(err);
        }
    });
};
exports.exportToPdf = exportToPdf;
