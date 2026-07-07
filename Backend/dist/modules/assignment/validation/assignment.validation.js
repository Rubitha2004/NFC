"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.releaseAssignmentSchema = exports.updateAssignmentSchema = exports.createAssignmentSchema = void 0;
const zod_1 = require("zod");
exports.createAssignmentSchema = zod_1.z.object({
    workerId: zod_1.z.number().int().positive("Worker ID is required"),
    machineId: zod_1.z.number().int().positive("Machine ID is required"),
    operationId: zod_1.z.number().int().positive("Operation ID is required"),
    shiftId: zod_1.z.number().int().positive("Shift ID is required"),
    assignedBy: zod_1.z.string().optional(),
    remarks: zod_1.z.string().optional(),
});
exports.updateAssignmentSchema = zod_1.z.object({
    assignedBy: zod_1.z.string().optional(),
    remarks: zod_1.z.string().optional(),
});
exports.releaseAssignmentSchema = zod_1.z.object({
// Optionally accept something if needed, currently we just release
});
