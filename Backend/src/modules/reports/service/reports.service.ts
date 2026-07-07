import { ReportsRepository } from "../repository/reports.repository";
import { ReportSearchParams } from "../types/reports.types";
import { dashboardService } from "../../dashboard/service/dashboard.service";

export class ReportsService {
  private repository: ReportsRepository;

  constructor() {
    this.repository = new ReportsRepository();
  }

  async getAttendanceAnalytics(params: ReportSearchParams) {
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

  async getProductionAnalytics(params: ReportSearchParams) {
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

  async getWorkerAnalytics(params: ReportSearchParams) {
    const workerGroups = await this.repository.getWorkerReport(params);
    
    // Enhance with worker details
    const workerIds = workerGroups.map(w => w.toWorkerId).filter(id => id !== null) as number[];
    const details = await this.repository.getWorkerDetails(workerIds);
    const workerMap = new Map(details.map(w => [w.id, w]));

    const enrichedData = workerGroups.map((g: any) => ({
      workerId: g.toWorkerId,
      workerName: g.toWorkerId ? `${workerMap.get(g.toWorkerId)?.firstName || ''} ${workerMap.get(g.toWorkerId)?.lastName || ''}` : 'Unknown',
      department: g.toWorkerId ? workerMap.get(g.toWorkerId)?.department?.name || 'N/A' : 'N/A',
      totalProduced: g._sum.quantity || 0,
      transactionsCount: g._count.id
    }));

    return {
      data: enrichedData
    };
  }

  async getMachineAnalytics(params: ReportSearchParams) {
    const machineGroups = await this.repository.getMachineReport(params);
    
    const machineIds = machineGroups.map(m => m.toMachineId).filter(id => id !== null) as number[];
    const details = await this.repository.getMachineDetails(machineIds);
    const machineMap = new Map(details.map(m => [m.id, m]));

    const enrichedData = machineGroups.map((g: any) => ({
      machineId: g.toMachineId,
      machineCode: g.toMachineId ? machineMap.get(g.toMachineId)?.machineCode || 'Unknown' : 'Unknown',
      machineName: g.toMachineId ? machineMap.get(g.toMachineId)?.machineName || 'Unknown' : 'Unknown',
      totalProduced: g._sum.quantity || 0,
      transactionsCount: g._count.id
    }));

    return {
      data: enrichedData
    };
  }

  async getQCAnalytics(params: ReportSearchParams) {
    const qcRecords = await this.repository.getQCReport(params);
    
    const summary = {
      totalInspections: qcRecords.length,
      totalPass: qcRecords.reduce((acc, q) => acc + q.passQuantity, 0),
      totalReject: qcRecords.reduce((acc, q) => acc + q.rejectQuantity, 0),
      totalRework: qcRecords.reduce((acc, q) => acc + q.reworkQuantity, 0),
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

  async getBundleAnalytics(params: ReportSearchParams) {
    const bundles = await this.repository.getBundleReport(params);
    return {
      data: bundles
    };
  }

  async getDashboardAnalytics() {
    // Reuse the highly optimized dashboard service from Phase 3/4
    return dashboardService.getOverview();
  }
}

export const reportsService = new ReportsService();
