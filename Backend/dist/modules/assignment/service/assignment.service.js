"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentService = void 0;
const assignment_repository_1 = require("../repository/assignment.repository");
const worker_repository_1 = require("../../worker/repository/worker.repository");
const machine_repository_1 = require("../../machine/repository/machine.repository");
const operation_repository_1 = require("../../operation/repository/operation.repository");
const shift_repository_1 = require("../../shift/repository/shift.repository");
const client_1 = require("@prisma/client");
const websocket_1 = require("../../websocket");
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
        const { workerId, machineId, operationId, shiftId, assignedBy, remarks } = data;
        // 1. Verify all entities exist and are active
        const worker = await this.workerRepo.findById(workerId);
        if (!worker || worker.status !== client_1.RecordStatus.ACTIVE) {
            throw new Error("Worker not found or not active");
        }
        const machine = await this.machineRepo.findById(machineId);
        if (!machine || machine.status !== client_1.RecordStatus.ACTIVE) {
            throw new Error("Machine not found or not active");
        }
        const operation = await this.operationRepo.findById(operationId);
        if (!operation || operation.status !== client_1.RecordStatus.ACTIVE) {
            throw new Error("Operation not found or not active");
        }
        const shift = await this.shiftRepo.findById(shiftId);
        if (!shift || shift.status !== client_1.RecordStatus.ACTIVE) {
            throw new Error("Shift not found or not active");
        }
        // 2. Worker Reassignment logic:
        // If worker moves to a new machine, automatically release the old assignment
        const existingWorkerAssignment = await this.assignmentRepo.findActiveWorkerAssignment(workerId, shiftId);
        if (existingWorkerAssignment) {
            // Release it
            await this.assignmentRepo.releaseAssignment(existingWorkerAssignment.id);
        }
        // 3. Machine availability logic:
        // One machine can have only one active worker in a shift. Option 1: Reject if occupied.
        const existingMachineAssignment = await this.assignmentRepo.findActiveMachineAssignment(machineId, shiftId);
        if (existingMachineAssignment) {
            throw new Error("Machine is already assigned to another worker in this shift");
        }
        // 4. Create new Assignment
        const assignment = await this.assignmentRepo.create({
            workerId,
            machineId,
            operationId,
            shiftId,
            assignedBy,
            remarks,
            status: client_1.AssignmentStatus.ACTIVE,
        });
        websocket_1.websocketService.publish(websocket_1.WEBSOCKET_EVENTS.ASSIGNMENT_CREATED, assignment);
        return assignment;
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
