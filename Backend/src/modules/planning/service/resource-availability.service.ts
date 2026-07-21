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
    return prisma.machine.findMany({
      where: {
        status: "ACTIVE",
        assignments: { none: { status: "ACTIVE" } },
        ...(opts?.departmentId ? { departmentId: opts.departmentId } : {}),
        // If an operationId is provided, only return machines listed as
        // compatible with that operation in MachineOperationAssignment.
        ...(opts?.operationId
          ? { machineOperationAssignments: { some: { operationId: opts.operationId } } }
          : {}),
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
