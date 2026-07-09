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
    return prisma.floor.delete({
      where: { id }
    });
  }
}
