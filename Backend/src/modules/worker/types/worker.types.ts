import { RecordStatus } from "@prisma/client";

export interface WorkerSearchParams {
  employeeCode?: string;
  name?: string;
  departmentId?: number;
  gradeId?: number;
  status?: RecordStatus;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
