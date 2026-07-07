// Core types for the Smart Factory Digital Twin

export type MachineStatus = "running" | "idle" | "offline" | "maintenance" | "unassigned";
export type SectionName = "CUTTING" | "STITCHING" | "ASSEMBLY" | "FINISHING" | "PACKING";

export interface WorkerInfo {
  id: number;
  employeeCode: string;
  name: string;
  initials: string;
  department: string;
  grade: string;
  shift: string;
  photo?: string;
}

export interface BundleInfo {
  id: string;
  bundleNumber: string;
  productionOrder: string;
  quantity: number;
  completedQty: number;
  operation: string;
}

export interface MachineData {
  id: string;          // "M01", "M02" etc.
  numericId: number;
  section: SectionName;
  sectionIndex: number; // 0-based position within section
  status: MachineStatus;
  worker?: WorkerInfo;
  bundle?: BundleInfo;
  efficiency: number;   // 0-100
  todayOutput: number;
  targetOutput: number;
  uptime: number;       // minutes
  lastActivity: Date;
  health: number;       // 0-100 machine health score
  position: [number, number, number]; // 3D world position
}

export interface FactorySection {
  name: SectionName;
  label: string;
  machines: MachineData[];
  color: string;
  accentHex: string;
}

export interface FactoryKPIs {
  workersPresent: number;
  totalWorkers: number;
  runningMachines: number;
  totalMachines: number;
  productionToday: number;
  productionTarget: number;
  efficiency: number;
  activeBundles: number;
  alerts: number;
  activeOrders: number;
  qcPassRate: number;
}

export interface AlertItem {
  id: string;
  type: "machine_offline" | "worker_absent" | "qc_reject" | "terminal_offline" | "bundle_completed" | "production_target";
  title: string;
  description: string;
  timestamp: Date;
  priority: "high" | "medium" | "low";
  machineId?: string;
}

export interface TimelineEvent {
  id: string;
  time: string;
  type: "attendance_in" | "attendance_out" | "bundle_start" | "bundle_complete" | "qc_pass" | "qc_fail" | "machine_online" | "machine_offline";
  description: string;
  machineId?: string;
  workerName?: string;
}
