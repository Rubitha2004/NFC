import { Request, Response } from "express";
import { BundleService } from "../service/bundle.service";
import { createBundleSchema, updateBundleSchema, updateBundleStatusSchema } from "../validation/bundle.validation";

export class BundleController {
  private service: BundleService;

  constructor() {
    this.service = new BundleService();
  }

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = createBundleSchema.parse(req.body);
      const result = await this.service.create(validatedData);
      res.status(201).json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  findAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.service.findAll();
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  findById = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.service.findById(Number(req.params.id));
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(404).json({ success: false, error: error.message });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = updateBundleSchema.parse(req.body);
      const result = await this.service.update(Number(req.params.id), validatedData);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  changeStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { status } = updateBundleStatusSchema.parse(req.body);
      const result = await this.service.changeStatus(Number(req.params.id), status);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };
}
