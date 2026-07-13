"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagRepository = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
const client_1 = require("@prisma/client");
class TagRepository {
    async findAll() {
        return prisma_1.default.bundleTagAssignment.findMany({
            include: {
                bundle: { include: { productionOrder: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async findById(id) {
        return prisma_1.default.bundleTagAssignment.findUnique({
            where: { id },
            include: {
                bundle: { include: { productionOrder: true } },
                stageLogs: { include: { operation: true, operator: true }, orderBy: { inTime: 'asc' } },
                qcChecks: { include: { qcPerson: true, operation: true, worker: true }, orderBy: { checkedAt: 'asc' } }
            }
        });
    }
    async findByCode(tagCode) {
        return prisma_1.default.bundleTagAssignment.findUnique({
            where: { tagCode },
            include: { bundle: true }
        });
    }
    async findAvailable() {
        return prisma_1.default.bundleTagAssignment.findMany({
            where: { status: client_1.TagStatus.AVAILABLE },
            orderBy: { tagCode: 'asc' }
        });
    }
    async create(tagCode, assignedBy) {
        return prisma_1.default.bundleTagAssignment.create({
            data: { tagCode, assignedBy }
        });
    }
    async assign(id, bundleId, assignedBy) {
        return prisma_1.default.bundleTagAssignment.update({
            where: { id },
            data: {
                bundleId,
                status: client_1.TagStatus.ASSIGNED,
                assignedAt: new Date(),
                releasedAt: null,
                assignedBy: assignedBy ?? null
            }
        });
    }
    async release(id) {
        return prisma_1.default.bundleTagAssignment.update({
            where: { id },
            data: {
                bundleId: null,
                status: client_1.TagStatus.AVAILABLE,
                releasedAt: new Date()
            }
        });
    }
}
exports.TagRepository = TagRepository;
