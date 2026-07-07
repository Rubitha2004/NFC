import { z } from "zod";

export const createDepartmentSchema = z.object({
  code: z
    .string()
    .trim()
    .min(2, "Department code is required")
    .max(10, "Department code cannot exceed 10 characters"),

  name: z
    .string()
    .trim()
    .min(3, "Department name is required")
    .max(100, "Department name cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .max(255, "Description cannot exceed 255 characters")
    .optional(),

  status: z
    .enum(["ACTIVE", "INACTIVE"])
    .optional()
    .default("ACTIVE"),
});

export const updateDepartmentSchema = z.object({
  code: z
    .string()
    .trim()
    .min(2, "Department code is required")
    .max(10, "Department code cannot exceed 10 characters")
    .optional(),

  name: z
    .string()
    .trim()
    .min(3, "Department name is required")
    .max(100, "Department name cannot exceed 100 characters")
    .optional(),

  description: z
    .string()
    .trim()
    .max(255, "Description cannot exceed 255 characters")
    .optional()
    .nullable(),

  status: z
    .enum(["ACTIVE", "INACTIVE"])
    .optional(),
});

export type CreateDepartmentDTO = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentDTO = z.infer<typeof updateDepartmentSchema>;