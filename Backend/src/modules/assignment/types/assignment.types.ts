import { AssignmentStatus } from "@prisma/client";

export interface AssignmentSearchParams {
  workerId?: number;
  machineId?: number;
  operationId?: number;
  shiftId?: number;
  status?: AssignmentStatus;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreateAssignmentDto {
  workerId: number;
  machineId: number;
  operationId: number;
  shiftId: number;
  assignedBy?: string;
  remarks?: string;
}

export interface UpdateAssignmentDto {
  assignedBy?: string;
  remarks?: string;
}
