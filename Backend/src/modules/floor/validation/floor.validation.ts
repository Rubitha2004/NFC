import { z } from "zod";
import { RecordStatus } from "@prisma/client";

export const createFloorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  floorNumber: z.number().int(),
  factoryName: z.string().optional().nullable(),
  status: z.nativeEnum(RecordStatus).optional().default(RecordStatus.ACTIVE),
});

export const updateFloorSchema = z.object({
  name: z.string().min(1).optional(),
  floorNumber: z.number().int().optional(),
  factoryName: z.string().optional().nullable(),
  status: z.nativeEnum(RecordStatus).optional(),
});

export type CreateFloorDTO = z.infer<typeof createFloorSchema>;
export type UpdateFloorDTO = z.infer<typeof updateFloorSchema>;
