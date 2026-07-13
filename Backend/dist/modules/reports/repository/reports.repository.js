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
                        stageLogs: {
                            where: params.startDate || params.endDate ? {
                                createdAt: this.buildDateFilter(params.startDate, params.endDate)
                            } : undefined
                        },
                        qcCheckLogs: {
                            where: params.startDate || params.endDate ? {
                                checkedAt: this.buildDateFilter(params.startDate, params.endDate)
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
            where.operatorId = params.workerId;
        if (params.startDate || params.endDate) {
            where.outTime = this.buildDateFilter(params.startDate, params.endDate);
        }
        // Only looking at completed operations for worker productivity
        where.outTime = { not: null };
        const logs = await prisma_1.default.bundleStageLog.findMany({
            where,
            include: { bundle: true }
        });
        // Aggregate in memory
        const grouped = {};
        for (const log of logs) {
            if (!grouped[log.operatorId]) {
                grouped[log.operatorId] = { id: 0, quantity: 0 };
            }
            grouped[log.operatorId].id += 1;
            grouped[log.operatorId].quantity += log.bundle.quantity;
        }
        return Object.entries(grouped).map(([operatorId, agg]) => ({
            operatorId: Number(operatorId),
            _count: { id: agg.id },
            _sum: { quantity: agg.quantity }
        }));
    }
    async getWorkerDetails(workerIds) {
        return prisma_1.default.worker.findMany({
            where: { id: { in: workerIds } },
            include: { department: true }
        });
    }
    async getMachineReport(params) {
        // Machine report relies on mapping operator to machine.
        // For now, we query active assignments to find machine mapping.
        // Since StageLog doesn't store machineId, this is a simplified view based on assignments.
        return [];
    }
    async getMachineDetails(machineIds) {
        return prisma_1.default.machine.findMany({
            where: { id: { in: machineIds } }
        });
    }
    async getQCReport(params) {
        const where = {};
        if (params.startDate || params.endDate) {
            where.checkedAt = this.buildDateFilter(params.startDate, params.endDate);
        }
        return prisma_1.default.qCCheckLog.findMany({
            where,
            include: {
                bundle: true,
                qcPerson: true,
                worker: true,
            },
            orderBy: { checkedAt: 'desc' }
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
                stageLogs: {
                    include: {
                        operator: true,
                        operation: true
                    },
                    orderBy: { inTime: 'asc' }
                },
                qcCheckLogs: {
                    orderBy: { checkedAt: 'asc' }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
}
exports.ReportsRepository = ReportsRepository;
