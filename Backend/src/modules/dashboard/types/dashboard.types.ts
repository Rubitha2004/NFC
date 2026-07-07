export interface WorkersSummary {
  total: number;
  present: number;
  absent: number;
  active?: number;
  idle?: number;
}

export interface MachinesSummary {
  total: number;
  running: number;
  idle: number;
  offline: number;
}

export interface ProductionSummary {
  planned: number;
  completed: number;
  pending: number;
  efficiency: number;
}

export interface BundlesSummary {
  created: number;
  inProgress: number;
  completed: number;
  qcPending: number;
}

export interface QCSummary {
  pass: number;
  reject: number;
  rework: number;
}

export interface DashboardOverviewResponse {
  workers: WorkersSummary;
  machines: MachinesSummary;
  production: ProductionSummary;
  bundles: BundlesSummary;
  qc: QCSummary;
}

export interface LiveMachineCard {
  machineCode: string;
  machineName: string;
  workerName: string | null;
  employeeCode: string | null;
  operation: string | null;
  shift: string | null;
  bundle: string | null;
  terminalStatus: "ONLINE" | "OFFLINE";
  attendance: "IN" | "OUT" | null;
  machineStatus: "RUNNING" | "IDLE" | "OFFLINE";
}
