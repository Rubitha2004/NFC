"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QCCheckService = void 0;
const qc_check_repository_1 = require("../repository/qc-check.repository");
const prisma_1 = __importDefault(require("../../../config/prisma"));
const repo = new qc_check_repository_1.QCCheckRepository();
class QCCheckService {
    async getAll(filters) {
        return repo.findAll(filters);
    }
    async getById(id) {
        const check = await repo.findById(id);
        if (!check)
            throw new Error('QC check not found');
        return check;
    }
    async getByBundle(bundleId) {
        return repo.findByBundle(bundleId);
    }
    async getAccountabilityTrail(bundleId) {
        return repo.getAccountabilityTrail(bundleId);
    }
    async scanTagForQC(tagCode, qcPersonCardId) {
        const qcPerson = await prisma_1.default.worker.findUnique({ where: { nfcCardId: qcPersonCardId } });
        if (!qcPerson)
            throw new Error("QC Inspector ID card not recognized");
        const tag = await prisma_1.default.bundleTagAssignment.findUnique({
            where: { tagCode },
            include: { bundle: { include: { productionOrder: true } } }
        });
        if (!tag || !tag.bundle)
            throw new Error("Invalid Tag or Tag not assigned to an active bundle");
        const trail = await this.getAccountabilityTrail(tag.bundle.id);
        return {
            qcPerson: { id: qcPerson.id, name: qcPerson.firstName },
            bundle: tag.bundle,
            tag: { id: tag.id, tagCode: tag.tagCode },
            accountabilityTrail: trail
        };
    }
    async create(dto) {
        return prisma_1.default.$transaction(async (tx) => {
            const [bundle, qcPerson] = await Promise.all([
                tx.bundle.findUnique({ where: { id: dto.bundleId } }),
                tx.worker.findUnique({ where: { id: dto.qcPersonId } }),
            ]);
            if (!bundle)
                throw new Error('Bundle not found');
            if (!qcPerson)
                throw new Error('QC person (worker) not found');
            if (dto.operationId) {
                const op = await tx.operation.findUnique({ where: { id: dto.operationId } });
                if (!op)
                    throw new Error('Operation not found');
            }
            if (dto.workerId) {
                const w = await tx.worker.findUnique({ where: { id: dto.workerId } });
                if (!w)
                    throw new Error('Worker being audited not found');
            }
            // Idempotency guard
            if (dto.qcTier === 'FINAL_QC' && dto.status === 'PASS' && bundle.status === 'QC_COMPLETED') {
                throw new Error('Bundle already QC completed — duplicate scan ignored');
            }
            // We use tx.qCCheckLog directly since we are inside a transaction
            const check = await tx.qCCheckLog.create({
                data: {
                    bundleId: dto.bundleId,
                    tagId: dto.tagId,
                    qcPersonId: dto.qcPersonId,
                    qcTier: dto.qcTier,
                    operationId: dto.operationId,
                    workerId: dto.workerId,
                    status: dto.status,
                    defectNotes: dto.defectNotes,
                    passQuantity: dto.passQuantity,
                    rejectQuantity: dto.rejectQuantity,
                    reworkQuantity: dto.reworkQuantity,
                }
            });
            // If final QC passed, mark bundle as QC_COMPLETED and auto-release the tag
            if (dto.qcTier === 'FINAL_QC' && dto.status === 'PASS') {
                const passedQty = dto.passQuantity ?? bundle.quantity;
                await tx.bundle.update({
                    where: { id: dto.bundleId },
                    data: {
                        status: 'QC_COMPLETED',
                        completedQuantity: { increment: passedQty }
                    }
                });
                if (dto.tagId) {
                    await tx.bundleTagAssignment.update({
                        where: { id: dto.tagId },
                        data: {
                            bundleId: null,
                            status: 'AVAILABLE',
                            releasedAt: new Date()
                        }
                    });
                }
                // Bug 2 Fix: Order completion tracking
                const order = await tx.productionOrder.update({
                    where: { id: bundle.productionOrderId },
                    data: { completedQuantity: { increment: passedQty } }
                });
                if (order.completedQuantity >= order.plannedQuantity) {
                    await tx.productionOrder.update({ where: { id: order.id }, data: { status: 'COMPLETED' } });
                }
            }
            else if (dto.status === 'REWORK' || dto.status === 'FAIL') {
                await tx.bundle.update({
                    where: { id: dto.bundleId },
                    data: { status: 'REWORK' }
                });
            }
            return check;
        });
    }
}
exports.QCCheckService = QCCheckService;
