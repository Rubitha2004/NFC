"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerminalRepository = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
class TerminalRepository {
    async create(data) {
        return prisma_1.default.terminal.create({
            data,
        });
    }
    async findAll(params) {
        const { terminalCode, terminalName, status, page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc" } = params;
        const skip = (page - 1) * limit;
        const where = {
            ...(terminalCode && { terminalCode: { contains: terminalCode, mode: "insensitive" } }),
            ...(terminalName && { terminalName: { contains: terminalName, mode: "insensitive" } }),
            ...(status && { status }),
        };
        const [total, data] = await Promise.all([
            prisma_1.default.terminal.count({ where }),
            prisma_1.default.terminal.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: {
                    [sortBy]: sortOrder,
                }
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
        return prisma_1.default.terminal.findUnique({
            where: { id },
            include: {
                machine: true,
            }
        });
    }
    async findByCode(terminalCode) {
        return prisma_1.default.terminal.findUnique({
            where: { terminalCode },
            include: {
                machine: true,
            }
        });
    }
    async update(id, data) {
        return prisma_1.default.terminal.update({
            where: { id },
            data,
        });
    }
    async changeStatus(id, status) {
        return prisma_1.default.terminal.update({
            where: { id },
            data: { status },
        });
    }
}
exports.TerminalRepository = TerminalRepository;
