"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeWorkerStatusSchema = exports.updateWorkerSchema = exports.createWorkerSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.createWorkerSchema = zod_1.z.object({
    employeeCode: zod_1.z.string().min(1, "Employee Code is required"),
    firstName: zod_1.z.string().min(1, "First Name is required"),
    lastName: zod_1.z.string().min(1, "Last Name is required"),
    departmentId: zod_1.z.number(),
    gradeId: zod_1.z.number(),
    nfcCardId: zod_1.z.string().min(1, "NFC Card ID is required"),
    gender: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
    email: zod_1.z.string().email("Invalid email").optional().or(zod_1.z.literal("")),
    dateOfBirth: zod_1.z.string().optional().transform(val => val ? new Date(val) : undefined),
    joiningDate: zod_1.z.string().optional().transform(val => val ? new Date(val) : undefined),
    remarks: zod_1.z.string().optional()
});
exports.updateWorkerSchema = zod_1.z.object({
    employeeCode: zod_1.z.string().min(1).optional(),
    firstName: zod_1.z.string().min(1).optional(),
    lastName: zod_1.z.string().min(1).optional(),
    departmentId: zod_1.z.number().optional(),
    gradeId: zod_1.z.number().optional(),
    nfcCardId: zod_1.z.string().min(1).optional(),
    gender: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
    email: zod_1.z.string().email("Invalid email").optional().or(zod_1.z.literal("")),
    dateOfBirth: zod_1.z.string().optional().transform(val => val ? new Date(val) : undefined),
    joiningDate: zod_1.z.string().optional().transform(val => val ? new Date(val) : undefined),
    remarks: zod_1.z.string().optional()
});
exports.changeWorkerStatusSchema = zod_1.z.object({
    status: zod_1.z.enum([client_1.RecordStatus.ACTIVE, client_1.RecordStatus.INACTIVE])
});
