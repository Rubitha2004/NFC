"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FloorService = void 0;
const floor_repository_1 = require("../repository/floor.repository");
class FloorService {
    repository;
    constructor(repository) {
        this.repository = repository || new floor_repository_1.FloorRepository();
    }
    async create(data) {
        const existing = await this.repository.findByFloorNumber(data.floorNumber);
        if (existing) {
            throw new Error("Floor number already exists.");
        }
        return await this.repository.create({
            name: data.name,
            floorNumber: data.floorNumber,
            factoryName: data.factoryName,
            status: data.status,
        });
    }
    async getById(id) {
        return await this.repository.findById(id);
    }
    async getAll() {
        return await this.repository.findAll();
    }
    async update(id, data) {
        const existing = await this.repository.findById(id);
        if (!existing) {
            throw new Error("Floor not found.");
        }
        if (data.floorNumber !== undefined && data.floorNumber !== existing.floorNumber) {
            const conflict = await this.repository.findByFloorNumber(data.floorNumber);
            if (conflict) {
                throw new Error("Floor number already exists.");
            }
        }
        return await this.repository.update(id, data);
    }
    async delete(id) {
        const existing = await this.repository.findById(id);
        if (!existing) {
            throw new Error("Floor not found.");
        }
        if (existing.rooms.length > 0) {
            throw new Error("Cannot delete floor with rooms.");
        }
        return await this.repository.delete(id);
    }
}
exports.FloorService = FloorService;
