import { z } from "zod";

export const createProductionOrderSchema = z.object({
  orderNumber: z.string().min(1, "Order number is required"),
  buyerName: z.string().min(1, "Buyer name is required"),
  styleNumber: z.string().min(1, "Style number is required"),
  styleName: z.string().min(1, "Style name is required"),
  color: z.string().min(1, "Color is required"),
  size: z.string().min(1, "Size is required"),
  plannedQuantity: z.number().int().positive("Planned quantity must be positive"),
  priority: z.number().int().min(0).optional().default(0),
  plannedStartDate: z.string().datetime(),
  plannedEndDate: z.string().datetime(),
  remarks: z.string().optional(),
});

export const updateProductionOrderSchema = createProductionOrderSchema.partial();

export const updateProductionOrderStatusSchema = z.object({
  status: z.enum(["PLANNED", "IN_PROGRESS", "COMPLETED", "CLOSED"]),
});
