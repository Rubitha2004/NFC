"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignTagSchema = exports.CreateTagSchema = void 0;
const zod_1 = require("zod");
exports.CreateTagSchema = zod_1.z.object({
    tagCode: zod_1.z.string().min(1, 'Tag code is required'),
    assignedBy: zod_1.z.string().optional(),
});
exports.AssignTagSchema = zod_1.z.object({
    bundleId: zod_1.z.number().int().positive(),
    assignedBy: zod_1.z.string().optional(),
});
