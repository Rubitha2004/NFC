import { Prisma, RecordStatus } from "@prisma/client";
import prisma from "../../../config/prisma";

export class RoomRepository {
  async create(data: Prisma.RoomCreateInput) {
    return prisma.room.create({
      data,
      include: {
        floor: true,
        _count: { select: { machines: true } }
      }
    });
  }

  async findById(id: number) {
    return prisma.room.findUnique({
      where: { id },
      include: {
        floor: true,
        machines: true,
        _count: { select: { machines: true } }
      }
    });
  }

  async findByNameAndFloor(name: string, floorId: number) {
    return prisma.room.findFirst({
      where: { name, floorId }
    });
  }

  async findAll(floorId?: number) {
    return prisma.room.findMany({
      where: floorId ? { floorId } : undefined,
      orderBy: { name: "asc" },
      include: {
        floor: true,
        _count: { select: { machines: true } }
      }
    });
  }

  async update(id: number, data: Prisma.RoomUpdateInput) {
    return prisma.room.update({
      where: { id },
      data,
      include: {
        floor: true,
        _count: { select: { machines: true } }
      }
    });
  }

  async delete(id: number) {
    return prisma.room.delete({
      where: { id }
    });
  }
}
