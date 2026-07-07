import { z } from 'zod';

export const reportQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  departmentId: z.coerce.number().optional(),
  shiftId: z.coerce.number().optional(),
  workerId: z.coerce.number().optional(),
  machineId: z.coerce.number().optional(),
  operationId: z.coerce.number().optional(),
  productionOrderId: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
});
