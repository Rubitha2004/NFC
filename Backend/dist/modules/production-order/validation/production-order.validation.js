"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductionOrderStatusSchema = exports.updateProductionOrderSchema = exports.createProductionOrderSchema = void 0;
const zod_1 = require("zod");
exports.createProductionOrderSchema = zod_1.z.object({
    orderNumber: zod_1.z.string().min(1, "Order number is required"),
    buyerName: zod_1.z.string().min(1, "Buyer name is required"),
    styleNumber: zod_1.z.string().min(1, "Style number is required"),
    styleName: zod_1.z.string().min(1, "Style name is required"),
    color: zod_1.z.string().min(1, "Color is required"),
    size: zod_1.z.string().min(1, "Size is required"),
    plannedQuantity: zod_1.z.number().int().positive("Planned quantity must be positive"),
    priority: zod_1.z.number().int().min(0).optional().default(0),
    plannedStartDate: zod_1.z.string().datetime(),
    plannedEndDate: zod_1.z.string().datetime(),
    remarks: zod_1.z.string().optional(),
});
exports.updateProductionOrderSchema = exports.createProductionOrderSchema.partial();
exports.updateProductionOrderStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(["PLANNED", "IN_PROGRESS", "COMPLETED", "CLOSED"]),
});
