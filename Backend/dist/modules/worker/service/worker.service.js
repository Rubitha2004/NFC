"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerService = void 0;
const worker_repository_1 = require("../repository/worker.repository");
class WorkerService {
    repository;
    constructor(repository) {
        this.repository = repository || new worker_repository_1.WorkerRepository();
    }
    async create(data) {
        // 1. Check duplicate Employee Code
        const existingCode = await this.repository.findByEmployeeCode(data.employeeCode);
        if (existingCode) {
            throw new Error("Employee code already exists");
        }
        // 2. Check duplicate NFC Card
        const existingNfc = await this.repository.findByNFCCard(data.nfcCardId);
        if (existingNfc) {
            throw new Error("NFC Card ID already exists");
        }
        // 3. Department exists
        const department = await this.repository.checkDepartmentExists(data.departmentId);
        if (!department) {
            throw new Error("Department does not exist");
        }
        // 4. Grade exists
        const grade = await this.repository.checkGradeExists(data.gradeId);
        if (!grade) {
            throw new Error("Grade does not exist");
        }
        return await this.repository.create(data);
    }
    async getAll(params) {
        return await this.repository.findAll(params);
    }
    async getById(id) {
        const worker = await this.repository.findById(id);
        if (!worker) {
            throw new Error("Worker not found");
        }
        return worker;
    }
    async update(id, data) {
        const worker = await this.repository.findById(id);
        if (!worker) {
            throw new Error("Worker not found");
        }
        // Cannot change Employee Code if already assigned
        if (data.employeeCode && data.employeeCode !== worker.employeeCode) {
            throw new Error("Cannot change Employee Code once assigned");
        }
        // Check NFC Card uniqueness if changing
        if (data.nfcCardId && data.nfcCardId !== worker.nfcCardId) {
            const existingNfc = await this.repository.findByNFCCard(data.nfcCardId);
            if (existingNfc) {
                throw new Error("NFC Card ID already exists");
            }
        }
        // Department exists if changing
        if (data.departmentId && data.departmentId !== worker.departmentId) {
            const department = await this.repository.checkDepartmentExists(data.departmentId);
            if (!department) {
                throw new Error("Department does not exist");
            }
        }
        // Grade exists if changing
        if (data.gradeId && data.gradeId !== worker.gradeId) {
            const grade = await this.repository.checkGradeExists(data.gradeId);
            if (!grade) {
                throw new Error("Grade does not exist");
            }
        }
        return await this.repository.update(id, data);
    }
    async changeStatus(id, status) {
        const worker = await this.repository.findById(id);
        if (!worker) {
            throw new Error("Worker not found");
        }
        return await this.repository.changeStatus(id, status);
    }
}
exports.WorkerService = WorkerService;
