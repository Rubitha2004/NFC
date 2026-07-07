import { RecordStatus } from "@prisma/client";

export interface ShiftSearchParams {
  shiftCode?: string;
  shiftName?: string;
  status?: RecordStatus;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
