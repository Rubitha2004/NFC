import { RoomRepository } from "../repository/room.repository";
import { CreateRoomDTO, UpdateRoomDTO } from "../validation/room.validation";
import { Prisma } from "@prisma/client";

export class RoomService {
  private repository: RoomRepository;

  constructor(repository?: RoomRepository) {
    this.repository = repository || new RoomRepository();
  }

  async create(data: CreateRoomDTO) {
    const existing = await this.repository.findByNameAndFloor(data.name, data.floorId);
    if (existing) {
      throw new Error("Room name already exists on this floor.");
    }
    return await this.repository.create({
      name: data.name,
      floor: { connect: { id: data.floorId } },
      roomType: data.roomType,
      rowsCount: data.rowsCount,
      machinesPerRow: data.machinesPerRow,
      status: data.status,
    });
  }

  async getById(id: number) {
    return await this.repository.findById(id);
  }

  async getAll(floorId?: number) {
    return await this.repository.findAll(floorId);
  }

  async update(id: number, data: UpdateRoomDTO) {
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

    const updateData: Prisma.RoomUpdateInput = {
      ...(data.name && { name: data.name }),
      ...(data.roomType !== undefined && { roomType: data.roomType }),
      ...(data.rowsCount !== undefined && { rowsCount: data.rowsCount }),
      ...(data.machinesPerRow !== undefined && { machinesPerRow: data.machinesPerRow }),
      ...(data.status !== undefined && { status: data.status }),
    };

    if (data.floorId && data.floorId !== existing.floorId) {
      updateData.floor = { connect: { id: data.floorId } };
    }

    return await this.repository.update(id, updateData);
  }

  async delete(id: number) {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new Error("Room not found.");
    }
    if (existing.machines && existing.machines.length > 0) {
      throw new Error("Cannot delete room with assigned machines.");
    }
    return await this.repository.delete(id);
  }
}
