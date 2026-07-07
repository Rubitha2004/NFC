"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDepartmentSchema = exports.createDepartmentSchema = void 0;
const zod_1 = require("zod");
exports.createDepartmentSchema = zod_1.z.object({
    code: zod_1.z
        .string()
        .trim()
        .min(2, "Department code is required")
        .max(10, "Department code cannot exceed 10 characters"),
    name: zod_1.z
        .string()
        .trim()
        .min(3, "Department name is required")
        .max(100, "Department name cannot exceed 100 characters"),
    description: zod_1.z
        .string()
        .trim()
        .max(255, "Description cannot exceed 255 characters")
        .optional(),
    status: zod_1.z
        .enum(["ACTIVE", "INACTIVE"])
        .optional()
        .default("ACTIVE"),
});
exports.updateDepartmentSchema = zod_1.z.object({
    code: zod_1.z
        .string()
        .trim()
        .min(2, "Department code is required")
        .max(10, "Department code cannot exceed 10 characters")
        .optional(),
    name: zod_1.z
        .string()
        .trim()
        .min(3, "Department name is required")
        .max(100, "Department name cannot exceed 100 characters")
        .optional(),
    description: zod_1.z
        .string()
        .trim()
        .max(255, "Description cannot exceed 255 characters")
        .optional()
        .nullable(),
    status: zod_1.z
        .enum(["ACTIVE", "INACTIVE"])
        .optional(),
});
