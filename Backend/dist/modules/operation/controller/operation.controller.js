"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationController = void 0;
const operation_service_1 = require("../service/operation.service");
const operation_validation_1 = require("../validation/operation.validation");
class OperationController {
    service = new operation_service_1.OperationService();
    create = async (req, res, next) => {
        try {
            const data = operation_validation_1.createOperationSchema.parse(req.body);
            const operation = await this.service.create(data);
            return res.status(201).json({
                success: true,
                message: "Operation created successfully",
                data: operation,
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
                message: error.message || "Failed to create operation",
            });
        }
    };
    getAll = async (req, res, next) => {
        try {
            const result = await this.service.getAll(req.query);
            return res.status(200).json({
                success: true,
                message: "Operations fetched successfully",
                data: result,
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message || "Failed to fetch operations",
            });
        }
    };
    getById = async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const operation = await this.service.getById(id);
            return res.status(200).json({
                success: true,
                message: "Operation fetched successfully",
                data: operation,
            });
        }
        catch (error) {
            return res.status(404).json({
                success: false,
                message: error.message || "Operation not found",
            });
        }
    };
    update = async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const data = operation_validation_1.updateOperationSchema.parse(req.body);
            const operation = await this.service.update(id, data);
            return res.status(200).json({
                success: true,
                message: "Operation updated successfully",
                data: operation,
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
                message: error.message || "Failed to update operation",
            });
        }
    };
    changeStatus = async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const { status } = operation_validation_1.changeOperationStatusSchema.parse(req.body);
            const operation = await this.service.changeStatus(id, status);
            return res.status(200).json({
                success: true,
                message: "Operation status updated successfully",
                data: operation,
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
                message: error.message || "Failed to update operation status",
            });
        }
    };
}
exports.OperationController = OperationController;
