"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScanOutSchema = exports.ScanInSchema = void 0;
const zod_1 = require("zod");
exports.ScanInSchema = zod_1.z.object({
    bundleId: zod_1.z.number().int().positive(),
    tagId: zod_1.z.number().int().positive(),
    operationId: zod_1.z.number().int().positive(),
    operatorId: zod_1.z.number().int().positive(),
    remarks: zod_1.z.string().optional(),
});
exports.ScanOutSchema = zod_1.z.object({
    remarks: zod_1.z.string().optional(),
});
