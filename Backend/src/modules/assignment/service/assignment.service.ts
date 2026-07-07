import { AssignmentRepository } from "../repository/assignment.repository";
import { CreateAssignmentDto, UpdateAssignmentDto, AssignmentSearchParams } from "../types/assignment.types";
import { WorkerRepository } from "../../worker/repository/worker.repository";
import { MachineRepository } from "../../machine/repository/machine.repository";
import { OperationRepository } from "../../operation/repository/operation.repository";
import { ShiftRepository } from "../../shift/repository/shift.repository";
import { RecordStatus, AssignmentStatus } from "@prisma/client";
import { websocketService, WEBSOCKET_EVENTS } from "../../websocket";

export class AssignmentService {
  private assignmentRepo: AssignmentRepository;
  private workerRepo: WorkerRepository;
  private machineRepo: MachineRepository;
  private operationRepo: OperationRepository;
  private shiftRepo: ShiftRepository;

  constructor() {
    this.assignmentRepo = new AssignmentRepository();
    this.workerRepo = new WorkerRepository();
    this.machineRepo = new MachineRepository();
    this.operationRepo = new OperationRepository();
    this.shiftRepo = new ShiftRepository();
  }

  async createAssignment(data: CreateAssignmentDto) {
    const { workerId, machineId, operationId, shiftId, assignedBy, remarks } = data;

    // 1. Verify all entities exist and are active
    const worker = await this.workerRepo.findById(workerId);
    if (!worker || worker.status !== RecordStatus.ACTIVE) {
      throw new Error("Worker not found or not active");
    }

    const machine = await this.machineRepo.findById(machineId);
    if (!machine || machine.status !== RecordStatus.ACTIVE) {
      throw new Error("Machine not found or not active");
    }

    const operation = await this.operationRepo.findById(operationId);
    if (!operation || operation.status !== RecordStatus.ACTIVE) {
      throw new Error("Operation not found or not active");
    }

    const shift = await this.shiftRepo.findById(shiftId);
    if (!shift || shift.status !== RecordStatus.ACTIVE) {
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
      status: AssignmentStatus.ACTIVE,
    });

    websocketService.publish(WEBSOCKET_EVENTS.ASSIGNMENT_CREATED, assignment);

    return assignment;
  }

  async getAllAssignments(params: AssignmentSearchParams) {
    return this.assignmentRepo.findAll(params);
  }

  async getAssignmentById(id: number) {
    const assignment = await this.assignmentRepo.findById(id);
    if (!assignment) throw new Error("Assignment not found");
    return assignment;
  }

  async releaseAssignment(id: number) {
    const assignment = await this.assignmentRepo.findById(id);
    if (!assignment) throw new Error("Assignment not found");
    
    if (assignment.status === AssignmentStatus.COMPLETED) {
      throw new Error("Assignment is already released");
    }
    
    const released = await this.assignmentRepo.releaseAssignment(id);
    websocketService.publish(WEBSOCKET_EVENTS.ASSIGNMENT_RELEASED, released);
    
    return released;
  }

  async updateAssignment(id: number, data: UpdateAssignmentDto) {
    const assignment = await this.assignmentRepo.findById(id);
    if (!assignment) throw new Error("Assignment not found");

    const updated = await this.assignmentRepo.update(id, data);
    websocketService.publish(WEBSOCKET_EVENTS.ASSIGNMENT_UPDATED, updated);
    
    return updated;
  }
}
