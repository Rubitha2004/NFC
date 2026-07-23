import { Request, Response } from "express";
import { ProductionOrderService } from "../service/production-order.service";
import { createProductionOrderSchema, updateProductionOrderSchema, updateProductionOrderStatusSchema } from "../validation/production-order.validation";

export class ProductionOrderController {
  private service: ProductionOrderService;

  constructor() {
    this.service = new ProductionOrderService();
  }

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = createProductionOrderSchema.parse(req.body);
      const result = await this.service.create(validatedData as any);
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
      const validatedData = updateProductionOrderSchema.parse(req.body);
      const result = await this.service.update(Number(req.params.id), validatedData as any);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  changeStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { status } = updateProductionOrderStatusSchema.parse(req.body);
      const result = await this.service.changeStatus(Number(req.params.id), status);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.service.delete(Number(req.params.id));
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };
}
