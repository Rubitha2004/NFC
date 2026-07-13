import { Request, Response, NextFunction } from 'express';
import { MachineTypeService } from '../service/machine-type.service';

export class MachineTypeController {
  private service = new MachineTypeService();

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const records = await this.service.getAll();
      res.status(200).json({ success: true, data: records });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const record = await this.service.getById(Number(req.params.id));
      res.status(200).json({ success: true, data: record });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const record = await this.service.create(req.body);
      res.status(201).json({ success: true, data: record });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const record = await this.service.update(Number(req.params.id), req.body);
      res.status(200).json({ success: true, data: record });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.delete(Number(req.params.id));
      res.status(200).json({ success: true, message: "Deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
}
