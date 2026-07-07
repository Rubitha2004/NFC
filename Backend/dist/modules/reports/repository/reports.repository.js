"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsRepository = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
class ReportsRepository {
    buildDateFilter(startDate, endDate) {
        if (!startDate && !endDate)
            return undefined;
        const filter = {};
        if (startDate)
            filter.gte = new Date(startDate);
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            filter.lte = end;
        }
        return filter;
    }
    async getAttendanceReport(params) {
        const where = {};
        if (params.startDate || params.endDate) {
            where.tapTime = this.buildDateFilter(params.startDate, params.endDate);
        }
        if (params.workerId)
            where.workerId = params.workerId;
        if (params.shiftId)
            where.shiftId = params.shiftId;
        if (params.machineId)
            where.machineId = params.machineId;
        return prisma_1.default.attendance.findMany({
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
    async getProductionReport(params) {
        const where = {};
        if (params.productionOrderId)
            where.id = params.productionOrderId;
        // Date filters for production usually apply to when it was created or modified.
        if (params.startDate || params.endDate) {
            where.createdAt = this.buildDateFilter(params.startDate, params.endDate);
        }
        return prisma_1.default.productionOrder.findMany({
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
    async getWorkerReport(params) {
        const where = {};
        if (params.workerId)
            where.toWorkerId = params.workerId;
        if (params.startDate || params.endDate) {
            where.transactionTime = this.buildDateFilter(params.startDate, params.endDate);
        }
        // Only looking at COMPLETE transactions for worker productivity
        where.transactionType = 'COMPLETE';
        return prisma_1.default.bundleTransaction.groupBy({
            by: ['toWorkerId'],
            where,
            _sum: { quantity: true },
            _count: { id: true },
        });
    }
    async getWorkerDetails(workerIds) {
        return prisma_1.default.worker.findMany({
            where: { id: { in: workerIds } },
            include: { department: true }
        });
    }
    async getMachineReport(params) {
        const where = {};
        if (params.machineId)
            where.toMachineId = params.machineId;
        if (params.startDate || params.endDate) {
            where.transactionTime = this.buildDateFilter(params.startDate, params.endDate);
        }
        where.transactionType = 'COMPLETE';
        return prisma_1.default.bundleTransaction.groupBy({
            by: ['toMachineId'],
            where,
            _sum: { quantity: true },
            _count: { id: true },
        });
    }
    async getMachineDetails(machineIds) {
        return prisma_1.default.machine.findMany({
            where: { id: { in: machineIds } }
        });
    }
    async getQCReport(params) {
        const where = {};
        if (params.startDate || params.endDate) {
            where.inspectionTime = this.buildDateFilter(params.startDate, params.endDate);
        }
        return prisma_1.default.qC.findMany({
            where,
            include: {
                bundle: true,
                worker: true
            },
            orderBy: { inspectionTime: 'desc' }
        });
    }
    async getBundleReport(params) {
        const where = {};
        if (params.productionOrderId)
            where.productionOrderId = params.productionOrderId;
        if (params.startDate || params.endDate) {
            where.createdAt = this.buildDateFilter(params.startDate, params.endDate);
        }
        return prisma_1.default.bundle.findMany({
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
exports.ReportsRepository = ReportsRepository;
