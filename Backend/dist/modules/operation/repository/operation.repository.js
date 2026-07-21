"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationRepository = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
class OperationRepository {
    async create(data) {
        return prisma_1.default.operation.create({
            data,
        });
    }
    async findAll(params) {
        const { operationCode, operationName, status, page = 1, limit = 10, sortBy = "displayOrder", sortOrder = "asc" } = params;
        const skip = (page - 1) * limit;
        const where = {
            ...(operationCode && { operationCode: { contains: operationCode, mode: "insensitive" } }),
            ...(operationName && { operationName: { contains: operationName, mode: "insensitive" } }),
            ...(status && { status }),
        };
        const [total, data] = await Promise.all([
            prisma_1.default.operation.count({ where }),
            prisma_1.default.operation.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: { [sortBy]: sortOrder },
                include: {
                    requiredSkill: true,
                    department: true,
                }
            })
        ]);
        return { total, page, limit, data };
    }
    async findById(id) {
        return prisma_1.default.operation.findUnique({
            where: { id },
            include: {
                requiredSkill: true,
                department: true,
                machineOperationAssignments: {
                    include: { machine: true }
                }
            }
        });
    }
    async findByCode(operationCode) {
        return prisma_1.default.operation.findUnique({
            where: { operationCode },
        });
    }
    async findByName(operationName) {
        return prisma_1.default.operation.findUnique({
            where: { operationName },
        });
    }
    async update(id, data) {
        return prisma_1.default.operation.update({
            where: { id },
            data,
        });
    }
    async changeStatus(id, status) {
        return prisma_1.default.operation.update({
            where: { id },
            data: { status },
        });
    }
}
exports.OperationRepository = OperationRepository;
