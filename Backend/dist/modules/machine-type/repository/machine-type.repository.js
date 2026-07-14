"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MachineTypeRepository = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
class MachineTypeRepository {
    findAll() { return prisma_1.default.machineType.findMany({ orderBy: { name: "asc" }, include: { machines: true } }); }
    findById(id) { return prisma_1.default.machineType.findUnique({ where: { id }, include: { machines: true } }); }
    create(data) { return prisma_1.default.machineType.create({ data, include: { machines: true } }); }
    update(id, data) { return prisma_1.default.machineType.update({ where: { id }, data, include: { machines: true } }); }
    delete(id) { return prisma_1.default.machineType.update({ where: { id }, data: { status: "INACTIVE" }, include: { machines: true } }); }
}
exports.MachineTypeRepository = MachineTypeRepository;
