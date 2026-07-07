import { AttendanceType, RecordStatus } from "@prisma/client";

export interface AttendanceSearchParams {
  workerId?: number;
  terminalId?: number;
  machineId?: number;
  shiftId?: number;
  attendanceType?: AttendanceType;
  status?: RecordStatus;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface TapAttendanceDto {
  workerId: number;
  terminalId: number;
  attendanceType: AttendanceType;
}
