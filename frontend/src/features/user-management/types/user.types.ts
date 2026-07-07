import { z } from "zod";

export type UserStatus = "Active" | "Inactive" | "Locked";
export type UserRole = "Administrator" | "Production Manager" | "Supervisor" | "HR" | "Quality Inspector" | "Machine Operator" | "Viewer";

export interface Permission {
  module: string;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

export interface AppUser {
  id: string;
  employeeId: string;
  fullName: string;
  username: string;
  email: string;
  phone?: string;
  department: string;
  role: UserRole;
  status: UserStatus;
  
  profilePhoto?: string;
  createdDate: string;
  lastLogin: string;
  
  permissions: Permission[];
  activityLog: { id: string; timestamp: string; action: string }[];
}

export const userSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  username: z.string().min(4, "Username must be at least 4 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  role: z.enum(["Administrator", "Production Manager", "Supervisor", "HR", "Quality Inspector", "Machine Operator", "Viewer"]),
  department: z.string().min(1, "Department is required"),
  status: z.enum(["Active", "Inactive", "Locked"]),
  remarks: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export type UserFormValues = z.infer<typeof userSchema>;
