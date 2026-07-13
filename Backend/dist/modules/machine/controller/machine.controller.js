"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MachineController = void 0;
const machine_service_1 = require("../service/machine.service");
const machine_validation_1 = require("../validation/machine.validation");
class MachineController {
    service = new machine_service_1.MachineService();
    create = async (req, res, next) => {
        try {
            const data = machine_validation_1.createMachineSchema.parse(req.body);
            const machine = await this.service.create(data);
            return res.status(201).json({
                success: true,
                message: "Machine created successfully",
                data: machine,
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
                message: error.message || "Failed to create machine",
            });
        }
    };
    getAll = async (req, res, next) => {
        try {
            const result = await this.service.getAll(req.query);
            return res.status(200).json({
                success: true,
                message: "Machines fetched successfully",
                data: result,
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message || "Failed to fetch machines",
            });
        }
    };
    getById = async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const machine = await this.service.getById(id);
            return res.status(200).json({
                success: true,
                message: "Machine fetched successfully",
                data: machine,
            });
        }
        catch (error) {
            return res.status(404).json({
                success: false,
                message: error.message || "Machine not found",
            });
        }
    };
    update = async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const data = machine_validation_1.updateMachineSchema.parse(req.body);
            const machine = await this.service.update(id, data);
            return res.status(200).json({
                success: true,
                message: "Machine updated successfully",
                data: machine,
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
                message: error.message || "Failed to update machine",
            });
        }
    };
    changeStatus = async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const { status } = machine_validation_1.changeMachineStatusSchema.parse(req.body);
            const machine = await this.service.changeStatus(id, status);
            return res.status(200).json({
                success: true,
                message: "Machine status updated successfully",
                data: machine,
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
                message: error.message || "Failed to update machine status",
            });
        }
    };
    assignRoom = async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const data = machine_validation_1.assignMachineRoomSchema.parse(req.body);
            const machine = await this.service.assignRoom(id, data);
            return res.status(200).json({
                success: true,
                message: "Machine assigned to room successfully",
                data: machine,
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message || "Failed to assign machine room",
            });
        }
    };
}
exports.MachineController = MachineController;
