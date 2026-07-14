import { Prisma, RecordStatus } from "@prisma/client";
import prisma from "../../../config/prisma";

export class FloorRepository {
  async create(data: Prisma.FloorCreateInput) {
    return prisma.floor.create({
      data,
      include: {
        _count: { select: { rooms: true } }
      }
    });
  }

  async findById(id: number) {
    return prisma.floor.findUnique({
      where: { id },
      include: {
        rooms: { include: { _count: { select: { machines: true } } } },
        _count: { select: { rooms: true } }
      }
    });
  }

  async findByFloorNumber(floorNumber: number) {
    return prisma.floor.findUnique({
      where: { floorNumber }
    });
  }

  async findAll() {
    return prisma.floor.findMany({
      orderBy: { floorNumber: "asc" },
      include: {
        rooms: { include: { _count: { select: { machines: true } } } },
        _count: { select: { rooms: true } }
      }
    });
  }

  async update(id: number, data: Prisma.FloorUpdateInput) {
    return prisma.floor.update({
      where: { id },
      data,
      include: {
        _count: { select: { rooms: true } }
      }
    });
  }

  async delete(id: number) {
    const rooms = await prisma.room.findMany({ where: { floorId: id } });
    const roomIds = rooms.map(r => r.id);
    
    if (roomIds.length > 0) {
      await prisma.machine.updateMany({
        where: { roomId: { in: roomIds } },
        data: { roomId: null, rowIndex: null, positionIndex: null }
      });
      await prisma.room.deleteMany({
        where: { floorId: id }
      });
    }

    return prisma.floor.delete({
      where: { id }
    });
  }
}
