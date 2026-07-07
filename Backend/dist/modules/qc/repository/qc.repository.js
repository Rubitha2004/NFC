"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QCRepository = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
class QCRepository {
    async create(data) {
        return prisma_1.default.qC.create({ data });
    }
    async findAll() {
        return prisma_1.default.qC.findMany({
            include: {
                bundle: true,
                transaction: true,
                worker: true,
                machine: true,
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async findById(id) {
        return prisma_1.default.qC.findUnique({
            where: { id },
            include: {
                bundle: true,
                transaction: true,
                worker: true,
                machine: true,
            }
        });
    }
    async update(id, data) {
        return prisma_1.default.qC.update({
            where: { id },
            data
        });
    }
}
exports.QCRepository = QCRepository;
