export type AttendanceStatus = "present" | "absent" | "late" | "on_leave" | "half_day";

export interface NFCEvent {
  id: string;
  workerId: string;
  workerName: string;
  workerPhoto?: string;
  department: string;
  timestamp: string;
  terminalId: string;
  type: "check_in" | "check_out" | "machine_login" | "machine_logout";
  machineId?: string;
}

export interface AttendanceRecord {
  id: string;
  workerId: string;
  employeeCode: string;
  workerName: string;
  workerPhoto?: string;
  department: string;
  shift: string;
  machineId?: string;
  machineName?: string;
  
  date: string;
  checkIn?: string;
  checkOut?: string;
  workingHours?: number;
  overtimeHours?: number;
  
  status: AttendanceStatus;
  isLate: boolean;
  lateMinutes?: number;
  
  nfcCardId: string;
}

export interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  late: number;
  onLeave: number;
  checkedOut: number;
  overtime: number;
  attendancePercentage: number;
}
