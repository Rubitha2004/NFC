"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resourceAvailabilityService = exports.ResourceAvailabilityService = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
class ResourceAvailabilityService {
    async getAvailableWorkers(opts) {
        return prisma_1.default.worker.findMany({
            where: {
                status: "ACTIVE",
                assignments: { none: { status: "ACTIVE" } },
                ...(opts?.departmentId ? { departmentId: opts.departmentId } : {}),
                ...(opts?.requiredSkillId
                    ? { skills: { some: { skillId: opts.requiredSkillId } } }
                    : {}),
            },
            include: {
                skills: { include: { skill: true } },
                grade: true,
                department: true,
                assignments: { where: { status: "ACTIVE" } }
            },
            orderBy: { grade: { priority: "asc" } },
        });
    }
    async getAvailableMachines(opts) {
        return prisma_1.default.machine.findMany({
            where: {
                status: "ACTIVE",
                assignments: { none: { status: "ACTIVE" } },
                ...(opts?.departmentId ? { departmentId: opts.departmentId } : {}),
            },
            include: {
                machineType: true,
                department: true,
                room: true,
                assignments: { where: { status: "ACTIVE" } }
            },
            orderBy: [
                { roomId: "asc" },
                { rowIndex: "asc" },
                { positionIndex: "asc" },
                { id: "asc" }
            ]
        });
    }
}
exports.ResourceAvailabilityService = ResourceAvailabilityService;
exports.resourceAvailabilityService = new ResourceAvailabilityService();
