import { Request, Response, NextFunction } from "express";
import { MachineService } from "../service/machine.service";
import { createMachineSchema, updateMachineSchema, changeMachineStatusSchema, assignMachineRoomSchema } from "../validation/machine.validation";

export class MachineController {
  private service = new MachineService();

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = createMachineSchema.parse(req.body);
      const machine = await this.service.create(data);
      
      return res.status(201).json({
        success: true,
        message: "Machine created successfully",
        data: machine,
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
        message: error.message || "Failed to create machine",
      });
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getAll(req.query);
      return res.status(200).json({
        success: true,
        message: "Machines fetched successfully",
        data: result,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to fetch machines",
      });
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const machine = await this.service.getById(id);
      return res.status(200).json({
        success: true,
        message: "Machine fetched successfully",
        data: machine,
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message || "Machine not found",
      });
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const data = updateMachineSchema.parse(req.body);
      const machine = await this.service.update(id, data);
      
      return res.status(200).json({
        success: true,
        message: "Machine updated successfully",
        data: machine,
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
        message: error.message || "Failed to update machine",
      });
    }
  };

  changeStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const { status } = changeMachineStatusSchema.parse(req.body);
      const machine = await this.service.changeStatus(id, status);
      
      return res.status(200).json({
        success: true,
        message: "Machine status updated successfully",
        data: machine,
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
        message: error.message || "Failed to update machine status",
      });
    }
  };

  assignRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const data = assignMachineRoomSchema.parse(req.body);
      const machine = await this.service.assignRoom(id, data);
      
      return res.status(200).json({
        success: true,
        message: "Machine assigned to room successfully",
        data: machine,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to assign machine room",
      });
    }
  };
}
