"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tapAttendanceSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.tapAttendanceSchema = zod_1.z.object({
    workerId: zod_1.z.number().int().positive("Worker ID is required"),
    terminalId: zod_1.z.number().int().positive("Terminal ID is required"),
    attendanceType: zod_1.z.nativeEnum(client_1.AttendanceType, { message: "AttendanceType (IN/OUT) is required" }),
});
