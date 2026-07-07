"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeOperationStatusSchema = exports.updateOperationSchema = exports.createOperationSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.createOperationSchema = zod_1.z.object({
    operationCode: zod_1.z.string().min(1, "Operation Code is required"),
    operationName: zod_1.z.string().min(1, "Operation Name is required"),
    description: zod_1.z.string().optional(),
    standardMinuteValue: zod_1.z.number().positive("SMV must be greater than 0"),
    displayOrder: zod_1.z.number().int().min(0).optional(),
    status: zod_1.z.nativeEnum(client_1.RecordStatus).optional(),
});
exports.updateOperationSchema = zod_1.z.object({
    operationName: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().optional(),
    standardMinuteValue: zod_1.z.number().positive().optional(),
    displayOrder: zod_1.z.number().int().min(0).optional(),
});
exports.changeOperationStatusSchema = zod_1.z.object({
    status: zod_1.z.nativeEnum(client_1.RecordStatus, { message: "Status is required" }),
});
