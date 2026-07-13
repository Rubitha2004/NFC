"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QCCheckRepository = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
class QCCheckRepository {
    include = {
        bundle: { include: { productionOrder: true } },
        tag: true,
        qcPerson: true,
        operation: true,
        worker: true,
    };
    async findAll(filters) {
        return prisma_1.default.qCCheckLog.findMany({
            where: {
                ...(filters?.bundleId ? { bundleId: filters.bundleId } : {}),
                ...(filters?.qcTier ? { qcTier: filters.qcTier } : {}),
                ...(filters?.status ? { status: filters.status } : {}),
            },
            include: this.include,
            orderBy: { checkedAt: 'desc' }
        });
    }
    async findById(id) {
        return prisma_1.default.qCCheckLog.findUnique({ where: { id }, include: this.include });
    }
    async findByBundle(bundleId) {
        return prisma_1.default.qCCheckLog.findMany({
            where: { bundleId },
            include: this.include,
            orderBy: { checkedAt: 'asc' }
        });
    }
    async create(data) {
        return prisma_1.default.qCCheckLog.create({ data, include: this.include });
    }
    async getAccountabilityTrail(bundleId) {
        // Get all checks with tier info for accountability
        const checks = await prisma_1.default.qCCheckLog.findMany({
            where: { bundleId },
            include: {
                qcPerson: true,
                operation: true,
                worker: true,
                tag: true,
            },
            orderBy: { checkedAt: 'asc' }
        });
        const failed = checks.filter(c => c.status === 'FAIL' || c.status === 'REWORK');
        const tier2Failures = failed.filter(c => c.qcTier === 'FINAL_QC');
        // For each Tier 2 failure, trace back to the Tier 1 person responsible for the same operation/worker
        const trails = tier2Failures.map(t2 => {
            const tier1Miss = checks.find(c => c.qcTier === 'LINE_QC' && c.workerId === t2.workerId && c.status === 'PASS');
            return { tier2Failure: t2, missedByTier1: tier1Miss ?? null };
        });
        return { checks, failureTrails: trails };
    }
}
exports.QCCheckRepository = QCCheckRepository;
