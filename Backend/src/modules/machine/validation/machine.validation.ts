import { z } from "zod";
import { RecordStatus } from "@prisma/client";

export const createMachineSchema = z.object({
  machineCode: z.string().min(1, "Machine Code is required"),
  machineName: z.string().min(1, "Machine Name is required"),
  departmentId: z.number().int().positive("Department ID must be a positive number"),
  machineTypeId: z.number().int().positive("Machine Type ID must be a positive number"),
  terminalId: z.number().int().positive("Terminal ID must be a positive number"),
  status: z.nativeEnum(RecordStatus).optional(),
  remarks: z.string().optional(),
  roomId: z.number().int().optional().nullable(),
  rowIndex: z.number().int().optional().nullable(),
  positionIndex: z.number().int().optional().nullable(),
});

export const updateMachineSchema = z.object({
  machineCode: z.string().min(1).optional(),
  machineName: z.string().min(1).optional(),
  departmentId: z.number().int().positive().optional(),
  machineTypeId: z.number().int().positive().optional(),
  terminalId: z.number().int().positive().optional(),
  remarks: z.string().optional(),
  roomId: z.number().int().optional().nullable(),
  rowIndex: z.number().int().optional().nullable(),
  positionIndex: z.number().int().optional().nullable(),
  status: z.nativeEnum(RecordStatus).optional(),
});

export const changeMachineStatusSchema = z.object({
  status: z.nativeEnum(RecordStatus, { message: "Status is required" }),
});

export const assignMachineRoomSchema = z.object({
  roomId: z.number().int().nullable(),
  rowIndex: z.number().int().nullable(),
  positionIndex: z.number().int().nullable(),
});
