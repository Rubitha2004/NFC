import { WorkerRepository } from "../repository/worker.repository";
import { CreateWorkerDto, UpdateWorkerDto } from "../dto/worker.dto";
import { WorkerSearchParams } from "../types/worker.types";
import { RecordStatus } from "@prisma/client";
import { websocketService, WEBSOCKET_EVENTS } from "../../websocket";

export class WorkerService {
  private repository: WorkerRepository;

  constructor(repository?: WorkerRepository) {
    this.repository = repository || new WorkerRepository();
  }

  async create(data: CreateWorkerDto) {
    // 1. Check duplicate Employee Code
    const existingCode = await this.repository.findByEmployeeCode(data.employeeCode);
    if (existingCode) {
      throw new Error("Employee code already exists");
    }

    // 2. Check duplicate NFC Card
    const existingNfc = await this.repository.findByNFCCard(data.nfcCardId);
    if (existingNfc) {
      throw new Error("NFC Card ID already exists");
    }

    // 3. Department exists
    const department = await this.repository.checkDepartmentExists(data.departmentId);
    if (!department) {
      throw new Error("Department does not exist");
    }

    // 4. Grade exists
    const grade = await this.repository.checkGradeExists(data.gradeId);
    if (!grade) {
      throw new Error("Grade does not exist");
    }

    const worker = await this.repository.create(data);
    websocketService.publish(WEBSOCKET_EVENTS.WORKER_CREATED, worker);
    return worker;
  }

  async getAll(params: WorkerSearchParams) {
    return await this.repository.findAll(params);
  }

  async getById(id: number) {
    const worker = await this.repository.findById(id);
    if (!worker) {
      throw new Error("Worker not found");
    }
    return worker;
  }

  async update(id: number, data: UpdateWorkerDto) {
    const worker = await this.repository.findById(id);
    if (!worker) {
      throw new Error("Worker not found");
    }

    // Cannot change Employee Code if already assigned
    if (data.employeeCode && data.employeeCode !== worker.employeeCode) {
      throw new Error("Cannot change Employee Code once assigned");
    }

    // Check NFC Card uniqueness if changing
    if (data.nfcCardId && data.nfcCardId !== worker.nfcCardId) {
      const existingNfc = await this.repository.findByNFCCard(data.nfcCardId);
      if (existingNfc) {
        throw new Error("NFC Card ID already exists");
      }
    }

    // Department exists if changing
    if (data.departmentId && data.departmentId !== worker.departmentId) {
      const department = await this.repository.checkDepartmentExists(data.departmentId);
      if (!department) {
        throw new Error("Department does not exist");
      }
    }

    // Grade exists if changing
    if (data.gradeId && data.gradeId !== worker.gradeId) {
      const grade = await this.repository.checkGradeExists(data.gradeId);
      if (!grade) {
        throw new Error("Grade does not exist");
      }
    }

    const updatedWorker = await this.repository.update(id, data);
    websocketService.publish(WEBSOCKET_EVENTS.WORKER_UPDATED, updatedWorker);
    return updatedWorker;
  }

  async changeStatus(id: number, status: RecordStatus) {
    const worker = await this.repository.findById(id);
    if (!worker) {
      throw new Error("Worker not found");
    }
    const updatedWorker = await this.repository.changeStatus(id, status);
    
    // Logic Fix: Auto-release active assignments if worker is deactivated
    if (status === 'INACTIVE') {
      const prisma = require("../../../config/prisma").default;
      await prisma.assignment.updateMany({
        where: { workerId: id, status: 'ACTIVE' },
        data: { status: 'COMPLETED', releasedAt: new Date() }
      });
    }

    websocketService.publish(WEBSOCKET_EVENTS.WORKER_STATUS_CHANGED, updatedWorker);
    return updatedWorker;
  }
}
