import { z } from "zod";
import { RecordStatus } from "@prisma/client";

export const createOperationSchema = z.object({
  operationCode: z.string().min(1, "Operation Code is required"),
  operationName: z.string().min(1, "Operation Name is required"),
  description: z.string().optional(),
  standardMinuteValue: z.number().positive("SMV must be greater than 0"),
  displayOrder: z.number().int().min(0).optional(),
  status: z.nativeEnum(RecordStatus).optional(),
});

export const updateOperationSchema = z.object({
  operationCode: z.string().min(1).optional(),
  operationName: z.string().min(1).optional(),
  description: z.string().optional(),
  standardMinuteValue: z.number().positive().optional(),
  displayOrder: z.number().int().min(0).optional(),
  status: z.nativeEnum(RecordStatus).optional(),
});

export const changeOperationStatusSchema = z.object({
  status: z.nativeEnum(RecordStatus, { message: "Status is required" }),
});
