import { z } from 'zod';

export const CreateQCCheckSchema = z.object({
  bundleId: z.number().int().positive(),
  tagId: z.number().int().positive().optional(),
  qcPersonId: z.number().int().positive(),
  qcTier: z.enum(['LINE_QC', 'FINAL_QC']),
  operationId: z.number().int().positive().optional(),
  workerId: z.number().int().positive().optional(),
  status: z.enum(['PASS', 'FAIL', 'REWORK']),
  defectNotes: z.string().optional(),
});

export type CreateQCCheckDTO = z.infer<typeof CreateQCCheckSchema>;
