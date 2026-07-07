import { AttendanceRepository } from "../repository/attendance.repository";
import { TapAttendanceDto, AttendanceSearchParams } from "../types/attendance.types";
import { WorkerRepository } from "../../worker/repository/worker.repository";
import { TerminalRepository } from "../../terminal/repository/terminal.repository";
import { AssignmentRepository } from "../../assignment/repository/assignment.repository";
import { AttendanceType, RecordStatus } from "@prisma/client";
import { websocketService, WEBSOCKET_EVENTS } from "../../websocket";

export class AttendanceService {
  private attendanceRepo: AttendanceRepository;
  private workerRepo: WorkerRepository;
  private terminalRepo: TerminalRepository;
  private assignmentRepo: AssignmentRepository;

  constructor() {
    this.attendanceRepo = new AttendanceRepository();
    this.workerRepo = new WorkerRepository();
    this.terminalRepo = new TerminalRepository();
    this.assignmentRepo = new AssignmentRepository();
  }

  async recordTap(data: TapAttendanceDto) {
    const { workerId, terminalId, attendanceType } = data;

    // 1. Validate Worker Exists
    const worker = await this.workerRepo.findById(workerId);
    if (!worker || worker.status !== RecordStatus.ACTIVE) {
      throw new Error("Worker not found or not active");
    }

    // 2. Validate Terminal Exists
    const terminal = await this.terminalRepo.findById(terminalId);
    if (!terminal || terminal.status !== RecordStatus.ACTIVE) {
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

    if (attendanceType === AttendanceType.IN) {
      if (currentAttendance && currentAttendance.attendanceType === AttendanceType.IN) {
        throw new Error("Worker has already clocked IN on this machine");
      }
    } else if (attendanceType === AttendanceType.OUT) {
      if (!currentAttendance || currentAttendance.attendanceType === AttendanceType.OUT) {
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
    const eventName = attendanceType === AttendanceType.IN 
      ? WEBSOCKET_EVENTS.ATTENDANCE_IN 
      : WEBSOCKET_EVENTS.ATTENDANCE_OUT;
      
    websocketService.publish(eventName, record);
    websocketService.publish(WEBSOCKET_EVENTS.ATTENDANCE_UPDATED, record);

    return record;
  }

  async getAllAttendances(params: AttendanceSearchParams) {
    return this.attendanceRepo.findAll(params);
  }

  async getTodayAttendances() {
    return this.attendanceRepo.findToday();
  }

  async getWorkerAttendances(workerId: number) {
    return this.attendanceRepo.findByWorker(workerId);
  }
}
