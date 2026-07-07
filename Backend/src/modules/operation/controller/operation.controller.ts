import { Request, Response, NextFunction } from "express";
import { OperationService } from "../service/operation.service";
import { createOperationSchema, updateOperationSchema, changeOperationStatusSchema } from "../validation/operation.validation";

export class OperationController {
  private service = new OperationService();

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = createOperationSchema.parse(req.body);
      const operation = await this.service.create(data);
      
      return res.status(201).json({
        success: true,
        message: "Operation created successfully",
        data: operation,
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
        message: error.message || "Failed to create operation",
      });
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getAll(req.query);
      return res.status(200).json({
        success: true,
        message: "Operations fetched successfully",
        data: result,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to fetch operations",
      });
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const operation = await this.service.getById(id);
      return res.status(200).json({
        success: true,
        message: "Operation fetched successfully",
        data: operation,
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message || "Operation not found",
      });
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const data = updateOperationSchema.parse(req.body);
      const operation = await this.service.update(id, data);
      
      return res.status(200).json({
        success: true,
        message: "Operation updated successfully",
        data: operation,
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
        message: error.message || "Failed to update operation",
      });
    }
  };

  changeStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const { status } = changeOperationStatusSchema.parse(req.body);
      const operation = await this.service.changeStatus(id, status);
      
      return res.status(200).json({
        success: true,
        message: "Operation status updated successfully",
        data: operation,
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
        message: error.message || "Failed to update operation status",
      });
    }
  };
}
