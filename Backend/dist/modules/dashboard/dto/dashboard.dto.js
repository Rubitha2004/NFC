"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardQuerySchema = void 0;
const zod_1 = require("zod");
// Currently Dashboard APIs are purely GET requests without complex query params.
// If filtering (by date, shift, department) is needed, the schemas would go here.
exports.dashboardQuerySchema = zod_1.z.object({
    departmentId: zod_1.z.string().optional(),
    shiftId: zod_1.z.string().optional(),
    date: zod_1.z.string().optional()
});
