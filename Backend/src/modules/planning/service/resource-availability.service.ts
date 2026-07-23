import prisma from "../../../config/prisma";

export class ResourceAvailabilityService {
  async getAvailableWorkers(opts?: { departmentId?: number; requiredSkillId?: number | null }) {
    return prisma.worker.findMany({
      where: {
        status: "ACTIVE",
        assignments: { none: { status: "ACTIVE" } },
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

  async getAvailableMachines(opts?: { departmentId?: number; operationId?: number }) {
    let machineOpFilter = {};
    if (opts?.operationId) {
      const hasRestrictions = await prisma.machineOperationAssignment.count({
        where: { operationId: opts.operationId }
      });
      if (hasRestrictions > 0) {
        machineOpFilter = { machineOperationAssignments: { some: { operationId: opts.operationId } } };
      }
    }

    return prisma.machine.findMany({
      where: {
        status: "ACTIVE",
        assignments: { none: { status: "ACTIVE" } },
        ...(opts?.departmentId ? { departmentId: opts.departmentId } : {}),
        ...machineOpFilter,
      },
      include: { 
        machineType: true, 
        department: true,
        room: true,
        assignments: { where: { status: "ACTIVE" } }
      },
      orderBy: [
        { roomId: "asc" },
        { rowIndex: "asc" },
        { positionIndex: "asc" },
        { id: "asc" }
      ]
    });
  }
}

export const resourceAvailabilityService = new ResourceAvailabilityService();
