import prisma from "../../../config/prisma";
import { Prisma, RecordStatus } from "@prisma/client";

export class DepartmentRepository {

  /**
   * Create Department
   */
  async create(data: Prisma.DepartmentCreateInput) {
    return prisma.department.create({
      data,
    });
  }

  /**
   * Find Department by ID (with related counts)
   */
  async findById(id: number) {
    return prisma.department.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            workers: true,
            machines: true,
            productionTasks: true,
          },
        },
      },
    });
  }

  /**
   * Find Department by Code
   */
  async findByCode(code: string) {
    return prisma.department.findUnique({
      where: { code },
    });
  }

  /**
   * Find Department by Name
   */
  async findByName(name: string) {
    return prisma.department.findUnique({
      where: { name },
    });
  }

  /**
   * Get All Departments with optional search/filter
   */
  async findAll(options?: { search?: string; status?: string }) {
    const where: Prisma.DepartmentWhereInput = {};

    if (options?.search) {
      where.OR = [
        { name: { contains: options.search, mode: "insensitive" } },
        { code: { contains: options.search, mode: "insensitive" } },
        { description: { contains: options.search, mode: "insensitive" } },
      ];
    }

    if (options?.status && options.status !== "all") {
      const statusUpper = options.status.toUpperCase();
      if (statusUpper === "ACTIVE" || statusUpper === "INACTIVE") {
        where.status = statusUpper as RecordStatus;
      }
    }

    return prisma.department.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            workers: true,
            machines: true,
            productionTasks: true,
          },
        },
      },
    });
  }

  /**
   * Update Department
   */
  async update(id: number, data: Prisma.DepartmentUpdateInput) {
    return prisma.department.update({
      where: { id },
      data,
      include: {
        _count: {
          select: {
            workers: true,
            machines: true,
          },
        },
      },
    });
  }

  /**
   * Delete Department (hard delete)
   */
  async delete(id: number) {
    return prisma.department.delete({
      where: { id },
    });
  }

  /**
   * Change Department Status
   */
  async changeStatus(id: number, status: RecordStatus) {
    return prisma.department.update({
      where: { id },
      data: { status },
    });
  }
}