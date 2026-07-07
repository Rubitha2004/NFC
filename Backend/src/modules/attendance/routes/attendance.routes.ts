import { Router } from "express";
import { AttendanceController } from "../controller/attendance.controller";

const router = Router();
const attendanceController = new AttendanceController();

router.post("/tap", attendanceController.tapAttendance);
router.get("/", attendanceController.getAllAttendances);
router.get("/today", attendanceController.getTodayAttendances);
router.get("/worker/:id", attendanceController.getWorkerAttendances);

export default router;
