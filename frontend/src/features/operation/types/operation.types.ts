import { z } from "zod";

export const operationSchema = z.object({
  id: z.string().optional(),
  operationCode: z.string().min(2, "Code is required"),
  name: z.string().min(3, "Name is required"),
  department: z.string().optional().default(''),
  departmentId: z.number().optional(),
  description: z.string().optional(),
  smv: z.number().min(0.1, "SMV must be greater than 0"),
  requiredGrade: z.string().optional().default(''),
  requiredSkill: z.string().optional().default(''),
  requiredSkillId: z.number().optional(),
  compatibleMachines: z.array(z.string()).optional().default([]),
  status: z.enum(["active", "inactive"]),
  assignedWorkers: z.number().default(0),
  assignedMachines: z.number().default(0),
});

export type Operation = z.infer<typeof operationSchema>;

export interface OperationKPIs {
  totalOperations: number;
  activeOperations: number;
  averageSMV: number;
  assignedWorkers: number;
  assignedMachines: number;
  dailyProduction: number;
}
