import { z } from "zod";
import { RecordStatus } from "@prisma/client";

export const createRoomSchema = z.object({
  floorId: z.number().int(),
  name: z.string().min(1),
  roomType: z.string().optional().nullable(),
  rowsCount: z.number().int().min(1).optional().default(3),
  machinesPerRow: z.number().int().min(1).optional().default(35),
  status: z.nativeEnum(RecordStatus).optional().default(RecordStatus.ACTIVE),
});

export const updateRoomSchema = z.object({
  floorId: z.number().int().optional(),
  name: z.string().min(1).optional(),
  roomType: z.string().optional().nullable(),
  rowsCount: z.number().int().min(1).optional(),
  machinesPerRow: z.number().int().min(1).optional(),
  status: z.nativeEnum(RecordStatus).optional(),
});

export type CreateRoomDTO = z.infer<typeof createRoomSchema>;
export type UpdateRoomDTO = z.infer<typeof updateRoomSchema>;
