"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceController = void 0;
const attendance_service_1 = require("../service/attendance.service");
const attendance_validation_1 = require("../validation/attendance.validation");
const attendanceService = new attendance_service_1.AttendanceService();
class AttendanceController {
    async tapAttendance(req, res) {
        try {
            const validatedData = attendance_validation_1.tapAttendanceSchema.parse(req.body);
            const attendance = await attendanceService.recordTap(validatedData);
            return res.status(201).json({
                success: true,
                message: "Attendance recorded successfully",
                data: attendance,
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message || "Failed to record attendance",
            });
        }
    }
    async getAllAttendances(req, res) {
        try {
            const result = await attendanceService.getAllAttendances(req.query);
            return res.status(200).json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch attendances",
            });
        }
    }
    async getTodayAttendances(req, res) {
        try {
            const result = await attendanceService.getTodayAttendances();
            return res.status(200).json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch today's attendances",
            });
        }
    }
    async getWorkerAttendances(req, res) {
        try {
            const workerId = parseInt(req.params.id);
            if (isNaN(workerId))
                throw new Error("Invalid Worker ID");
            const result = await attendanceService.getWorkerAttendances(workerId);
            return res.status(200).json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message || "Failed to fetch worker attendances",
            });
        }
    }
}
exports.AttendanceController = AttendanceController;
