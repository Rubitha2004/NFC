"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomController = void 0;
const room_service_1 = require("../service/room.service");
const room_validation_1 = require("../validation/room.validation");
class RoomController {
    service = new room_service_1.RoomService();
    create = async (req, res, next) => {
        try {
            const data = room_validation_1.createRoomSchema.parse(req.body);
            const room = await this.service.create(data);
            return res.status(201).json({ success: true, data: room });
        }
        catch (error) {
            next(error);
        }
    };
    getAll = async (req, res, next) => {
        try {
            const floorId = req.query.floorId ? parseInt(req.query.floorId, 10) : undefined;
            const rooms = await this.service.getAll(floorId);
            return res.status(200).json({ success: true, data: rooms, total: rooms.length });
        }
        catch (error) {
            next(error);
        }
    };
    getById = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id))
                return res.status(400).json({ success: false, message: "Invalid room ID" });
            const room = await this.service.getById(id);
            if (!room)
                return res.status(404).json({ success: false, message: "Room not found" });
            return res.status(200).json({ success: true, data: room });
        }
        catch (error) {
            next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id))
                return res.status(400).json({ success: false, message: "Invalid room ID" });
            const data = room_validation_1.updateRoomSchema.parse(req.body);
            const room = await this.service.update(id, data);
            return res.status(200).json({ success: true, data: room });
        }
        catch (error) {
            next(error);
        }
    };
    delete = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id))
                return res.status(400).json({ success: false, message: "Invalid room ID" });
            await this.service.delete(id);
            return res.status(200).json({ success: true, message: "Room deleted" });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.RoomController = RoomController;
