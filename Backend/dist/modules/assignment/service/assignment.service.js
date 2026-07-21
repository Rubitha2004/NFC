"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentService = void 0;
exports.validateAssignmentInput = validateAssignmentInput;
exports.validateAssignmentInputBulk = validateAssignmentInputBulk;
const prisma_1 = __importDefault(require("../../../config/prisma"));
const assignment_repository_1 = require("../repository/assignment.repository");
const worker_repository_1 = require("../../worker/repository/worker.repository");
const machine_repository_1 = require("../../machine/repository/machine.repository");
const operation_repository_1 = require("../../operation/repository/operation.repository");
const shift_repository_1 = require("../../shift/repository/shift.repository");
const client_1 = require("@prisma/client");
const websocket_1 = require("../../websocket");
async function validateAssignmentInput(tx, data) {
    const [worker, machine, operation, shift] = await Promise.all([
        tx.worker.findUnique({ where: { id: data.workerId } }),
        tx.machine.findUnique({ where: { id: data.machineId } }),
        tx.operation.findUnique({ where: { id: data.operationId }, include: { requiredSkill: true } }),
        tx.shift.findUnique({ where: { id: data.shiftId } }),
    ]);
    if (!worker || worker.status !== client_1.RecordStatus.ACTIVE)
        throw new Error(`Worker (ID ${data.workerId}) not found or not active`);
    if (!machine || machine.status !== client_1.RecordStatus.ACTIVE)
        throw new Error(`Machine (ID ${data.machineId}) not found or not active`);
    if (!operation || operation.status !== client_1.RecordStatus.ACTIVE)
        throw new Error(`Operation (ID ${data.operationId}) not found or not active`);
    if (!shift || shift.status !== client_1.RecordStatus.ACTIVE)
        throw new Error(`Shift (ID ${data.shiftId}) not found or not active`);
    if (operation.requiredSkillId) {
        const hasSkill = await tx.workerSkill.findUnique({
            where: { workerId_skillId: { workerId: data.workerId, skillId: operation.requiredSkillId } }
        });
        if (!hasSkill) {
            throw new Error(`Assignment invalid for worker ${worker.firstName} ${worker.lastName}: missing required skill "${operation.requiredSkill?.name}" for operation "${operation.operationName}"`);
        }
    }
}
async function validateAssignmentInputBulk(tx, assignments) {
    const workerIds = [...new Set(assignments.map(a => a.workerId))];
    const machineIds = [...new Set(assignments.map(a => a.machineId))];
    const operationIds = [...new Set(assignments.map(a => a.operationId))];
    const shiftIds = [...new Set(assignments.map(a => a.shiftId))];
    const [workers, machines, operations, shifts] = await Promise.all([
        tx.worker.findMany({ where: { id: { in: workerIds } } }),
        tx.machine.findMany({ where: { id: { in: machineIds } } }),
        tx.operation.findMany({ where: { id: { in: operationIds } }, include: { requiredSkill: true } }),
        tx.shift.findMany({ where: { id: { in: shiftIds } } })
    ]);
    const workerMap = new Map(workers.map((w) => [w.id, w]));
    const machineMap = new Map(machines.map((m) => [m.id, m]));
    const operationMap = new Map(operations.map((o) => [o.id, o]));
    const shiftMap = new Map(shifts.map((s) => [s.id, s]));
    const workerSkills = await tx.workerSkill.findMany({
        where: { workerId: { in: workerIds } }
    });
    const workerSkillMap = new Set(workerSkills.map((ws) => `${ws.workerId}-${ws.skillId}`));
    const errors = [];
    for (const data of assignments) {
        const worker = workerMap.get(data.workerId);
        const machine = machineMap.get(data.machineId);
        const operation = operationMap.get(data.operationId);
        const shift = shiftMap.get(data.shiftId);
        if (!worker || worker.status !== client_1.RecordStatus.ACTIVE)
            errors.push(`Worker (ID ${data.workerId}) not found or not active`);
        if (!machine || machine.status !== client_1.RecordStatus.ACTIVE)
            errors.push(`Machine (ID ${data.machineId}) not found or not active`);
        if (!operation || operation.status !== client_1.RecordStatus.ACTIVE)
            errors.push(`Operation (ID ${data.operationId}) not found or not active`);
        if (!shift || shift.status !== client_1.RecordStatus.ACTIVE)
            errors.push(`Shift (ID ${data.shiftId}) not found or not active`);
        if (operation && operation.requiredSkillId) {
            if (!workerSkillMap.has(`${data.workerId}-${operation.requiredSkillId}`)) {
                errors.push(`Assignment invalid for worker ${worker?.firstName} ${worker?.lastName}: missing required skill "${operation.requiredSkill?.name}" for operation "${operation.operationName}"`);
            }
        }
    }
    if (errors.length > 0) {
        throw new Error(`Plan validation failed:\n${errors.join('\n')}`);
    }
}
class AssignmentService {
    assignmentRepo;
    workerRepo;
    machineRepo;
    operationRepo;
    shiftRepo;
    constructor() {
        this.assignmentRepo = new assignment_repository_1.AssignmentRepository();
        this.workerRepo = new worker_repository_1.WorkerRepository();
        this.machineRepo = new machine_repository_1.MachineRepository();
        this.operationRepo = new operation_repository_1.OperationRepository();
        this.shiftRepo = new shift_repository_1.ShiftRepository();
    }
    async createAssignment(data) {
        return prisma_1.default.$transaction(async (tx) => {
            await validateAssignmentInput(tx, data);
            // reject if machine already occupied THIS shift — locked inside the same tx
            const machineBusy = await tx.assignment.findFirst({
                where: { machineId: data.machineId, shiftId: data.shiftId, status: client_1.AssignmentStatus.ACTIVE }
            });
            if (machineBusy)
                throw new Error("Machine is already assigned in this shift");
            // release worker's existing active assignment
            // Note: Worker assignments are released globally across ALL shifts (not per-shift like machines)
            // This enforces a strict "one active assignment total" rule for workers, regardless of shift.
            await tx.assignment.updateMany({
                where: { workerId: data.workerId, status: client_1.AssignmentStatus.ACTIVE },
                data: { status: client_1.AssignmentStatus.COMPLETED, releasedAt: new Date() }
            });
            const assignment = await tx.assignment.create({
                data: {
                    workerId: data.workerId,
                    machineId: data.machineId,
                    operationId: data.operationId,
                    shiftId: data.shiftId,
                    assignedBy: data.assignedBy,
                    remarks: data.remarks,
                    status: client_1.AssignmentStatus.ACTIVE,
                }
            });
            return assignment;
        }, { isolationLevel: "Serializable" })
            .then((assignment) => {
            websocket_1.websocketService.publish(websocket_1.WEBSOCKET_EVENTS.ASSIGNMENT_CREATED, assignment);
            return assignment;
        })
            .catch((error) => {
            if (error.code === 'P2034') {
                throw new Error("Transaction conflict occurred. Please retry.");
            }
            throw error;
        });
    }
    async getAllAssignments(params) {
        return this.assignmentRepo.findAll(params);
    }
    async getAssignmentById(id) {
        const assignment = await this.assignmentRepo.findById(id);
        if (!assignment)
            throw new Error("Assignment not found");
        return assignment;
    }
    async releaseAssignment(id) {
        const assignment = await this.assignmentRepo.findById(id);
        if (!assignment)
            throw new Error("Assignment not found");
        if (assignment.status === client_1.AssignmentStatus.COMPLETED) {
            throw new Error("Assignment is already released");
        }
        const released = await this.assignmentRepo.releaseAssignment(id);
        websocket_1.websocketService.publish(websocket_1.WEBSOCKET_EVENTS.ASSIGNMENT_RELEASED, released);
        return released;
    }
    async updateAssignment(id, data) {
        const assignment = await this.assignmentRepo.findById(id);
        if (!assignment)
            throw new Error("Assignment not found");
        const updated = await this.assignmentRepo.update(id, data);
        websocket_1.websocketService.publish(websocket_1.WEBSOCKET_EVENTS.ASSIGNMENT_UPDATED, updated);
        return updated;
    }
}
exports.AssignmentService = AssignmentService;
