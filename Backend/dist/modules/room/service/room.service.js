"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomService = void 0;
const room_repository_1 = require("../repository/room.repository");
const prisma_1 = __importDefault(require("../../../config/prisma"));
class RoomService {
    repository;
    constructor(repository) {
        this.repository = repository || new room_repository_1.RoomRepository();
    }
    async create(data) {
        const existing = await this.repository.findByNameAndFloor(data.name, data.floorId);
        if (existing) {
            throw new Error("Room name already exists on this floor.");
        }
        const room = await this.repository.create({
            name: data.name,
            floor: { connect: { id: data.floorId } },
            roomType: data.roomType,
            rowsCount: data.rowsCount,
            machinesPerRow: data.machinesPerRow,
            status: data.status,
        });
        await this.autoAllocateMachines(room.id, room.rowsCount, room.machinesPerRow);
        return room;
    }
    async getById(id) {
        return await this.repository.findById(id);
    }
    async getAll(floorId) {
        return await this.repository.findAll(floorId);
    }
    async update(id, data) {
        const existing = await this.repository.findById(id);
        if (!existing) {
            throw new Error("Room not found.");
        }
        if (data.name && data.name !== existing.name) {
            const floorId = data.floorId || existing.floorId;
            const conflict = await this.repository.findByNameAndFloor(data.name, floorId);
            if (conflict) {
                throw new Error("Room name already exists on this floor.");
            }
        }
        const updateData = {
            ...(data.name && { name: data.name }),
            ...(data.roomType !== undefined && { roomType: data.roomType }),
            ...(data.rowsCount !== undefined && { rowsCount: data.rowsCount }),
            ...(data.machinesPerRow !== undefined && { machinesPerRow: data.machinesPerRow }),
            ...(data.status !== undefined && { status: data.status }),
        };
        if (data.floorId && data.floorId !== existing.floorId) {
            updateData.floor = { connect: { id: data.floorId } };
        }
        const room = await this.repository.update(id, updateData);
        await this.autoAllocateMachines(room.id, room.rowsCount, room.machinesPerRow);
        return room;
    }
    async autoAllocateMachines(roomId, rowsCount, machinesPerRow) {
        const totalSlots = rowsCount * machinesPerRow;
        // 1. Get machines currently in this room
        let roomMachines = await prisma_1.default.machine.findMany({
            where: { roomId },
            orderBy: { id: 'asc' }
        });
        // 2. If we need more machines, pull from unassigned
        if (roomMachines.length < totalSlots) {
            const needed = totalSlots - roomMachines.length;
            const unassigned = await prisma_1.default.machine.findMany({
                where: { roomId: null },
                take: needed,
                orderBy: { id: 'asc' }
            });
            if (unassigned.length > 0) {
                await prisma_1.default.machine.updateMany({
                    where: { id: { in: unassigned.map(m => m.id) } },
                    data: { roomId }
                });
                roomMachines = [...roomMachines, ...unassigned];
            }
        }
        // 3. Clear existing positions first to avoid unique constraint violations
        await prisma_1.default.machine.updateMany({
            where: { roomId },
            data: { rowIndex: null, positionIndex: null }
        });
        // 4. Update rowIndex and positionIndex sequentially
        let machineIndex = 0;
        for (let r = 0; r < rowsCount; r++) {
            for (let p = 0; p < machinesPerRow; p++) {
                if (machineIndex < roomMachines.length) {
                    const m = roomMachines[machineIndex];
                    await prisma_1.default.machine.update({
                        where: { id: m.id },
                        data: { rowIndex: r, positionIndex: p }
                    });
                    machineIndex++;
                }
                else {
                    break;
                }
            }
        }
    }
    async delete(id) {
        const existing = await this.repository.findById(id);
        if (!existing) {
            throw new Error("Room not found.");
        }
        return await this.repository.delete(id);
    }
}
exports.RoomService = RoomService;
