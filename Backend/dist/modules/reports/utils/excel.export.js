"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportToExcel = void 0;
const exceljs_1 = __importDefault(require("exceljs"));
const exportToExcel = async (title, columns, data) => {
    const workbook = new exceljs_1.default.Workbook();
    workbook.creator = 'NFC Production Dashboard';
    workbook.created = new Date();
    const sheet = workbook.addWorksheet('Report');
    // Add Title
    sheet.addRow([title]);
    sheet.getRow(1).font = { size: 16, bold: true };
    sheet.addRow([]); // empty row
    // Set Columns
    sheet.columns = columns.map(col => ({
        header: col.header,
        key: col.key,
        width: col.width || 15
    }));
    // Style Header Row
    const headerRow = sheet.getRow(3);
    headerRow.font = { bold: true };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    // Add Data
    data.forEach(item => {
        sheet.addRow(item);
    });
    const arrayBuffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(arrayBuffer);
};
exports.exportToExcel = exportToExcel;
