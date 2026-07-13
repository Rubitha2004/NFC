"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFloorSchema = exports.createFloorSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.createFloorSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    floorNumber: zod_1.z.number().int(),
    factoryName: zod_1.z.string().optional().nullable(),
    status: zod_1.z.nativeEnum(client_1.RecordStatus).optional().default(client_1.RecordStatus.ACTIVE),
});
exports.updateFloorSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    floorNumber: zod_1.z.number().int().optional(),
    factoryName: zod_1.z.string().optional().nullable(),
    status: zod_1.z.nativeEnum(client_1.RecordStatus).optional(),
});
