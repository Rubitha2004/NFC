import prisma from "../../../config/prisma";
import { Prisma, RecordStatus } from "@prisma/client";
import { OperationSearchParams } from "../types/operation.types";

export class OperationRepository {
  async create(data: Prisma.OperationCreateInput) {
    return prisma.operation.create({
      data,
    });
  }

  async findAll(params: OperationSearchParams) {
    const {
      operationCode,
      operationName,
      status,
      page = 1,
      limit = 10,
      sortBy = "displayOrder",
      sortOrder = "asc"
    } = params;

    const skip = (page - 1) * limit;

    const where: Prisma.OperationWhereInput = {
      ...(operationCode && { operationCode: { contains: operationCode, mode: "insensitive" } }),
      ...(operationName && { operationName: { contains: operationName, mode: "insensitive" } }),
      ...(status && { status }),
    };

    const [total, data] = await Promise.all([
      prisma.operation.count({ where }),
      prisma.operation.findMany({
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
    return prisma.operation.findUnique({
      where: { id },
    });
  }

  async findByCode(operationCode: string) {
    return prisma.operation.findUnique({
      where: { operationCode },
    });
  }

  async findByName(operationName: string) {
    return prisma.operation.findUnique({
      where: { operationName },
    });
  }

  async update(id: number, data: Prisma.OperationUpdateInput) {
    return prisma.operation.update({
      where: { id },
      data,
    });
  }

  async changeStatus(id: number, status: RecordStatus) {
    return prisma.operation.update({
      where: { id },
      data: { status },
    });
  }
}
