"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportQuerySchema = void 0;
const zod_1 = require("zod");
exports.reportQuerySchema = zod_1.z.object({
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    departmentId: zod_1.z.coerce.number().optional(),
    shiftId: zod_1.z.coerce.number().optional(),
    workerId: zod_1.z.coerce.number().optional(),
    machineId: zod_1.z.coerce.number().optional(),
    operationId: zod_1.z.coerce.number().optional(),
    productionOrderId: zod_1.z.coerce.number().optional(),
    limit: zod_1.z.coerce.number().optional(),
    page: zod_1.z.coerce.number().optional(),
});
