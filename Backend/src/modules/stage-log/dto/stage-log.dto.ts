import { z } from 'zod';

export const ScanInSchema = z.object({
  bundleId: z.number().int().positive(),
  tagId: z.number().int().positive(),
  operationId: z.number().int().positive(),
  operatorId: z.number().int().positive(),
  remarks: z.string().optional(),
});

export const ScanOutSchema = z.object({
  remarks: z.string().optional(),
});

export type ScanInDTO = z.infer<typeof ScanInSchema>;
export type ScanOutDTO = z.infer<typeof ScanOutSchema>;
