"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceService = void 0;
const attendance_repository_1 = require("../repository/attendance.repository");
const worker_repository_1 = require("../../worker/repository/worker.repository");
const terminal_repository_1 = require("../../terminal/repository/terminal.repository");
const assignment_repository_1 = require("../../assignment/repository/assignment.repository");
const client_1 = require("@prisma/client");
const websocket_1 = require("../../websocket");
class AttendanceService {
    attendanceRepo;
    workerRepo;
    terminalRepo;
    assignmentRepo;
    constructor() {
        this.attendanceRepo = new attendance_repository_1.AttendanceRepository();
        this.workerRepo = new worker_repository_1.WorkerRepository();
        this.terminalRepo = new terminal_repository_1.TerminalRepository();
        this.assignmentRepo = new assignment_repository_1.AssignmentRepository();
    }
    async recordTap(data) {
        const { workerId, terminalId, attendanceType } = data;
        // 1. Validate Worker Exists
        const worker = await this.workerRepo.findById(workerId);
        if (!worker || worker.status !== client_1.RecordStatus.ACTIVE) {
            throw new Error("Worker not found or not active");
        }
        // 2. Validate Terminal Exists
        const terminal = await this.terminalRepo.findById(terminalId);
        if (!terminal || terminal.status !== client_1.RecordStatus.ACTIVE) {
            throw new Error("Terminal not found or not active");
        }
        // 3. Find Machine mapped to Terminal
        if (!terminal.machine) {
            throw new Error("Terminal is not mapped to any machine");
        }
        const machineId = terminal.machine.id;
        // 4. Validate active assignment
        const activeAssignment = await this.assignmentRepo.findActiveWorkerAssignment(workerId);
        if (!activeAssignment) {
            throw new Error("Worker has no active assignment");
        }
        if (activeAssignment.machineId !== machineId) {
            throw new Error("Worker is not assigned to this machine");
        }
        // 5. Check duplicate IN or OUT before IN
        const currentAttendance = await this.attendanceRepo.findCurrentAttendance(workerId, activeAssignment.shiftId);
        if (attendanceType === client_1.AttendanceType.IN) {
            if (currentAttendance && currentAttendance.attendanceType === client_1.AttendanceType.IN) {
                throw new Error("Worker has already clocked IN on this machine");
            }
        }
        else if (attendanceType === client_1.AttendanceType.OUT) {
            if (!currentAttendance || currentAttendance.attendanceType === client_1.AttendanceType.OUT) {
                throw new Error("Worker cannot clock OUT without clocking IN first");
            }
        }
        // 6. Create Attendance Record
        const record = await this.attendanceRepo.create({
            workerId,
            assignmentId: activeAssignment.id,
            terminalId,
            machineId,
            shiftId: activeAssignment.shiftId,
            attendanceType,
            tapTime: new Date(),
        });
        // 7. Emit WebSocket Event
        const eventName = attendanceType === client_1.AttendanceType.IN
            ? websocket_1.WEBSOCKET_EVENTS.ATTENDANCE_IN
            : websocket_1.WEBSOCKET_EVENTS.ATTENDANCE_OUT;
        websocket_1.websocketService.publish(eventName, record);
        websocket_1.websocketService.publish(websocket_1.WEBSOCKET_EVENTS.ATTENDANCE_UPDATED, record);
        return record;
    }
    async getAllAttendances(params) {
        return this.attendanceRepo.findAll(params);
    }
    async getTodayAttendances() {
        return this.attendanceRepo.findToday();
    }
    async getWorkerAttendances(workerId) {
        return this.attendanceRepo.findByWorker(workerId);
    }
}
exports.AttendanceService = AttendanceService;
