import prisma from "../../../config/prisma";

export class ResourceAvailabilityService {
  async getAvailableWorkers(opts?: { departmentId?: number; requiredSkillId?: number | null }) {
    return prisma.worker.findMany({
      where: {
        status: "ACTIVE",
        ...(opts?.departmentId ? { departmentId: opts.departmentId } : {}),
        ...(opts?.requiredSkillId
          ? { skills: { some: { skillId: opts.requiredSkillId } } }
          : {}),
      },
      include: { 
        skills: { include: { skill: true } }, 
        grade: true, 
        department: true,
        assignments: { where: { status: "ACTIVE" } }
      },
      orderBy: { grade: { priority: "asc" } },
    });
  }

  async getAvailableMachines(opts?: { departmentId?: number }) {
    return prisma.machine.findMany({
      where: {
        status: "ACTIVE",
        ...(opts?.departmentId ? { departmentId: opts.departmentId } : {}),
      },
      include: { 
        machineType: true, 
        department: true,
        assignments: { where: { status: "ACTIVE" } }
      },
    });
  }
}

export const resourceAvailabilityService = new ResourceAvailabilityService();
