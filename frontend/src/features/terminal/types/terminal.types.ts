import { z } from "zod";

export type ConnectionStatus = "online" | "offline" | "maintenance" | "heartbeat_lost";

export const terminalSchema = z.object({
  id: z.string().optional(),
  terminalId: z.string().min(2, "Terminal ID is required"),
  name: z.string().min(3, "Name is required"),
  machine: z.string().min(2, "Machine mapping is required"),
  department: z.string().min(2, "Department is required"),
  ipAddress: z.string().regex(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/, "Invalid IP address"),
  macAddress: z.string().regex(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, "Invalid MAC address"),
  firmwareVersion: z.string().min(1, "Firmware version is required"),
  status: z.enum(["online", "offline", "maintenance", "heartbeat_lost"]),
  lastHeartbeat: z.string().optional(),
});

export type Terminal = z.infer<typeof terminalSchema>;

export interface TerminalKPIs {
  totalTerminals: number;
  online: number;
  offline: number;
  maintenance: number;
  heartbeatLost: number;
  firmwareUpdates: number;
}
