import { z } from "zod";

export const generalSettingsSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  address: z.string(),
  phone: z.string(),
  email: z.string().email(),
  website: z.string().url().optional().or(z.literal("")),
  timezone: z.string(),
  currency: z.string(),
  language: z.string(),
});
export type GeneralSettingsFormValues = z.infer<typeof generalSettingsSchema>;

export const factorySettingsSchema = z.object({
  factoryName: z.string().min(2),
  buildings: z.number().min(1),
  floors: z.number().min(1),
  rooms: z.number().min(1),
  productionLines: z.number().min(1),
  defaultShift: z.string(),
});
export type FactorySettingsFormValues = z.infer<typeof factorySettingsSchema>;

export const securitySettingsSchema = z.object({
  passwordPolicy: z.string(),
  sessionTimeout: z.number().min(5).max(1440),
  twoFactorAuth: z.boolean(),
  accountLockPolicy: z.number().min(3).max(10),
});
export type SecuritySettingsFormValues = z.infer<typeof securitySettingsSchema>;

export type SettingsTabId = 
  | "General" 
  | "Factory" 
  | "Departments" 
  | "Shifts" 
  | "Notifications" 
  | "Security" 
  | "Appearance" 
  | "Backup" 
  | "Integrations" 
  | "Audit Logs";

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}
