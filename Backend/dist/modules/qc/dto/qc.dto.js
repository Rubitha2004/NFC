"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateQCSchema = exports.createQCSchema = void 0;
const zod_1 = require("zod");
exports.createQCSchema = zod_1.z.object({
    bundleId: zod_1.z.number().int().positive(),
    transactionId: zod_1.z.number().int().positive(),
    workerId: zod_1.z.number().int().positive().optional().nullable(),
    machineId: zod_1.z.number().int().positive().optional().nullable(),
    inspectorName: zod_1.z.string().optional().nullable(),
    passQuantity: zod_1.z.number().int().min(0),
    rejectQuantity: zod_1.z.number().int().min(0),
    reworkQuantity: zod_1.z.number().int().min(0),
    remarks: zod_1.z.string().optional().nullable()
});
exports.updateQCSchema = zod_1.z.object({
    passQuantity: zod_1.z.number().int().min(0).optional(),
    rejectQuantity: zod_1.z.number().int().min(0).optional(),
    reworkQuantity: zod_1.z.number().int().min(0).optional(),
    remarks: zod_1.z.string().optional().nullable()
});
