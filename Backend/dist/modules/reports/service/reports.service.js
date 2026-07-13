"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportsService = exports.ReportsService = void 0;
const reports_repository_1 = require("../repository/reports.repository");
const dashboard_service_1 = require("../../dashboard/service/dashboard.service");
class ReportsService {
    repository;
    constructor() {
        this.repository = new reports_repository_1.ReportsRepository();
    }
    async getAttendanceAnalytics(params) {
        const rawData = await this.repository.getAttendanceReport(params);
        // Process analytics like total in/out, late arrivals (assuming shift start time check later), etc.
        const summary = {
            totalRecords: rawData.length,
            clockInCount: rawData.filter(r => r.attendanceType === 'IN').length,
            clockOutCount: rawData.filter(r => r.attendanceType === 'OUT').length,
        };
        return {
            summary,
            data: rawData
        };
    }
    async getProductionAnalytics(params) {
        const orders = await this.repository.getProductionReport(params);
        const summary = {
            totalOrders: orders.length,
            totalPlanned: orders.reduce((acc, o) => acc + o.plannedQuantity, 0),
            totalCompleted: orders.reduce((acc, o) => acc + o.completedQuantity, 0),
            overallEfficiency: 0
        };
        if (summary.totalPlanned > 0) {
            summary.overallEfficiency = Number(((summary.totalCompleted / summary.totalPlanned) * 100).toFixed(1));
        }
        return {
            summary,
            data: orders
        };
    }
    async getWorkerAnalytics(params) {
        const workerGroups = await this.repository.getWorkerReport(params);
        // Enhance with worker details
        const workerIds = workerGroups.map(w => w.operatorId).filter(id => id !== null);
        const details = await this.repository.getWorkerDetails(workerIds);
        const workerMap = new Map(details.map(w => [w.id, w]));
        const enrichedData = workerGroups.map((g) => ({
            workerId: g.operatorId,
            workerName: g.operatorId ? `${workerMap.get(g.operatorId)?.firstName || ''} ${workerMap.get(g.operatorId)?.lastName || ''}` : 'Unknown',
            department: g.operatorId ? workerMap.get(g.operatorId)?.department?.name || 'N/A' : 'N/A',
            totalProduced: g._sum.quantity || 0,
            transactionsCount: g._count.id
        }));
        return {
            data: enrichedData
        };
    }
    async getMachineAnalytics(params) {
        const machineGroups = await this.repository.getMachineReport(params);
        const machineIds = machineGroups.map((m) => m.machineId).filter((id) => id !== null);
        const details = await this.repository.getMachineDetails(machineIds);
        const machineMap = new Map(details.map(m => [m.id, m]));
        const enrichedData = machineGroups.map((g) => ({
            machineId: g.machineId,
            machineCode: g.machineId ? machineMap.get(g.machineId)?.machineCode || 'Unknown' : 'Unknown',
            machineName: g.machineId ? machineMap.get(g.machineId)?.machineName || 'Unknown' : 'Unknown',
            totalProduced: g._sum?.quantity || 0,
            transactionsCount: g._count?.id || 0
        }));
        return {
            data: enrichedData
        };
    }
    async getQCAnalytics(params) {
        const qcRecords = await this.repository.getQCReport(params);
        const summary = {
            totalInspections: qcRecords.length,
            totalPass: qcRecords.reduce((acc, q) => acc + (q.status === 'PASS' ? q.bundle.quantity : 0), 0),
            totalReject: qcRecords.reduce((acc, q) => acc + (q.status === 'FAIL' ? q.bundle.quantity : 0), 0),
            totalRework: qcRecords.reduce((acc, q) => acc + (q.status === 'REWORK' ? q.bundle.quantity : 0), 0),
            defectRate: 0
        };
        const totalProcessed = summary.totalPass + summary.totalReject + summary.totalRework;
        if (totalProcessed > 0) {
            summary.defectRate = Number((((summary.totalReject + summary.totalRework) / totalProcessed) * 100).toFixed(1));
        }
        return {
            summary,
            data: qcRecords
        };
    }
    async getBundleAnalytics(params) {
        const bundles = await this.repository.getBundleReport(params);
        return {
            data: bundles
        };
    }
    async getDashboardAnalytics() {
        // Reuse the highly optimized dashboard service from Phase 3/4
        return dashboard_service_1.dashboardService.getOverview();
    }
}
exports.ReportsService = ReportsService;
exports.reportsService = new ReportsService();
