"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShiftRepository = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
class ShiftRepository {
    async create(data) {
        return prisma_1.default.shift.create({
            data,
        });
    }
    async findAll(params) {
        const { shiftCode, shiftName, status, page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc" } = params;
        const skip = (page - 1) * limit;
        const where = {
            ...(shiftCode && { shiftCode: { contains: shiftCode, mode: "insensitive" } }),
            ...(shiftName && { shiftName: { contains: shiftName, mode: "insensitive" } }),
            ...(status && { status }),
        };
        const [total, data] = await Promise.all([
            prisma_1.default.shift.count({ where }),
            prisma_1.default.shift.findMany({
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
        return prisma_1.default.shift.findUnique({
            where: { id },
        });
    }
    async findByCode(shiftCode) {
        return prisma_1.default.shift.findUnique({
            where: { shiftCode },
        });
    }
    async findByName(shiftName) {
        return prisma_1.default.shift.findUnique({
            where: { shiftName },
        });
    }
    async update(id, data) {
        return prisma_1.default.shift.update({
            where: { id },
            data,
        });
    }
    async changeStatus(id, status) {
        return prisma_1.default.shift.update({
            where: { id },
            data: { status },
        });
    }
}
exports.ShiftRepository = ShiftRepository;
