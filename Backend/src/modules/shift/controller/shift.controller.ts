import { Request, Response, NextFunction } from "express";
import { ShiftService } from "../service/shift.service";
import { createShiftSchema, updateShiftSchema, changeShiftStatusSchema } from "../validation/shift.validation";

export class ShiftController {
  private service = new ShiftService();

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = createShiftSchema.parse(req.body);
      const shift = await this.service.create(data);
      
      return res.status(201).json({
        success: true,
        message: "Shift created successfully",
        data: shift,
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
        message: error.message || "Failed to create shift",
      });
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getAll(req.query);
      return res.status(200).json({
        success: true,
        message: "Shifts fetched successfully",
        data: result,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to fetch shifts",
      });
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const shift = await this.service.getById(id);
      return res.status(200).json({
        success: true,
        message: "Shift fetched successfully",
        data: shift,
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message || "Shift not found",
      });
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const data = updateShiftSchema.parse(req.body);
      const shift = await this.service.update(id, data);
      
      return res.status(200).json({
        success: true,
        message: "Shift updated successfully",
        data: shift,
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
        message: error.message || "Failed to update shift",
      });
    }
  };

  changeStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const { status } = changeShiftStatusSchema.parse(req.body);
      const shift = await this.service.changeStatus(id, status);
      
      return res.status(200).json({
        success: true,
        message: "Shift status updated successfully",
        data: shift,
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
        message: error.message || "Failed to update shift status",
      });
    }
  };
}
