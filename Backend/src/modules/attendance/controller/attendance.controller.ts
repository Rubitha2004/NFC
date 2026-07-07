import { Request, Response } from "express";
import { AttendanceService } from "../service/attendance.service";
import { tapAttendanceSchema } from "../validation/attendance.validation";

const attendanceService = new AttendanceService();

export class AttendanceController {
  async tapAttendance(req: Request, res: Response) {
    try {
      const validatedData = tapAttendanceSchema.parse(req.body);
      const attendance = await attendanceService.recordTap(validatedData);
      return res.status(201).json({
        success: true,
        message: "Attendance recorded successfully",
        data: attendance,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to record attendance",
      });
    }
  }

  async getAllAttendances(req: Request, res: Response) {
    try {
      const result = await attendanceService.getAllAttendances(req.query);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch attendances",
      });
    }
  }

  async getTodayAttendances(req: Request, res: Response) {
    try {
      const result = await attendanceService.getTodayAttendances();
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch today's attendances",
      });
    }
  }

  async getWorkerAttendances(req: Request, res: Response) {
    try {
      const workerId = parseInt(req.params.id as string);
      if (isNaN(workerId)) throw new Error("Invalid Worker ID");
      const result = await attendanceService.getWorkerAttendances(workerId);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to fetch worker attendances",
      });
    }
  }
}
