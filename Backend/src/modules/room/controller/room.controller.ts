import { Request, Response, NextFunction } from "express";
import { RoomService } from "../service/room.service";
import { createRoomSchema, updateRoomSchema } from "../validation/room.validation";

export class RoomController {
  private service = new RoomService();

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = createRoomSchema.parse(req.body);
      const room = await this.service.create(data);
      return res.status(201).json({ success: true, data: room });
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const floorId = req.query.floorId ? parseInt(req.query.floorId as string, 10) : undefined;
      const rooms = await this.service.getAll(floorId);
      return res.status(200).json({ success: true, data: rooms, total: rooms.length });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string, 10);
      if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid room ID" });
      const room = await this.service.getById(id);
      if (!room) return res.status(404).json({ success: false, message: "Room not found" });
      return res.status(200).json({ success: true, data: room });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string, 10);
      if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid room ID" });
      const data = updateRoomSchema.parse(req.body);
      const room = await this.service.update(id, data);
      return res.status(200).json({ success: true, data: room });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string, 10);
      if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid room ID" });
      await this.service.delete(id);
      return res.status(200).json({ success: true, message: "Room deleted" });
    } catch (error) {
      next(error);
    }
  };
}
