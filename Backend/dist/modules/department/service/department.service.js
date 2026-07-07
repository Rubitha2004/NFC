"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentService = void 0;
const department_repository_1 = require("../repository/department.repository");
class DepartmentService {
    repository;
    constructor(repository) {
        this.repository = repository || new department_repository_1.DepartmentRepository();
    }
    /**
     * Create Department
     */
    async create(data) {
        // Check duplicate code
        const existingCode = await this.repository.findByCode(data.code);
        if (existingCode) {
            throw new Error("Department code already exists.");
        }
        // Check duplicate name
        const existingName = await this.repository.findByName(data.name);
        if (existingName) {
            throw new Error("Department name already exists.");
        }
        return await this.repository.create({
            code: data.code,
            name: data.name,
            description: data.description,
            status: data.status,
        });
    }
    /**
     * Get Department by ID
     */
    async getById(id) {
        return await this.repository.findById(id);
    }
    /**
     * Get All Departments
     */
    async getAll(options) {
        return await this.repository.findAll(options);
    }
    /**
     * Update Department
     */
    async update(id, data) {
        // Verify department exists
        const existing = await this.repository.findById(id);
        if (!existing) {
            throw new Error("Department not found.");
        }
        // Check unique code constraint (if changing code)
        if (data.code && data.code !== existing.code) {
            const codeConflict = await this.repository.findByCode(data.code);
            if (codeConflict) {
                throw new Error("Department code already exists.");
            }
        }
        // Check unique name constraint (if changing name)
        if (data.name && data.name !== existing.name) {
            const nameConflict = await this.repository.findByName(data.name);
            if (nameConflict) {
                throw new Error("Department name already exists.");
            }
        }
        return await this.repository.update(id, {
            ...(data.code !== undefined && { code: data.code }),
            ...(data.name !== undefined && { name: data.name }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.status !== undefined && { status: data.status }),
        });
    }
    /**
     * Delete Department
     */
    async delete(id) {
        const existing = await this.repository.findById(id);
        if (!existing) {
            throw new Error("Department not found.");
        }
        return await this.repository.delete(id);
    }
}
exports.DepartmentService = DepartmentService;
