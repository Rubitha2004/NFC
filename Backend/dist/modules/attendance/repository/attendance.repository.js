"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceRepository = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
class AttendanceRepository {
    async create(data) {
        return prisma_1.default.attendance.create({
            data,
            include: {
                worker: true,
                terminal: true,
                machine: true,
                shift: true,
                assignment: true,
            },
        });
    }
    async findAll(params) {
        const { workerId, terminalId, machineId, shiftId, attendanceType, status, page = 1, limit = 10, sortBy = "tapTime", sortOrder = "desc" } = params;
        const skip = (page - 1) * limit;
        const where = {
            ...(workerId && { workerId }),
            ...(terminalId && { terminalId }),
            ...(machineId && { machineId }),
            ...(shiftId && { shiftId }),
            ...(attendanceType && { attendanceType }),
            ...(status && { status }),
        };
        const [total, data] = await Promise.all([
            prisma_1.default.attendance.count({ where }),
            prisma_1.default.attendance.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: {
                    [sortBy]: sortOrder,
                },
                include: {
                    worker: true,
                    terminal: true,
                    machine: true,
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
    async findToday() {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        return prisma_1.default.attendance.findMany({
            where: {
                tapTime: {
                    gte: startOfDay,
                    lte: endOfDay,
                }
            },
            include: {
                worker: true,
                terminal: true,
                machine: true,
                shift: true,
            },
            orderBy: {
                tapTime: "desc",
            }
        });
    }
    async findByWorker(workerId) {
        return prisma_1.default.attendance.findMany({
            where: { workerId },
            orderBy: { tapTime: "desc" },
        });
    }
    async findCurrentAttendance(workerId, shiftId) {
        return prisma_1.default.attendance.findFirst({
            where: {
                workerId,
                shiftId,
            },
            orderBy: {
                tapTime: "desc",
            }
        });
    }
}
exports.AttendanceRepository = AttendanceRepository;
