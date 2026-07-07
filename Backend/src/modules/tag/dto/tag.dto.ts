import { z } from 'zod';

export const CreateTagSchema = z.object({
  tagCode: z.string().min(1, 'Tag code is required'),
  assignedBy: z.string().optional(),
});

export const AssignTagSchema = z.object({
  bundleId: z.number().int().positive(),
  assignedBy: z.string().optional(),
});

export type CreateTagDTO = z.infer<typeof CreateTagSchema>;
export type AssignTagDTO = z.infer<typeof AssignTagSchema>;
