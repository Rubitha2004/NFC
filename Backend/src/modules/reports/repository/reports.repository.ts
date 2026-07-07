import prisma from "../../../config/prisma";
import { ReportSearchParams } from "../types/reports.types";

export class ReportsRepository {

  private buildDateFilter(startDate?: string, endDate?: string) {
    if (!startDate && !endDate) return undefined;
    const filter: any = {};
    if (startDate) filter.gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filter.lte = end;
    }
    return filter;
  }

  async getAttendanceReport(params: ReportSearchParams) {
    const where: any = {};
    
    if (params.startDate || params.endDate) {
      where.tapTime = this.buildDateFilter(params.startDate, params.endDate);
    }
    if (params.workerId) where.workerId = params.workerId;
    if (params.shiftId) where.shiftId = params.shiftId;
    if (params.machineId) where.machineId = params.machineId;

    return prisma.attendance.findMany({
      where,
      include: {
        worker: {
          include: { department: true }
        },
        shift: true,
        machine: true
      },
      orderBy: { tapTime: 'desc' }
    });
  }

  async getProductionReport(params: ReportSearchParams) {
    const where: any = {};
    if (params.productionOrderId) where.id = params.productionOrderId;

    // Date filters for production usually apply to when it was created or modified.
    if (params.startDate || params.endDate) {
      where.createdAt = this.buildDateFilter(params.startDate, params.endDate);
    }

    return prisma.productionOrder.findMany({
      where,
      include: {
        bundles: {
          include: {
            bundleTransactions: {
              where: params.startDate || params.endDate ? {
                transactionTime: this.buildDateFilter(params.startDate, params.endDate)
              } : undefined
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getWorkerReport(params: ReportSearchParams) {
    const where: any = {};
    
    if (params.workerId) where.toWorkerId = params.workerId;
    if (params.startDate || params.endDate) {
      where.transactionTime = this.buildDateFilter(params.startDate, params.endDate);
    }
    // Only looking at COMPLETE transactions for worker productivity
    where.transactionType = 'COMPLETE';

    return prisma.bundleTransaction.groupBy({
      by: ['toWorkerId'],
      where,
      _sum: { quantity: true },
      _count: { id: true },
    });
  }

  async getWorkerDetails(workerIds: number[]) {
      return prisma.worker.findMany({
          where: { id: { in: workerIds } },
          include: { department: true }
      });
  }

  async getMachineReport(params: ReportSearchParams) {
    const where: any = {};
    
    if (params.machineId) where.toMachineId = params.machineId;
    if (params.startDate || params.endDate) {
      where.transactionTime = this.buildDateFilter(params.startDate, params.endDate);
    }
    where.transactionType = 'COMPLETE';

    return prisma.bundleTransaction.groupBy({
      by: ['toMachineId'],
      where,
      _sum: { quantity: true },
      _count: { id: true },
    });
  }

  async getMachineDetails(machineIds: number[]) {
      return prisma.machine.findMany({
          where: { id: { in: machineIds } }
      });
  }

  async getQCReport(params: ReportSearchParams) {
    const where: any = {};
    
    if (params.startDate || params.endDate) {
      where.inspectionTime = this.buildDateFilter(params.startDate, params.endDate);
    }

    return prisma.qC.findMany({
      where,
      include: {
        bundle: true,
        worker: true
      },
      orderBy: { inspectionTime: 'desc' }
    });
  }

  async getBundleReport(params: ReportSearchParams) {
    const where: any = {};
    
    if (params.productionOrderId) where.productionOrderId = params.productionOrderId;
    if (params.startDate || params.endDate) {
      where.createdAt = this.buildDateFilter(params.startDate, params.endDate);
    }

    return prisma.bundle.findMany({
      where,
      include: {
        bundleTransactions: {
          include: {
            toWorker: true,
            toMachine: true,
            toOperation: true
          },
          orderBy: { transactionTime: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
