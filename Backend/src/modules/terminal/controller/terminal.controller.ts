import { Request, Response } from "express";
import { TerminalService } from "../service/terminal.service";
import { createTerminalSchema, updateTerminalSchema, changeTerminalStatusSchema } from "../validation/terminal.validation";

const terminalService = new TerminalService();

export class TerminalController {
  async createTerminal(req: Request, res: Response) {
    try {
      const validatedData = createTerminalSchema.parse(req.body);
      const terminal = await terminalService.createTerminal(validatedData);
      return res.status(201).json({
        success: true,
        message: "Terminal created successfully",
        data: terminal,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to create terminal",
      });
    }
  }

  async getAllTerminals(req: Request, res: Response) {
    try {
      const result = await terminalService.getAllTerminals(req.query);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch terminals",
      });
    }
  }

  async getTerminalById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) throw new Error("Invalid ID");
      const terminal = await terminalService.getTerminalById(id);
      return res.status(200).json({
        success: true,
        data: terminal,
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message || "Terminal not found",
      });
    }
  }

  async updateTerminal(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) throw new Error("Invalid ID");
      const validatedData = updateTerminalSchema.parse(req.body);
      const terminal = await terminalService.updateTerminal(id, validatedData);
      return res.status(200).json({
        success: true,
        message: "Terminal updated successfully",
        data: terminal,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to update terminal",
      });
    }
  }

  async changeTerminalStatus(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) throw new Error("Invalid ID");
      const { status } = changeTerminalStatusSchema.parse(req.body);
      const terminal = await terminalService.changeTerminalStatus(id, status);
      return res.status(200).json({
        success: true,
        message: "Terminal status updated successfully",
        data: terminal,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to update terminal status",
      });
    }
  }
}
