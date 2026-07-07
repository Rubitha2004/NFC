import { z } from "zod";
import { RecordStatus } from "@prisma/client";

export const createWorkerSchema = z.object({
  employeeCode: z.string().min(1, "Employee Code is required"),
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  departmentId: z.number(),
  gradeId: z.number(),
  nfcCardId: z.string().min(1, "NFC Card ID is required"),
  
  gender: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  dateOfBirth: z.string().optional().transform(val => val ? new Date(val) : undefined),
  joiningDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  remarks: z.string().optional()
});

export const updateWorkerSchema = z.object({
  employeeCode: z.string().min(1).optional(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  departmentId: z.number().optional(),
  gradeId: z.number().optional(),
  nfcCardId: z.string().min(1).optional(),
  
  gender: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  dateOfBirth: z.string().optional().transform(val => val ? new Date(val) : undefined),
  joiningDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  remarks: z.string().optional()
});

export const changeWorkerStatusSchema = z.object({
  status: z.enum([RecordStatus.ACTIVE, RecordStatus.INACTIVE])
});
