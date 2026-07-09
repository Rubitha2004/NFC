import { Request, Response, NextFunction } from "express";
import { FloorService } from "../service/floor.service";
import { createFloorSchema, updateFloorSchema } from "../validation/floor.validation";

export class FloorController {
  private service = new FloorService();

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = createFloorSchema.parse(req.body);
      const floor = await this.service.create(data);
      return res.status(201).json({ success: true, data: floor });
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const floors = await this.service.getAll();
      return res.status(200).json({ success: true, data: floors, total: floors.length });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string, 10);
      if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid floor ID" });
      const floor = await this.service.getById(id);
      if (!floor) return res.status(404).json({ success: false, message: "Floor not found" });
      return res.status(200).json({ success: true, data: floor });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string, 10);
      if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid floor ID" });
      const data = updateFloorSchema.parse(req.body);
      const floor = await this.service.update(id, data);
      return res.status(200).json({ success: true, data: floor });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string, 10);
      if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid floor ID" });
      await this.service.delete(id);
      return res.status(200).json({ success: true, message: "Floor deleted" });
    } catch (error) {
      next(error);
    }
  };
}
