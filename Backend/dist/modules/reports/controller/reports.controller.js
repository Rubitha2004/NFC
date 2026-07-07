"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportsController = exports.ReportsController = void 0;
const reports_service_1 = require("../service/reports.service");
const reports_dto_1 = require("../dto/reports.dto");
const excel_export_1 = require("../utils/excel.export");
const pdf_export_1 = require("../utils/pdf.export");
class ReportsController {
    getFilters(req) {
        const result = reports_dto_1.reportQuerySchema.safeParse(req.query);
        if (!result.success) {
            throw new Error("Invalid query parameters");
        }
        return result.data;
    }
    async getAttendance(req, res, next) {
        try {
            const filters = this.getFilters(req);
            const data = await reports_service_1.reportsService.getAttendanceAnalytics(filters);
            res.status(200).json(data);
        }
        catch (error) {
            next(error);
        }
    }
    async getProduction(req, res, next) {
        try {
            const filters = this.getFilters(req);
            const data = await reports_service_1.reportsService.getProductionAnalytics(filters);
            res.status(200).json(data);
        }
        catch (error) {
            next(error);
        }
    }
    async getWorkers(req, res, next) {
        try {
            const filters = this.getFilters(req);
            const data = await reports_service_1.reportsService.getWorkerAnalytics(filters);
            res.status(200).json(data);
        }
        catch (error) {
            next(error);
        }
    }
    async getMachines(req, res, next) {
        try {
            const filters = this.getFilters(req);
            const data = await reports_service_1.reportsService.getMachineAnalytics(filters);
            res.status(200).json(data);
        }
        catch (error) {
            next(error);
        }
    }
    async getQC(req, res, next) {
        try {
            const filters = this.getFilters(req);
            const data = await reports_service_1.reportsService.getQCAnalytics(filters);
            res.status(200).json(data);
        }
        catch (error) {
            next(error);
        }
    }
    async getBundles(req, res, next) {
        try {
            const filters = this.getFilters(req);
            const data = await reports_service_1.reportsService.getBundleAnalytics(filters);
            res.status(200).json(data);
        }
        catch (error) {
            next(error);
        }
    }
    async getDashboard(req, res, next) {
        try {
            const data = await reports_service_1.reportsService.getDashboardAnalytics();
            res.status(200).json(data);
        }
        catch (error) {
            next(error);
        }
    }
    async exportReport(req, res, next) {
        try {
            const filters = this.getFilters(req);
            const reportType = req.query.type;
            const format = req.query.format || 'excel';
            if (!reportType)
                throw new Error("Report type is required for export");
            let title = "Report";
            let columns = [];
            let data = [];
            let headersPdf = [];
            let rowsPdf = [];
            // Only implementing a basic Workers export for demonstration
            // In a real scenario, this would switch based on `reportType` and format data for all reports
            if (reportType === 'workers') {
                title = "Worker Productivity Report";
                const analytics = await reports_service_1.reportsService.getWorkerAnalytics(filters);
                columns = [
                    { header: 'Worker ID', key: 'workerId', width: 10 },
                    { header: 'Name', key: 'workerName', width: 25 },
                    { header: 'Department', key: 'department', width: 20 },
                    { header: 'Total Produced', key: 'totalProduced', width: 15 },
                    { header: 'Transactions', key: 'transactionsCount', width: 15 },
                ];
                headersPdf = columns.map(c => c.header);
                data = analytics.data;
                rowsPdf = data.map(item => [
                    item.workerId?.toString() || '',
                    item.workerName,
                    item.department,
                    item.totalProduced.toString(),
                    item.transactionsCount.toString()
                ]);
            }
            else {
                throw new Error("Export for this report type is not fully implemented in the demo");
            }
            if (format === 'excel' || format === 'csv') {
                const buffer = await (0, excel_export_1.exportToExcel)(title, columns, data);
                const contentType = format === 'excel'
                    ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    : 'text/csv';
                const extension = format === 'excel' ? 'xlsx' : 'csv';
                res.setHeader('Content-Type', contentType);
                res.setHeader('Content-Disposition', `attachment; filename=${reportType}_report.${extension}`);
                res.send(buffer);
            }
            else if (format === 'pdf') {
                const buffer = await (0, pdf_export_1.exportToPdf)(title, headersPdf, rowsPdf);
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename=${reportType}_report.pdf`);
                res.send(buffer);
            }
            else {
                throw new Error("Unsupported format");
            }
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ReportsController = ReportsController;
exports.reportsController = new ReportsController();
