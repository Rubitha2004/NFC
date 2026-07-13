"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FloorRepository = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
class FloorRepository {
    async create(data) {
        return prisma_1.default.floor.create({
            data,
            include: {
                _count: { select: { rooms: true } }
            }
        });
    }
    async findById(id) {
        return prisma_1.default.floor.findUnique({
            where: { id },
            include: {
                rooms: { include: { _count: { select: { machines: true } } } },
                _count: { select: { rooms: true } }
            }
        });
    }
    async findByFloorNumber(floorNumber) {
        return prisma_1.default.floor.findUnique({
            where: { floorNumber }
        });
    }
    async findAll() {
        return prisma_1.default.floor.findMany({
            orderBy: { floorNumber: "asc" },
            include: {
                rooms: { include: { _count: { select: { machines: true } } } },
                _count: { select: { rooms: true } }
            }
        });
    }
    async update(id, data) {
        return prisma_1.default.floor.update({
            where: { id },
            data,
            include: {
                _count: { select: { rooms: true } }
            }
        });
    }
    async delete(id) {
        return prisma_1.default.floor.delete({
            where: { id }
        });
    }
}
exports.FloorRepository = FloorRepository;
