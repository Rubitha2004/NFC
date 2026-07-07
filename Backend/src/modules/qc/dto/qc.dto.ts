import { z } from 'zod';

export const createQCSchema = z.object({
  bundleId: z.number().int().positive(),
  transactionId: z.number().int().positive(),
  workerId: z.number().int().positive().optional().nullable(),
  machineId: z.number().int().positive().optional().nullable(),
  inspectorName: z.string().optional().nullable(),
  passQuantity: z.number().int().min(0),
  rejectQuantity: z.number().int().min(0),
  reworkQuantity: z.number().int().min(0),
  remarks: z.string().optional().nullable()
});

export const updateQCSchema = z.object({
  passQuantity: z.number().int().min(0).optional(),
  rejectQuantity: z.number().int().min(0).optional(),
  reworkQuantity: z.number().int().min(0).optional(),
  remarks: z.string().optional().nullable()
});
