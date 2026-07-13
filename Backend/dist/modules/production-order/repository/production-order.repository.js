"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionOrderRepository = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
class ProductionOrderRepository {
    async create(data) {
        return prisma_1.default.productionOrder.create({ data });
    }
    async findAll() {
        return prisma_1.default.productionOrder.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                productionTasks: {
                    select: {
                        workerId: true,
                        machineId: true,
                        worker: { select: { firstName: true, lastName: true, employeeCode: true } },
                        machine: { select: { machineName: true, machineCode: true } }
                    }
                },
                _count: {
                    select: { bundles: true }
                }
            }
        });
    }
    async findById(id) {
        return prisma_1.default.productionOrder.findUnique({
            where: { id },
            include: {
                bundles: true,
                productionTasks: {
                    select: {
                        workerId: true,
                        machineId: true,
                        worker: { select: { firstName: true, lastName: true, employeeCode: true } },
                        machine: { select: { machineName: true, machineCode: true } }
                    }
                },
                _count: {
                    select: { bundles: true }
                }
            }
        });
    }
    async findByOrderNumber(orderNumber) {
        return prisma_1.default.productionOrder.findUnique({
            where: { orderNumber }
        });
    }
    async update(id, data) {
        return prisma_1.default.productionOrder.update({
            where: { id },
            data
        });
    }
    async changeStatus(id, status) {
        return prisma_1.default.productionOrder.update({
            where: { id },
            data: { status }
        });
    }
}
exports.ProductionOrderRepository = ProductionOrderRepository;
