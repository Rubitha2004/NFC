"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MachineTypeController = void 0;
const machine_type_service_1 = require("../service/machine-type.service");
class MachineTypeController {
    service = new machine_type_service_1.MachineTypeService();
    getAll = async (req, res, next) => {
        try {
            const records = await this.service.getAll();
            res.status(200).json({ success: true, data: records });
        }
        catch (error) {
            next(error);
        }
    };
    getById = async (req, res, next) => {
        try {
            const record = await this.service.getById(Number(req.params.id));
            res.status(200).json({ success: true, data: record });
        }
        catch (error) {
            next(error);
        }
    };
    create = async (req, res, next) => {
        try {
            const record = await this.service.create(req.body);
            res.status(201).json({ success: true, data: record });
        }
        catch (error) {
            next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const record = await this.service.update(Number(req.params.id), req.body);
            res.status(200).json({ success: true, data: record });
        }
        catch (error) {
            next(error);
        }
    };
    delete = async (req, res, next) => {
        try {
            await this.service.delete(Number(req.params.id));
            res.status(200).json({ success: true, message: "Deleted successfully" });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.MachineTypeController = MachineTypeController;
