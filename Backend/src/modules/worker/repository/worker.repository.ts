import prisma from "../../../config/prisma";
import { Prisma, RecordStatus } from "@prisma/client";
import { WorkerSearchParams } from "../types/worker.types";

export class WorkerRepository {
  
  async create(data: Prisma.WorkerUncheckedCreateInput) {
    return prisma.worker.create({
      data,
    });
  }

  async findAll(params: WorkerSearchParams) {
    const { 
      employeeCode, 
      name, 
      departmentId, 
      gradeId, 
      status, 
      page = 1, 
      limit = 10, 
      sortBy = "createdAt", 
      sortOrder = "desc" 
    } = params;
    
    const skip = (page - 1) * limit;

    const where: Prisma.WorkerWhereInput = {
      ...(employeeCode && { employeeCode: { contains: employeeCode, mode: "insensitive" } }),
      ...(name && { 
        OR: [
          { firstName: { contains: name, mode: "insensitive" } },
          { lastName: { contains: name, mode: "insensitive" } }
        ]
      }),
      ...(departmentId && { departmentId: Number(departmentId) }),
      ...(gradeId && { gradeId: Number(gradeId) }),
      ...(status && { status }),
    };

    const [total, data] = await Promise.all([
      prisma.worker.count({ where }),
      prisma.worker.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          department: true,
          grade: true,
          skills: {
            include: {
              skill: true
            }
          },
          assignments: {
            where: { status: "ACTIVE" },
            include: { machine: true, operation: true }
          }
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
    return prisma.worker.findUnique({
      where: { id },
      include: {
        department: true,
        grade: true,
        skills: {
          include: {
            skill: true
          }
        },
        assignments: {
          where: { status: "ACTIVE" },
          include: { machine: true, operation: true }
        }
      }
    });
  }

  async findByEmployeeCode(employeeCode: string) {
    return prisma.worker.findUnique({
      where: { employeeCode },
    });
  }

  async findByNFCCard(nfcCardId: string) {
    return prisma.worker.findUnique({
      where: { nfcCardId },
    });
  }

  async update(id: number, data: Prisma.WorkerUncheckedUpdateInput) {
    return prisma.worker.update({
      where: { id },
      data,
    });
  }

  async changeStatus(id: number, status: RecordStatus) {
    return prisma.worker.update({
      where: { id },
      data: { status },
    });
  }

  async checkDepartmentExists(id: number) {
    return prisma.department.findUnique({
      where: { id },
    });
  }

  async checkGradeExists(id: number) {
    return prisma.workerGrade.findUnique({
      where: { id },
    });
  }
}
