"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MachineTypeService = void 0;
const machine_type_repository_1 = require("../repository/machine-type.repository");
class MachineTypeService {
    repository = new machine_type_repository_1.MachineTypeRepository();
    async getAll() {
        return this.repository.findAll();
    }
    async getById(id) {
        const record = await this.repository.findById(id);
        if (!record) {
            throw new Error("Machine type not found");
        }
        return record;
    }
    async create(data) {
        return this.repository.create(data);
    }
    async update(id, data) {
        const record = await this.repository.findById(id);
        if (!record) {
            throw new Error("Machine type not found");
        }
        return this.repository.update(id, data);
    }
    async delete(id) {
        const record = await this.repository.findById(id);
        if (!record) {
            throw new Error("Machine type not found");
        }
        return this.repository.delete(id);
    }
}
exports.MachineTypeService = MachineTypeService;
