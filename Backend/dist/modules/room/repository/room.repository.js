"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomRepository = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
class RoomRepository {
    async create(data) {
        return prisma_1.default.room.create({
            data,
            include: {
                floor: true,
                _count: { select: { machines: true } }
            }
        });
    }
    async findById(id) {
        return prisma_1.default.room.findUnique({
            where: { id },
            include: {
                floor: true,
                machines: true,
                _count: { select: { machines: true } }
            }
        });
    }
    async findByNameAndFloor(name, floorId) {
        return prisma_1.default.room.findFirst({
            where: { name, floorId }
        });
    }
    async findAll(floorId) {
        return prisma_1.default.room.findMany({
            where: floorId ? { floorId } : undefined,
            orderBy: { name: "asc" },
            include: {
                floor: true,
                _count: { select: { machines: true } }
            }
        });
    }
    async update(id, data) {
        return prisma_1.default.room.update({
            where: { id },
            data,
            include: {
                floor: true,
                _count: { select: { machines: true } }
            }
        });
    }
    async delete(id) {
        return prisma_1.default.room.delete({
            where: { id }
        });
    }
}
exports.RoomRepository = RoomRepository;
