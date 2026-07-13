"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StageLogRepository = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
class StageLogRepository {
    async findAll(bundleId) {
        return prisma_1.default.bundleStageLog.findMany({
            where: bundleId ? { bundleId } : undefined,
            include: {
                bundle: true,
                tag: true,
                operation: true,
                operator: true,
            },
            orderBy: { inTime: 'asc' }
        });
    }
    async findById(id) {
        return prisma_1.default.bundleStageLog.findUnique({
            where: { id },
            include: { bundle: true, tag: true, operation: true, operator: true }
        });
    }
    async findByBundle(bundleId) {
        return prisma_1.default.bundleStageLog.findMany({
            where: { bundleId },
            include: { operation: true, operator: true, tag: true },
            orderBy: { inTime: 'asc' }
        });
    }
    async scanIn(data) {
        return prisma_1.default.bundleStageLog.create({ data });
    }
    async scanOut(id, remarks) {
        return prisma_1.default.bundleStageLog.update({
            where: { id },
            data: { outTime: new Date(), remarks: remarks ?? undefined }
        });
    }
    async findOpenScan(bundleId, operationId) {
        return prisma_1.default.bundleStageLog.findFirst({
            where: { bundleId, operationId, outTime: null },
            orderBy: { inTime: 'desc' }
        });
    }
}
exports.StageLogRepository = StageLogRepository;
