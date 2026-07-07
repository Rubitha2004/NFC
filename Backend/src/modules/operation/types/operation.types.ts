import { RecordStatus } from "@prisma/client";

export interface OperationSearchParams {
  operationCode?: string;
  operationName?: string;
  status?: RecordStatus;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
