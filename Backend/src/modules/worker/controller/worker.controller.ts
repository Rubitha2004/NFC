import { Request, Response, NextFunction } from "express";
import { WorkerService } from "../service/worker.service";
import { createWorkerSchema, updateWorkerSchema, changeWorkerStatusSchema } from "../validation/worker.validation";

export class WorkerController {
  private service = new WorkerService();

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = createWorkerSchema.parse(req.body);
      const worker = await this.service.create(data);
      
      return res.status(201).json({
        success: true,
        message: "Worker created successfully",
        data: worker,
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({
          success: false,
          message: "Validation Error",
          errors: error.errors
        });
      }
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to create worker",
      });
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getAll(req.query);
      return res.status(200).json({
        success: true,
        message: "Workers fetched successfully",
        data: result,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to fetch workers",
      });
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const worker = await this.service.getById(id);
      return res.status(200).json({
        success: true,
        message: "Worker fetched successfully",
        data: worker,
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message || "Worker not found",
      });
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const data = updateWorkerSchema.parse(req.body);
      const worker = await this.service.update(id, data);
      
      return res.status(200).json({
        success: true,
        message: "Worker updated successfully",
        data: worker,
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({
          success: false,
          message: "Validation Error",
          errors: error.errors
        });
      }
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to update worker",
      });
    }
  };

  changeStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const { status } = changeWorkerStatusSchema.parse(req.body);
      const worker = await this.service.changeStatus(id, status);
      
      return res.status(200).json({
        success: true,
        message: "Worker status updated successfully",
        data: worker,
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({
          success: false,
          message: "Validation Error",
          errors: error.errors
        });
      }
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to update worker status",
      });
    }
  };
}
