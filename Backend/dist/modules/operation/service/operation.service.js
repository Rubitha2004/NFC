"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationService = void 0;
const operation_repository_1 = require("../repository/operation.repository");
class OperationService {
    repository = new operation_repository_1.OperationRepository();
    async create(data) {
        const existingCode = await this.repository.findByCode(data.operationCode);
        if (existingCode) {
            throw new Error("Operation Code already exists");
        }
        const existingName = await this.repository.findByName(data.operationName);
        if (existingName) {
            throw new Error("Operation Name already exists");
        }
        return await this.repository.create(data);
    }
    async getAll(params) {
        return await this.repository.findAll(params);
    }
    async getById(id) {
        const operation = await this.repository.findById(id);
        if (!operation) {
            throw new Error("Operation not found");
        }
        return operation;
    }
    async update(id, data) {
        const operation = await this.repository.findById(id);
        if (!operation) {
            throw new Error("Operation not found");
        }
        if (data.operationName && data.operationName !== operation.operationName) {
            const existingName = await this.repository.findByName(data.operationName);
            if (existingName) {
                throw new Error("Operation Name already exists");
            }
        }
        return await this.repository.update(id, data);
    }
    async changeStatus(id, status) {
        const operation = await this.repository.findById(id);
        if (!operation) {
            throw new Error("Operation not found");
        }
        return await this.repository.changeStatus(id, status);
    }
}
exports.OperationService = OperationService;
