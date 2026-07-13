"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MachineTypeRepository = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
class MachineTypeRepository {
    findAll() { return prisma_1.default.machineType.findMany({ orderBy: { name: "asc" } }); }
    findById(id) { return prisma_1.default.machineType.findUnique({ where: { id } }); }
    create(data) { return prisma_1.default.machineType.create({ data }); }
    update(id, data) { return prisma_1.default.machineType.update({ where: { id }, data }); }
    delete(id) { return prisma_1.default.machineType.update({ where: { id }, data: { status: "INACTIVE" } }); }
}
exports.MachineTypeRepository = MachineTypeRepository;
