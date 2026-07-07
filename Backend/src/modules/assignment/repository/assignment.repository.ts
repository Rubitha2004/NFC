import prisma from "../../../config/prisma";
import { Prisma, AssignmentStatus } from "@prisma/client";
import { AssignmentSearchParams } from "../types/assignment.types";

export class AssignmentRepository {
  async create(data: Prisma.AssignmentUncheckedCreateInput) {
    return prisma.assignment.create({
      data,
      include: {
        worker: true,
        machine: true,
        operation: true,
        shift: true,
      },
    });
  }

  async findAll(params: AssignmentSearchParams) {
    const {
      workerId,
      machineId,
      operationId,
      shiftId,
      status,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc"
    } = params;

    const skip = (page - 1) * limit;

    const where: Prisma.AssignmentWhereInput = {
      ...(workerId && { workerId }),
      ...(machineId && { machineId }),
      ...(operationId && { operationId }),
      ...(shiftId && { shiftId }),
      ...(status && { status }),
    };

    const [total, data] = await Promise.all([
      prisma.assignment.count({ where }),
      prisma.assignment.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          worker: true,
          machine: true,
          operation: true,
          shift: true,
        },
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
    return prisma.assignment.findUnique({
      where: { id },
      include: {
        worker: true,
        machine: true,
        operation: true,
        shift: true,
      },
    });
  }

  async findActiveWorkerAssignment(workerId: number, shiftId?: number) {
    const where: Prisma.AssignmentWhereInput = {
      workerId,
      status: AssignmentStatus.ACTIVE,
      ...(shiftId && { shiftId })
    };
    return prisma.assignment.findFirst({
      where,
    });
  }

  async findActiveMachineAssignment(machineId: number, shiftId?: number) {
    const where: Prisma.AssignmentWhereInput = {
      machineId,
      status: AssignmentStatus.ACTIVE,
      ...(shiftId && { shiftId })
    };
    return prisma.assignment.findFirst({
      where,
    });
  }

  async releaseAssignment(id: number) {
    return prisma.assignment.update({
      where: { id },
      data: {
        status: AssignmentStatus.COMPLETED,
        releasedAt: new Date(),
      },
    });
  }

  async update(id: number, data: Prisma.AssignmentUncheckedUpdateInput) {
    return prisma.assignment.update({
      where: { id },
      data,
    });
  }
}
