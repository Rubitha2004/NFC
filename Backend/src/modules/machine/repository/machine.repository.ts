import prisma from "../../../config/prisma";
import { Prisma, RecordStatus } from "@prisma/client";
import { MachineSearchParams } from "../types/machine.types";

export class MachineRepository {
  async create(data: Prisma.MachineUncheckedCreateInput) {
    return prisma.machine.create({
      data,
    });
  }

  async findAll(params: MachineSearchParams) {
    const {
      machineCode,
      machineName,
      departmentId,
      machineTypeId,
      status,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc"
    } = params;

    const skip = (page - 1) * limit;

    const where: Prisma.MachineWhereInput = {
      ...(machineCode && { machineCode: { contains: machineCode, mode: "insensitive" } }),
      ...(machineName && { machineName: { contains: machineName, mode: "insensitive" } }),
      ...(departmentId && { departmentId: Number(departmentId) }),
      ...(machineTypeId && { machineTypeId: Number(machineTypeId) }),
      ...(status && { status }),
    };

    const [total, data] = await Promise.all([
      prisma.machine.count({ where }),
      prisma.machine.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          department: true,
          machineType: true,
          terminal: true,
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
    return prisma.machine.findUnique({
      where: { id },
      include: {
        department: true,
        machineType: true,
        terminal: true,
      }
    });
  }

  async findByMachineCode(machineCode: string) {
    return prisma.machine.findUnique({
      where: { machineCode },
    });
  }

  async findByTerminal(terminalId: number) {
    return prisma.machine.findUnique({
      where: { terminalId },
    });
  }

  async update(id: number, data: Prisma.MachineUncheckedUpdateInput) {
    return prisma.machine.update({
      where: { id },
      data,
    });
  }

  async changeStatus(id: number, status: RecordStatus) {
    return prisma.machine.update({
      where: { id },
      data: { status },
    });
  }

  async checkDepartmentExists(id: number) {
    return prisma.department.findUnique({
      where: { id },
    });
  }

  async checkMachineTypeExists(id: number) {
    return prisma.machineType.findUnique({
      where: { id },
    });
  }

  async checkTerminalExists(id: number) {
    return prisma.terminal.findUnique({
      where: { id },
    });
  }
}
