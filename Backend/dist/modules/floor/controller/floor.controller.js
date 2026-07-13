"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FloorController = void 0;
const floor_service_1 = require("../service/floor.service");
const floor_validation_1 = require("../validation/floor.validation");
class FloorController {
    service = new floor_service_1.FloorService();
    create = async (req, res, next) => {
        try {
            const data = floor_validation_1.createFloorSchema.parse(req.body);
            const floor = await this.service.create(data);
            return res.status(201).json({ success: true, data: floor });
        }
        catch (error) {
            next(error);
        }
    };
    getAll = async (req, res, next) => {
        try {
            const floors = await this.service.getAll();
            return res.status(200).json({ success: true, data: floors, total: floors.length });
        }
        catch (error) {
            next(error);
        }
    };
    getById = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id))
                return res.status(400).json({ success: false, message: "Invalid floor ID" });
            const floor = await this.service.getById(id);
            if (!floor)
                return res.status(404).json({ success: false, message: "Floor not found" });
            return res.status(200).json({ success: true, data: floor });
        }
        catch (error) {
            next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id))
                return res.status(400).json({ success: false, message: "Invalid floor ID" });
            const data = floor_validation_1.updateFloorSchema.parse(req.body);
            const floor = await this.service.update(id, data);
            return res.status(200).json({ success: true, data: floor });
        }
        catch (error) {
            next(error);
        }
    };
    delete = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id))
                return res.status(400).json({ success: false, message: "Invalid floor ID" });
            await this.service.delete(id);
            return res.status(200).json({ success: true, message: "Floor deleted" });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.FloorController = FloorController;
