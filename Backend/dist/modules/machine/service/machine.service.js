"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MachineService = void 0;
const machine_repository_1 = require("../repository/machine.repository");
const websocket_1 = require("../../websocket");
const prisma_1 = __importDefault(require("../../../config/prisma"));
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
        if (data.roomId && (!data.rowIndex || !data.positionIndex)) {
            const prisma = require("../../../config/prisma").default;
            const room = await prisma.room.findUnique({ where: { id: data.roomId } });
            if (room) {
                const machinesInRoom = await prisma.machine.findMany({
                    where: { roomId: data.roomId },
                    select: { rowIndex: true, positionIndex: true }
                });
                let newRowIndex = 0;
                let newPosIndex = 0;
                while (true) {
                    const occupied = machinesInRoom.some((m) => m.rowIndex === newRowIndex && m.positionIndex === newPosIndex);
                    if (!occupied)
                        break;
                    newPosIndex++;
                    if (newPosIndex >= room.machinesPerRow) {
                        newPosIndex = 0;
                        newRowIndex++;
                    }
                }
                data.rowIndex = newRowIndex;
                data.positionIndex = newPosIndex;
                if (newRowIndex >= room.rowsCount) {
                    await prisma.room.update({
                        where: { id: room.id },
                        data: { rowsCount: newRowIndex + 1 }
                    });
                }
            }
        }
        const machine = await this.repository.create(data);
        websocket_1.websocketService.publish(websocket_1.WEBSOCKET_EVENTS.MACHINE_CREATED, machine);
        return machine;
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
        const updatedMachine = await this.repository.update(id, data);
        websocket_1.websocketService.publish(websocket_1.WEBSOCKET_EVENTS.MACHINE_UPDATED, updatedMachine);
        return updatedMachine;
    }
    async changeStatus(id, status) {
        const machine = await this.repository.findById(id);
        if (!machine) {
            throw new Error("Machine not found");
        }
        const updatedMachine = await this.repository.changeStatus(id, status);
        // Logic Fix: Auto-release active assignments and clear layout if machine is deactivated
        if (status === 'INACTIVE') {
            await prisma_1.default.assignment.updateMany({
                where: { machineId: id, status: 'ACTIVE' },
                data: { status: 'COMPLETED', releasedAt: new Date() }
            });
            // Free up the physical slot on the factory floor
            await prisma_1.default.machine.update({
                where: { id },
                data: { roomId: null, rowIndex: null, positionIndex: null }
            });
        }
        websocket_1.websocketService.publish(websocket_1.WEBSOCKET_EVENTS.MACHINE_UPDATED, updatedMachine);
        return updatedMachine;
    }
    async assignRoom(id, data) {
        const machine = await this.repository.findById(id);
        if (!machine) {
            throw new Error("Machine not found");
        }
        if (data.roomId && data.rowIndex && data.positionIndex) {
            const prisma = require("../../../config/prisma").default;
            const clash = await prisma.machine.findFirst({
                where: { roomId: data.roomId, rowIndex: data.rowIndex, positionIndex: data.positionIndex, id: { not: id } }
            });
            if (clash)
                throw new Error(`Position already occupied by ${clash.machineCode || clash.machineName}`);
        }
        else if (data.roomId && (!data.rowIndex || !data.positionIndex)) {
            const prisma = require("../../../config/prisma").default;
            const room = await prisma.room.findUnique({ where: { id: data.roomId } });
            if (room) {
                // Find the maximum row and position used, or scan for first empty spot
                // The most robust way is to find all occupied spots and pick the next logical one.
                const machinesInRoom = await prisma.machine.findMany({
                    where: { roomId: data.roomId },
                    select: { rowIndex: true, positionIndex: true }
                });
                let newRowIndex = 0;
                let newPosIndex = 0;
                // Find first empty slot starting from row 0, pos 0
                while (true) {
                    const occupied = machinesInRoom.some((m) => m.rowIndex === newRowIndex && m.positionIndex === newPosIndex);
                    if (!occupied)
                        break;
                    newPosIndex++;
                    if (newPosIndex >= room.machinesPerRow) {
                        newPosIndex = 0;
                        newRowIndex++;
                    }
                }
                data.rowIndex = newRowIndex;
                data.positionIndex = newPosIndex;
                if (newRowIndex >= room.rowsCount) {
                    await prisma.room.update({
                        where: { id: room.id },
                        data: { rowsCount: newRowIndex }
                    });
                }
            }
        }
        const updatedMachine = await this.repository.assignRoom(id, data);
        websocket_1.websocketService.publish(websocket_1.WEBSOCKET_EVENTS.MACHINE_UPDATED, updatedMachine);
        return updatedMachine;
    }
}
exports.MachineService = MachineService;
