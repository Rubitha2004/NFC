"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MachineService = void 0;
const machine_repository_1 = require("../repository/machine.repository");
class MachineService {
    repository = new machine_repository_1.MachineRepository();
    async create(data) {
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
    async getAll(params) {
        return await this.repository.findAll(params);
    }
    async getById(id) {
        const machine = await this.repository.findById(id);
        if (!machine) {
            throw new Error("Machine not found");
        }
        return machine;
    }
    async update(id, data) {
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
    async changeStatus(id, status) {
        const machine = await this.repository.findById(id);
        if (!machine) {
            throw new Error("Machine not found");
        }
        return await this.repository.changeStatus(id, status);
    }
}
exports.MachineService = MachineService;
