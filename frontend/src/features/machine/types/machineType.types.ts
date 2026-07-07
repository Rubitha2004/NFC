import { z } from "zod";

export const machineTypeSchema = z.object({
  id: z.string().optional(),
  typeCode: z.string().min(2, "Type code is required"),
  typeName: z.string().min(3, "Type name is required"),
  manufacturer: z.string().min(2, "Manufacturer is required"),
  description: z.string().optional(),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  powerRating: z.string().min(1, "Power rating is required"),
  speed: z.string().min(1, "Speed is required"),
  supportedOperations: z.array(z.string()).min(1, "Select at least one supported operation"),
  maintenanceIntervalDays: z.number().min(1, "Interval must be at least 1 day"),
  status: z.enum(["active", "inactive", "maintenance"]),
  totalMachines: z.number().default(0),
  averageEfficiency: z.number().default(0),
});

export type MachineType = z.infer<typeof machineTypeSchema>;

export interface MachineTypeKPIs {
  totalTypes: number;
  totalMachines: number;
  activeTypes: number;
  maintenanceDue: number;
  supportedOperations: number;
  averageUtilization: number;
}
