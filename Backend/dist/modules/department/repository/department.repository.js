"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentRepository = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
class DepartmentRepository {
    /**
     * Create Department
     */
    async create(data) {
        return prisma_1.default.department.create({
            data,
        });
    }
    /**
     * Find Department by ID (with related counts)
     */
    async findById(id) {
        return prisma_1.default.department.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        workers: true,
                        machines: true,
                        productionTasks: true,
                    },
                },
            },
        });
    }
    /**
     * Find Department by Code
     */
    async findByCode(code) {
        return prisma_1.default.department.findUnique({
            where: { code },
        });
    }
    /**
     * Find Department by Name
     */
    async findByName(name) {
        return prisma_1.default.department.findUnique({
            where: { name },
        });
    }
    /**
     * Get All Departments with optional search/filter
     */
    async findAll(options) {
        const where = {};
        if (options?.search) {
            where.OR = [
                { name: { contains: options.search, mode: "insensitive" } },
                { code: { contains: options.search, mode: "insensitive" } },
                { description: { contains: options.search, mode: "insensitive" } },
            ];
        }
        if (options?.status && options.status !== "all") {
            const statusUpper = options.status.toUpperCase();
            if (statusUpper === "ACTIVE" || statusUpper === "INACTIVE") {
                where.status = statusUpper;
            }
        }
        return prisma_1.default.department.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: {
                _count: {
                    select: {
                        workers: true,
                        machines: true,
                        productionTasks: true,
                    },
                },
            },
        });
    }
    /**
     * Update Department
     */
    async update(id, data) {
        return prisma_1.default.department.update({
            where: { id },
            data,
            include: {
                _count: {
                    select: {
                        workers: true,
                        machines: true,
                    },
                },
            },
        });
    }
    /**
     * Delete Department (hard delete)
     */
    async delete(id) {
        return prisma_1.default.department.delete({
            where: { id },
        });
    }
    /**
     * Change Department Status
     */
    async changeStatus(id, status) {
        return prisma_1.default.department.update({
            where: { id },
            data: { status },
        });
    }
}
exports.DepartmentRepository = DepartmentRepository;
