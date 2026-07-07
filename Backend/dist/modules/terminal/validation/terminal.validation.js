"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeTerminalStatusSchema = exports.updateTerminalSchema = exports.createTerminalSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.createTerminalSchema = zod_1.z.object({
    terminalCode: zod_1.z.string().min(1, "Terminal Code is required"),
    terminalName: zod_1.z.string().optional(),
    serialNumber: zod_1.z.string().optional(),
    ipAddress: zod_1.z.string().optional(),
    macAddress: zod_1.z.string().optional(),
    firmwareVersion: zod_1.z.string().optional(),
});
exports.updateTerminalSchema = zod_1.z.object({
    terminalName: zod_1.z.string().optional(),
    serialNumber: zod_1.z.string().optional(),
    ipAddress: zod_1.z.string().optional(),
    macAddress: zod_1.z.string().optional(),
    firmwareVersion: zod_1.z.string().optional(),
});
exports.changeTerminalStatusSchema = zod_1.z.object({
    status: zod_1.z.nativeEnum(client_1.RecordStatus, { message: "Status is required" }),
});
