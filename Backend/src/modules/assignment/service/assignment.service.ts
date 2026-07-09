import prisma from "../../../config/prisma";
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
    return prisma.$transaction(async (tx) => {
      const [worker, machine, operation, shift] = await Promise.all([
        tx.worker.findUnique({ where: { id: data.workerId } }),
        tx.machine.findUnique({ where: { id: data.machineId } }),
        tx.operation.findUnique({ where: { id: data.operationId }, include: { requiredSkill: true } }),
        tx.shift.findUnique({ where: { id: data.shiftId } }),
      ]);

      if (!worker || worker.status !== RecordStatus.ACTIVE) throw new Error("Worker not found or not active");
      if (!machine || machine.status !== RecordStatus.ACTIVE) throw new Error("Machine not found or not active");
      if (!operation || operation.status !== RecordStatus.ACTIVE) throw new Error("Operation not found or not active");
      if (!shift || shift.status !== RecordStatus.ACTIVE) throw new Error("Shift not found or not active");

      if (operation.requiredSkillId) {
        const hasSkill = await tx.workerSkill.findUnique({
          where: { workerId_skillId: { workerId: data.workerId, skillId: operation.requiredSkillId } }
        });
        if (!hasSkill) {
          throw new Error(
            `Worker does not have the required skill "${operation.requiredSkill?.name}" for operation "${operation.operationName}"`
          );
        }
      }

      // reject if machine already occupied THIS shift — locked inside the same tx
      const machineBusy = await tx.assignment.findFirst({
        where: { machineId: data.machineId, shiftId: data.shiftId, status: AssignmentStatus.ACTIVE }
      });
      if (machineBusy) throw new Error("Machine is already assigned in this shift");

      // release worker's existing active assignment
      await tx.assignment.updateMany({
        where: { workerId: data.workerId, status: AssignmentStatus.ACTIVE },
        data: { status: AssignmentStatus.COMPLETED, releasedAt: new Date() }
      });

      const assignment = await tx.assignment.create({
        data: {
          workerId: data.workerId,
          machineId: data.machineId,
          operationId: data.operationId,
          shiftId: data.shiftId,
          assignedBy: data.assignedBy,
          remarks: data.remarks,
          status: AssignmentStatus.ACTIVE,
        }
      });

      return assignment;
    }, { isolationLevel: "Serializable" })
    .then((assignment) => {
      websocketService.publish(WEBSOCKET_EVENTS.ASSIGNMENT_CREATED, assignment);
      return assignment;
    })
    .catch((error: any) => {
      if (error.code === 'P2034') {
        throw new Error("Transaction conflict occurred. Please retry.");
      }
      throw error;
    });
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
