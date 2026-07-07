"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BundleTransactionRepository = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
class BundleTransactionRepository {
    async create(data) {
        return prisma_1.default.bundleTransaction.create({ data });
    }
    async findAll() {
        return prisma_1.default.bundleTransaction.findMany({
            include: {
                bundle: true,
                productionOrder: true,
                fromOperation: true,
                toOperation: true,
                fromWorker: true,
                toWorker: true,
                fromMachine: true,
                toMachine: true,
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async findById(id) {
        return prisma_1.default.bundleTransaction.findUnique({
            where: { id },
            include: {
                bundle: true,
                productionOrder: true,
                fromOperation: true,
                toOperation: true,
                fromWorker: true,
                toWorker: true,
                fromMachine: true,
                toMachine: true,
            }
        });
    }
    async findByBundleId(bundleId) {
        return prisma_1.default.bundleTransaction.findMany({
            where: { bundleId },
            include: {
                fromOperation: true,
                toOperation: true,
                fromWorker: true,
                toWorker: true,
                fromMachine: true,
                toMachine: true,
            },
            orderBy: { transactionTime: 'asc' }
        });
    }
}
exports.BundleTransactionRepository = BundleTransactionRepository;
