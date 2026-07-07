import { z } from 'zod';

// Currently Dashboard APIs are purely GET requests without complex query params.
// If filtering (by date, shift, department) is needed, the schemas would go here.

export const dashboardQuerySchema = z.object({
  departmentId: z.string().optional(),
  shiftId: z.string().optional(),
  date: z.string().optional()
});
