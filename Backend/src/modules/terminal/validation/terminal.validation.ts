import { z } from "zod";
import { RecordStatus } from "@prisma/client";

export const createTerminalSchema = z.object({
  terminalCode: z.string().min(1, "Terminal Code is required"),
  terminalName: z.string().optional(),
  serialNumber: z.string().optional(),
  ipAddress: z.string().optional(),
  macAddress: z.string().optional(),
  firmwareVersion: z.string().optional(),
});

export const updateTerminalSchema = z.object({
  terminalName: z.string().optional(),
  serialNumber: z.string().optional(),
  ipAddress: z.string().optional(),
  macAddress: z.string().optional(),
  firmwareVersion: z.string().optional(),
});

export const changeTerminalStatusSchema = z.object({
  status: z.nativeEnum(RecordStatus, { message: "Status is required" }),
});
