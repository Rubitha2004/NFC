"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BundleRepository = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
class BundleRepository {
    async create(data) {
        return prisma_1.default.bundle.create({ data });
    }
    async findAll() {
        return prisma_1.default.bundle.findMany({
            include: {
                productionOrder: true,
                currentOperation: true,
                currentMachine: { include: { department: true, terminal: true } },
                currentWorker: { include: { department: true } },
                stageLogs: {
                    orderBy: { inTime: 'asc' }
                },
                tagAssignments: {
                    where: { status: 'ASSIGNED' }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async findById(id) {
        return prisma_1.default.bundle.findUnique({
            where: { id },
            include: {
                productionOrder: true,
                currentOperation: true,
                currentMachine: { include: { department: true, terminal: true } },
                currentWorker: { include: { department: true } },
                stageLogs: {
                    orderBy: { inTime: 'asc' }
                },
                tagAssignments: {
                    where: { status: 'ASSIGNED' }
                }
            }
        });
    }
    async findByBundleNumber(bundleNumber) {
        return prisma_1.default.bundle.findUnique({
            where: { bundleNumber }
        });
    }
    async update(id, data) {
        return prisma_1.default.bundle.update({
            where: { id },
            data
        });
    }
    async changeStatus(id, status) {
        return prisma_1.default.bundle.update({
            where: { id },
            data: { status }
        });
    }
}
exports.BundleRepository = BundleRepository;
