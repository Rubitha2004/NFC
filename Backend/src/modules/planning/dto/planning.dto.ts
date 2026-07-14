import { z } from "zod";
import { TaskStatus } from "@prisma/client";

export const CreateTaskSchema = z.object({
  productionOrderId: z.number(),
  bundleId: z.number().optional(),
  operationId: z.number(),
  departmentId: z.number(),
  machineId: z.number().optional(),
  workerId: z.number().optional(),
  shiftId: z.number().optional(),
  priority: z.number().default(0),
  estimatedTime: z.number(),
  targetQuantity: z.number(),
  supervisor: z.string().optional(),
  remarks: z.string().optional(),
});

export type CreateTaskDTO = z.infer<typeof CreateTaskSchema>;

export const UpdateTaskSchema = z.object({
  status: z.nativeEnum(TaskStatus).optional(),
  machineId: z.number().nullable().optional(),
  workerId: z.number().nullable().optional(),
  shiftId: z.number().nullable().optional(),
  priority: z.number().optional(),
  supervisor: z.string().nullable().optional(),
  remarks: z.string().nullable().optional(),
});

export type UpdateTaskDTO = z.infer<typeof UpdateTaskSchema>;

export const PublishPlanSchema = z.object({
  productionOrderId: z.number(),
  bundles: z.array(z.object({
    quantity: z.number().int().positive()
  })),
  assignments: z.array(z.object({
    operationId: z.number(),
    workerId: z.number(),
    machineId: z.number(),
    shiftId: z.number().optional(),
    roomId: z.number().optional(),
    rowIndex: z.number().optional(),
    positionIndex: z.number().optional()
  })),
  operations: z.array(z.number()).optional()
});

export type PublishPlanDTO = z.infer<typeof PublishPlanSchema>;
