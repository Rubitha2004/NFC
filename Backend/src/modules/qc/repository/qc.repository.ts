import prisma from "../../../config/prisma";
import { Prisma } from "@prisma/client";

export class QCRepository {
  async create(data: Prisma.QCUncheckedCreateInput) {
    return prisma.qC.create({ data });
  }

  async findAll() {
    return prisma.qC.findMany({
      include: {
        bundle: true,
        transaction: true,
        worker: true,
        machine: true,
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id: number) {
    return prisma.qC.findUnique({
      where: { id },
      include: {
        bundle: true,
        transaction: true,
        worker: true,
        machine: true,
      }
    });
  }

  async update(id: number, data: Prisma.QCUncheckedUpdateInput) {
    return prisma.qC.update({
      where: { id },
      data
    });
  }
}
