import { MachineRepository } from "../repository/machine.repository";
import { CreateMachineDto, UpdateMachineDto } from "../dto/machine.dto";
import { RecordStatus } from "@prisma/client";
import { MachineSearchParams } from "../types/machine.types";

export class MachineService {
  private repository = new MachineRepository();

  async create(data: CreateMachineDto) {
    const existingCode = await this.repository.findByMachineCode(data.machineCode);
    if (existingCode) {
      throw new Error("Machine code already exists");
    }

    const existingTerminal = await this.repository.findByTerminal(data.terminalId);
    if (existingTerminal) {
      throw new Error("Terminal already assigned to another machine");
    }

    const department = await this.repository.checkDepartmentExists(data.departmentId);
    if (!department) {
      throw new Error("Department does not exist");
    }

    const machineType = await this.repository.checkMachineTypeExists(data.machineTypeId);
    if (!machineType) {
      throw new Error("Machine Type does not exist");
    }

    const terminal = await this.repository.checkTerminalExists(data.terminalId);
    if (!terminal) {
      throw new Error("Terminal does not exist");
    }

    return await this.repository.create(data);
  }

  async getAll(params: any) {
    return await this.repository.findAll(params as MachineSearchParams);
  }

  async getById(id: number) {
    const machine = await this.repository.findById(id);
    if (!machine) {
      throw new Error("Machine not found");
    }
    return machine;
  }

  async update(id: number, data: UpdateMachineDto) {
    const machine = await this.repository.findById(id);
    if (!machine) {
      throw new Error("Machine not found");
    }

    if (data.departmentId && data.departmentId !== machine.departmentId) {
      const department = await this.repository.checkDepartmentExists(data.departmentId);
      if (!department) {
        throw new Error("Department does not exist");
      }
    }

    if (data.machineTypeId && data.machineTypeId !== machine.machineTypeId) {
      const machineType = await this.repository.checkMachineTypeExists(data.machineTypeId);
      if (!machineType) {
        throw new Error("Machine Type does not exist");
      }
    }

    if (data.terminalId && data.terminalId !== machine.terminalId) {
      const existingTerminal = await this.repository.findByTerminal(data.terminalId);
      if (existingTerminal) {
        throw new Error("Terminal already assigned to another machine");
      }
      
      const terminal = await this.repository.checkTerminalExists(data.terminalId);
      if (!terminal) {
        throw new Error("Terminal does not exist");
      }
    }

    return await this.repository.update(id, data);
  }

  async changeStatus(id: number, status: RecordStatus) {
    const machine = await this.repository.findById(id);
    if (!machine) {
      throw new Error("Machine not found");
    }
    return await this.repository.changeStatus(id, status);
  }
}
