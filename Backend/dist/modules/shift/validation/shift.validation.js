"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeShiftStatusSchema = exports.updateShiftSchema = exports.createShiftSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
// Regex for HH:mm
const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
exports.createShiftSchema = zod_1.z.object({
    shiftCode: zod_1.z.string().min(1, "Shift Code is required"),
    shiftName: zod_1.z.string().min(1, "Shift Name is required"),
    startTime: zod_1.z.string().regex(timeRegex, "Start time must be in HH:mm format"),
    endTime: zod_1.z.string().regex(timeRegex, "End time must be in HH:mm format"),
    breakStart: zod_1.z.string().regex(timeRegex, "Break start must be in HH:mm format").optional(),
    breakEnd: zod_1.z.string().regex(timeRegex, "Break end must be in HH:mm format").optional(),
    status: zod_1.z.nativeEnum(client_1.RecordStatus).optional(),
}).refine(data => {
    if ((data.breakStart && !data.breakEnd) || (!data.breakStart && data.breakEnd)) {
        return false;
    }
    return true;
}, {
    message: "Both breakStart and breakEnd must be provided together",
    path: ["breakStart"],
});
exports.updateShiftSchema = zod_1.z.object({
    shiftName: zod_1.z.string().min(1).optional(),
    startTime: zod_1.z.string().regex(timeRegex).optional(),
    endTime: zod_1.z.string().regex(timeRegex).optional(),
    breakStart: zod_1.z.string().regex(timeRegex).optional().nullable(),
    breakEnd: zod_1.z.string().regex(timeRegex).optional().nullable(),
}).refine(data => {
    if (data.breakStart === null || data.breakEnd === null)
        return true; // allows unsetting
    if ((data.breakStart && !data.breakEnd) || (!data.breakStart && data.breakEnd)) {
        return false;
    }
    return true;
}, {
    message: "Both breakStart and breakEnd must be provided together",
    path: ["breakStart"],
});
exports.changeShiftStatusSchema = zod_1.z.object({
    status: zod_1.z.nativeEnum(client_1.RecordStatus, { message: "Status is required" }),
});
