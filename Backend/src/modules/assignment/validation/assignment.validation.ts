import { z } from "zod";
import { AssignmentStatus } from "@prisma/client";

export const createAssignmentSchema = z.object({
  workerId: z.number().int().positive("Worker ID is required"),
  machineId: z.number().int().positive("Machine ID is required"),
  operationId: z.number().int().positive("Operation ID is required"),
  shiftId: z.number().int().positive("Shift ID is required"),
  assignedBy: z.string().optional(),
  remarks: z.string().optional(),
});

export const updateAssignmentSchema = z.object({
  assignedBy: z.string().optional(),
  remarks: z.string().optional(),
});

export const releaseAssignmentSchema = z.object({
  // Optionally accept something if needed, currently we just release
});
