import { z } from 'zod';
import { TransactionType } from '@prisma/client';

export const createBundleTransactionSchema = z.object({
  bundleId: z.number().int().positive(),
  productionOrderId: z.number().int().positive(),
  fromOperationId: z.number().int().positive().optional().nullable(),
  toOperationId: z.number().int().positive().optional().nullable(),
  fromWorkerId: z.number().int().positive().optional().nullable(),
  toWorkerId: z.number().int().positive().optional().nullable(),
  fromMachineId: z.number().int().positive().optional().nullable(),
  toMachineId: z.number().int().positive().optional().nullable(),
  quantity: z.number().int().positive(),
  transactionType: z.nativeEnum(TransactionType),
  remarks: z.string().optional().nullable()
});
