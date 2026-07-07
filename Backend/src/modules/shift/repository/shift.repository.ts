import prisma from "../../../config/prisma";
import { Prisma, RecordStatus } from "@prisma/client";
import { ShiftSearchParams } from "../types/shift.types";

export class ShiftRepository {
  async create(data: Prisma.ShiftUncheckedCreateInput) {
    return prisma.shift.create({
      data,
    });
  }

  async findAll(params: ShiftSearchParams) {
    const {
      shiftCode,
      shiftName,
      status,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc"
    } = params;

    const skip = (page - 1) * limit;

    const where: Prisma.ShiftWhereInput = {
      ...(shiftCode && { shiftCode: { contains: shiftCode, mode: "insensitive" } }),
      ...(shiftName && { shiftName: { contains: shiftName, mode: "insensitive" } }),
      ...(status && { status }),
    };

    const [total, data] = await Promise.all([
      prisma.shift.count({ where }),
      prisma.shift.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: {
          [sortBy]: sortOrder,
        }
      })
    ]);

    return {
      total,
      page,
      limit,
      data
    };
  }

  async findById(id: number) {
    return prisma.shift.findUnique({
      where: { id },
    });
  }

  async findByCode(shiftCode: string) {
    return prisma.shift.findUnique({
      where: { shiftCode },
    });
  }

  async findByName(shiftName: string) {
    return prisma.shift.findUnique({
      where: { shiftName },
    });
  }

  async update(id: number, data: Prisma.ShiftUncheckedUpdateInput) {
    return prisma.shift.update({
      where: { id },
      data,
    });
  }

  async changeStatus(id: number, status: RecordStatus) {
    return prisma.shift.update({
      where: { id },
      data: { status },
    });
  }
}
