"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBundleTransactionSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.createBundleTransactionSchema = zod_1.z.object({
    bundleId: zod_1.z.number().int().positive(),
    productionOrderId: zod_1.z.number().int().positive(),
    fromOperationId: zod_1.z.number().int().positive().optional().nullable(),
    toOperationId: zod_1.z.number().int().positive().optional().nullable(),
    fromWorkerId: zod_1.z.number().int().positive().optional().nullable(),
    toWorkerId: zod_1.z.number().int().positive().optional().nullable(),
    fromMachineId: zod_1.z.number().int().positive().optional().nullable(),
    toMachineId: zod_1.z.number().int().positive().optional().nullable(),
    quantity: zod_1.z.number().int().positive(),
    transactionType: zod_1.z.nativeEnum(client_1.TransactionType),
    remarks: zod_1.z.string().optional().nullable()
});
