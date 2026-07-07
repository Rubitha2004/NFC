import { RecordStatus } from "@prisma/client";

export interface MachineSearchParams {
  machineCode?: string;
  machineName?: string;
  departmentId?: number;
  machineTypeId?: number;
  status?: RecordStatus;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
