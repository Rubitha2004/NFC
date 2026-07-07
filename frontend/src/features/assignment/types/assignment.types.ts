import { z } from "zod";

// ─── Shared Enums ─────────────────────────────────────────────────────────────

export type AssignmentStatus = "active" | "pending" | "completed" | "cancelled";
export type AssignmentPriority = "high" | "medium" | "low";

// ─── Sub-Types ────────────────────────────────────────────────────────────────

export interface AssignmentWorker {
  id: string;
  name: string;
  employeeCode: string;
  grade: string;
  skill: string;
  photoUrl?: string;
}

export interface AssignmentMachine {
  id: string;
  machineId: string;
  name: string;
  status: "running" | "idle" | "offline" | "maintenance" | "error";
  terminalName?: string;
}

export interface AssignmentProduction {
  orderId: string;
  bundleId: string;
  style: string;
  targetQuantity: number;
  completedQuantity: number;
}

export interface AssignmentTimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  status?: string;
}

// ─── Core Data Model ──────────────────────────────────────────────────────────

export interface AssignmentData {
  id: string;
  assignmentId: string;
  department: string;
  operation: string;
  shift: string;
  status: AssignmentStatus;
  priority: AssignmentPriority;
  
  worker: AssignmentWorker;
  machine: AssignmentMachine;
  production: AssignmentProduction;
  
  assignedTime: string;
  expectedCompletion: string;
  supervisor: string;
  remarks?: string;

  timeline: AssignmentTimelineEvent[];
}

// ─── Form Zod Schema ──────────────────────────────────────────────────────────

export const assignmentFormSchema = z.object({
  workerId: z.string().min(1, "Worker is required"),
  machineId: z.string().min(1, "Machine is required"),
  department: z.string().min(1, "Department is required"),
  operation: z.string().min(1, "Operation is required"),
  shift: z.string().min(1, "Shift is required"),
  productionOrderId: z.string().min(1, "Production Order is required"),
  bundleId: z.string().min(1, "Bundle is required"),
  targetQuantity: z.number().min(1, "Target must be at least 1"),
  priority: z.enum(["high", "medium", "low"]).default("medium"),
  startDate: z.date(),
  expectedEndDate: z.date(),
  supervisor: z.string().min(2, "Supervisor name is required"),
  remarks: z.string().optional(),
});

export type AssignmentFormData = z.infer<typeof assignmentFormSchema>;
