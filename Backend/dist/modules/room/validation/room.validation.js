"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoomSchema = exports.createRoomSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.createRoomSchema = zod_1.z.object({
    floorId: zod_1.z.number().int(),
    name: zod_1.z.string().min(1),
    roomType: zod_1.z.string().optional().nullable(),
    rowsCount: zod_1.z.number().int().min(1).optional().default(3),
    machinesPerRow: zod_1.z.number().int().min(1).optional().default(35),
    status: zod_1.z.nativeEnum(client_1.RecordStatus).optional().default(client_1.RecordStatus.ACTIVE),
});
exports.updateRoomSchema = zod_1.z.object({
    floorId: zod_1.z.number().int().optional(),
    name: zod_1.z.string().min(1).optional(),
    roomType: zod_1.z.string().optional().nullable(),
    rowsCount: zod_1.z.number().int().min(1).optional(),
    machinesPerRow: zod_1.z.number().int().min(1).optional(),
    status: zod_1.z.nativeEnum(client_1.RecordStatus).optional(),
});
