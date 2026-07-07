"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShiftController = void 0;
const shift_service_1 = require("../service/shift.service");
const shift_validation_1 = require("../validation/shift.validation");
class ShiftController {
    service = new shift_service_1.ShiftService();
    create = async (req, res, next) => {
        try {
            const data = shift_validation_1.createShiftSchema.parse(req.body);
            const shift = await this.service.create(data);
            return res.status(201).json({
                success: true,
                message: "Shift created successfully",
                data: shift,
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
                message: error.message || "Failed to create shift",
            });
        }
    };
    getAll = async (req, res, next) => {
        try {
            const result = await this.service.getAll(req.query);
            return res.status(200).json({
                success: true,
                message: "Shifts fetched successfully",
                data: result,
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message || "Failed to fetch shifts",
            });
        }
    };
    getById = async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const shift = await this.service.getById(id);
            return res.status(200).json({
                success: true,
                message: "Shift fetched successfully",
                data: shift,
            });
        }
        catch (error) {
            return res.status(404).json({
                success: false,
                message: error.message || "Shift not found",
            });
        }
    };
    update = async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const data = shift_validation_1.updateShiftSchema.parse(req.body);
            const shift = await this.service.update(id, data);
            return res.status(200).json({
                success: true,
                message: "Shift updated successfully",
                data: shift,
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
                message: error.message || "Failed to update shift",
            });
        }
    };
    changeStatus = async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const { status } = shift_validation_1.changeShiftStatusSchema.parse(req.body);
            const shift = await this.service.changeStatus(id, status);
            return res.status(200).json({
                success: true,
                message: "Shift status updated successfully",
                data: shift,
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
                message: error.message || "Failed to update shift status",
            });
        }
    };
}
exports.ShiftController = ShiftController;
