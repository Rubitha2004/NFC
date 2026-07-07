import { RecordStatus } from "@prisma/client";

export interface TerminalSearchParams {
  terminalCode?: string;
  terminalName?: string;
  status?: RecordStatus;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreateTerminalDto {
  terminalCode: string;
  terminalName?: string;
  serialNumber?: string;
  ipAddress?: string;
  macAddress?: string;
  firmwareVersion?: string;
}

export interface UpdateTerminalDto {
  terminalName?: string;
  serialNumber?: string;
  ipAddress?: string;
  macAddress?: string;
  firmwareVersion?: string;
  lastHeartbeat?: Date;
}
