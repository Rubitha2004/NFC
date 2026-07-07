import prisma from "../../../config/prisma";
import { Prisma, RecordStatus } from "@prisma/client";
import { TerminalSearchParams } from "../types/terminal.types";

export class TerminalRepository {
  async create(data: Prisma.TerminalCreateInput) {
    return prisma.terminal.create({
      data,
    });
  }

  async findAll(params: TerminalSearchParams) {
    const {
      terminalCode,
      terminalName,
      status,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc"
    } = params;

    const skip = (page - 1) * limit;

    const where: Prisma.TerminalWhereInput = {
      ...(terminalCode && { terminalCode: { contains: terminalCode, mode: "insensitive" } }),
      ...(terminalName && { terminalName: { contains: terminalName, mode: "insensitive" } }),
      ...(status && { status }),
    };

    const [total, data] = await Promise.all([
      prisma.terminal.count({ where }),
      prisma.terminal.findMany({
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
    return prisma.terminal.findUnique({
      where: { id },
      include: {
        machine: true,
      }
    });
  }

  async findByCode(terminalCode: string) {
    return prisma.terminal.findUnique({
      where: { terminalCode },
      include: {
        machine: true,
      }
    });
  }

  async update(id: number, data: Prisma.TerminalUpdateInput) {
    return prisma.terminal.update({
      where: { id },
      data,
    });
  }

  async changeStatus(id: number, status: RecordStatus) {
    return prisma.terminal.update({
      where: { id },
      data: { status },
    });
  }
}
