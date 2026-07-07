"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerController = void 0;
const worker_service_1 = require("../service/worker.service");
const worker_validation_1 = require("../validation/worker.validation");
class WorkerController {
    service = new worker_service_1.WorkerService();
    create = async (req, res, next) => {
        try {
            const data = worker_validation_1.createWorkerSchema.parse(req.body);
            const worker = await this.service.create(data);
            return res.status(201).json({
                success: true,
                message: "Worker created successfully",
                data: worker,
            });
        }
        catch (error) {
            if (error.name === "ZodError") {
                return res.status(400).json({
                    success: false,
                    message: "Validation Error",
                    errors: error.errors
                });
            }
            return res.status(400).json({
                success: false,
                message: error.message || "Failed to create worker",
            });
        }
    };
    getAll = async (req, res, next) => {
        try {
            const result = await this.service.getAll(req.query);
            return res.status(200).json({
                success: true,
                message: "Workers fetched successfully",
                data: result,
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message || "Failed to fetch workers",
            });
        }
    };
    getById = async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const worker = await this.service.getById(id);
            return res.status(200).json({
                success: true,
                message: "Worker fetched successfully",
                data: worker,
            });
        }
        catch (error) {
            return res.status(404).json({
                success: false,
                message: error.message || "Worker not found",
            });
        }
    };
    update = async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const data = worker_validation_1.updateWorkerSchema.parse(req.body);
            const worker = await this.service.update(id, data);
            return res.status(200).json({
                success: true,
                message: "Worker updated successfully",
                data: worker,
            });
        }
        catch (error) {
            if (error.name === "ZodError") {
                return res.status(400).json({
                    success: false,
                    message: "Validation Error",
                    errors: error.errors
                });
            }
            return res.status(400).json({
                success: false,
                message: error.message || "Failed to update worker",
            });
        }
    };
    changeStatus = async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const { status } = worker_validation_1.changeWorkerStatusSchema.parse(req.body);
            const worker = await this.service.changeStatus(id, status);
            return res.status(200).json({
                success: true,
                message: "Worker status updated successfully",
                data: worker,
            });
        }
        catch (error) {
            if (error.name === "ZodError") {
                return res.status(400).json({
                    success: false,
                    message: "Validation Error",
                    errors: error.errors
                });
            }
            return res.status(400).json({
                success: false,
                message: error.message || "Failed to update worker status",
            });
        }
    };
}
exports.WorkerController = WorkerController;
