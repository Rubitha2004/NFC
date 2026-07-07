import { Request, Response } from "express";
import { AssignmentService } from "../service/assignment.service";
import { createAssignmentSchema, updateAssignmentSchema } from "../validation/assignment.validation";

const assignmentService = new AssignmentService();

export class AssignmentController {
  async createAssignment(req: Request, res: Response) {
    try {
      const validatedData = createAssignmentSchema.parse(req.body);
      const assignment = await assignmentService.createAssignment(validatedData);
      return res.status(201).json({
        success: true,
        message: "Assignment created successfully",
        data: assignment,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to create assignment",
      });
    }
  }

  async getAllAssignments(req: Request, res: Response) {
    try {
      const result = await assignmentService.getAllAssignments(req.query);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch assignments",
      });
    }
  }

  async getAssignmentById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) throw new Error("Invalid ID");
      const assignment = await assignmentService.getAssignmentById(id);
      return res.status(200).json({
        success: true,
        data: assignment,
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message || "Assignment not found",
      });
    }
  }

  async releaseAssignment(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) throw new Error("Invalid ID");
      const assignment = await assignmentService.releaseAssignment(id);
      return res.status(200).json({
        success: true,
        message: "Assignment released successfully",
        data: assignment,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to release assignment",
      });
    }
  }

  async updateAssignment(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) throw new Error("Invalid ID");
      const validatedData = updateAssignmentSchema.parse(req.body);
      const assignment = await assignmentService.updateAssignment(id, validatedData);
      return res.status(200).json({
        success: true,
        message: "Assignment updated successfully",
        data: assignment,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to update assignment",
      });
    }
  }
}
