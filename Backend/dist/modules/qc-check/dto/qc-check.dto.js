"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateQCCheckSchema = void 0;
const zod_1 = require("zod");
exports.CreateQCCheckSchema = zod_1.z.object({
    bundleId: zod_1.z.number().int().positive(),
    tagId: zod_1.z.number().int().positive().optional(),
    qcPersonId: zod_1.z.number().int().positive(),
    qcTier: zod_1.z.enum(['LINE_QC', 'FINAL_QC']),
    operationId: zod_1.z.number().int().positive().optional(),
    workerId: zod_1.z.number().int().positive().optional(),
    status: zod_1.z.enum(['PASS', 'FAIL', 'REWORK']),
    defectNotes: zod_1.z.string().optional(),
    passQuantity: zod_1.z.number().int().nonnegative().optional().default(0),
    rejectQuantity: zod_1.z.number().int().nonnegative().optional().default(0),
    reworkQuantity: zod_1.z.number().int().nonnegative().optional().default(0),
});
