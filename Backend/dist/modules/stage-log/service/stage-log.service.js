"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StageLogService = void 0;
const stage_log_repository_1 = require("../repository/stage-log.repository");
const prisma_1 = __importDefault(require("../../../config/prisma"));
const iot_service_1 = require("../../iot/service/iot.service");
const repo = new stage_log_repository_1.StageLogRepository();
const iotService = new iot_service_1.IotService();
class StageLogService {
    async getAll(bundleId) {
        return repo.findAll(bundleId);
    }
    async getByBundle(bundleId) {
        return repo.findByBundle(bundleId);
    }
    async scanIn(dto) {
        // Route manual scan-in through the canonical IotService logic
        const tag = await prisma_1.default.bundleTagAssignment.findUnique({ where: { id: dto.tagId } });
        if (!tag)
            throw new Error('Tag not found');
        const worker = await prisma_1.default.worker.findUnique({ where: { id: dto.operatorId } });
        if (!worker)
            throw new Error('Operator not found');
        const assignment = await prisma_1.default.assignment.findFirst({
            where: { workerId: dto.operatorId, operationId: dto.operationId, status: 'ACTIVE' },
            include: { machine: { include: { terminal: true } } }
        });
        if (!assignment || !assignment.machine.terminal) {
            throw new Error('Worker must have an active assignment to a machine with a terminal to scan manually.');
        }
        return iotService.handleScan(tag.tagCode, worker.nfcCardId, assignment.machine.terminal.terminalCode);
    }
    async scanOut(logId, dto) {
        const existing = await repo.findById(logId);
        if (!existing)
            throw new Error('Stage log not found');
        if (existing.outTime)
            throw new Error('This scan has already been closed');
        const tag = await prisma_1.default.bundleTagAssignment.findUnique({ where: { id: existing.tagId } });
        const worker = await prisma_1.default.worker.findUnique({ where: { id: existing.operatorId } });
        const assignment = await prisma_1.default.assignment.findFirst({
            where: { workerId: existing.operatorId, operationId: existing.operationId, status: 'ACTIVE' },
            include: { machine: { include: { terminal: true } } }
        });
        if (!assignment || !assignment.machine.terminal) {
            throw new Error('Worker must have an active assignment to a machine with a terminal to scan manually.');
        }
        return iotService.handleScan(tag.tagCode, worker.nfcCardId, assignment.machine.terminal.terminalCode);
    }
}
exports.StageLogService = StageLogService;
