"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentRepository = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
const client_1 = require("@prisma/client");
class AssignmentRepository {
    async create(data) {
        return prisma_1.default.assignment.create({
            data,
            include: {
                worker: true,
                machine: true,
                operation: true,
                shift: true,
            },
        });
    }
    async findAll(params) {
        const { workerId, machineId, operationId, shiftId, status, page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc" } = params;
        const skip = (page - 1) * limit;
        const where = {
            ...(workerId && { workerId }),
            ...(machineId && { machineId }),
            ...(operationId && { operationId }),
            ...(shiftId && { shiftId }),
            ...(status && { status }),
        };
        const [total, data] = await Promise.all([
            prisma_1.default.assignment.count({ where }),
            prisma_1.default.assignment.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: {
                    [sortBy]: sortOrder,
                },
                include: {
                    worker: true,
                    machine: true,
                    operation: true,
                    shift: true,
                },
            })
        ]);
        return {
            total,
            page,
            limit,
            data
        };
    }
    async findById(id) {
        return prisma_1.default.assignment.findUnique({
            where: { id },
            include: {
                worker: true,
                machine: true,
                operation: true,
                shift: true,
            },
        });
    }
    async findActiveWorkerAssignment(workerId, shiftId) {
        const where = {
            workerId,
            status: client_1.AssignmentStatus.ACTIVE,
            ...(shiftId && { shiftId })
        };
        return prisma_1.default.assignment.findFirst({
            where,
        });
    }
    async findActiveMachineAssignment(machineId, shiftId) {
        const where = {
            machineId,
            status: client_1.AssignmentStatus.ACTIVE,
            ...(shiftId && { shiftId })
        };
        return prisma_1.default.assignment.findFirst({
            where,
        });
    }
    async releaseAssignment(id) {
        return prisma_1.default.assignment.update({
            where: { id },
            data: {
                status: client_1.AssignmentStatus.COMPLETED,
                releasedAt: new Date(),
            },
        });
    }
    async update(id, data) {
        return prisma_1.default.assignment.update({
            where: { id },
            data,
        });
    }
}
exports.AssignmentRepository = AssignmentRepository;
