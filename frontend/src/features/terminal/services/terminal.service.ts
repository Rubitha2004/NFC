import apiClient from '@/services/axios';
import type { Terminal, ConnectionStatus } from '../types/terminal.types';

export interface TerminalAPIResponse {
  id: number;
  terminalCode: string;
  serialNumber: string | null;
  ipAddress: string | null;
  macAddress: string | null;
  firmwareVersion: string | null;
  terminalName: string | null;
  status: string;
  lastHeartbeat: string | null;
  createdAt: string;
  updatedAt: string;
  machine?: {
    id: number;
    machineCode: string;
    machineName: string;
    department?: {
      id: number;
      name: string;
    }
  } | null;
}

export const mapTerminalAPIToUI = (data: TerminalAPIResponse): Terminal => {
  // Determine connection status based on heartbeat and status
  let connStatus: ConnectionStatus = 'offline';
  if (data.status === 'INACTIVE') {
    connStatus = 'maintenance';
  } else if (data.status === 'ACTIVE') {
    if (data.lastHeartbeat) {
      const ms = Date.now() - new Date(data.lastHeartbeat).getTime();
      if (ms > 300000) { // 5 minutes
        connStatus = 'heartbeat_lost';
      } else {
        connStatus = 'online';
      }
    } else {
      connStatus = 'offline'; // Active but never checked in
    }
  }

  return {
    id: String(data.id),
    terminalId: data.terminalCode,
    name: data.terminalName || `Terminal ${data.terminalCode}`,
    machine: data.machine ? `${data.machine.machineName} (${data.machine.machineCode})` : 'Unassigned',
    department: data.machine?.department?.name || 'Unassigned',
    ipAddress: data.ipAddress || '0.0.0.0',
    macAddress: data.macAddress || '00:00:00:00:00:00',
    firmwareVersion: data.firmwareVersion || 'v1.0.0',
    status: connStatus,
    lastHeartbeat: data.lastHeartbeat || undefined,
  };
};

export const terminalService = {
  async getTerminals() {
    const { data } = await apiClient.get<{ success: boolean; data: { data: TerminalAPIResponse[] } }>('/terminals');
    return data.data.data.map(mapTerminalAPIToUI);
  },

  async getTerminal(id: string) {
    const { data } = await apiClient.get<{ success: boolean; data: { data: TerminalAPIResponse[] } }>(`/terminals?terminalCode=${id}`);
    const terminal = data.data.data.find(t => t.terminalCode === id);
    if (!terminal) throw new Error("Terminal not found");
    return mapTerminalAPIToUI(terminal);
  },

  async createTerminal(terminal: Terminal) {
    const payload = {
      terminalCode: terminal.terminalId,
      terminalName: terminal.name,
      ipAddress: terminal.ipAddress,
      macAddress: terminal.macAddress,
      firmwareVersion: terminal.firmwareVersion,
      status: 'ACTIVE'
    };
    
    const { data } = await apiClient.post<{ success: boolean; data: TerminalAPIResponse }>('/terminals', payload);
    return data.data;
  },

  async updateTerminal(id: string, terminal: Partial<Terminal>) {
    const { data: searchData } = await apiClient.get<{ success: boolean; data: { data: TerminalAPIResponse[] } }>(`/terminals?terminalCode=${id}`);
    const target = searchData.data.data.find(t => t.terminalCode === id);
    if (!target) throw new Error("Terminal not found");

    const payload: any = {};
    if (terminal.name) payload.terminalName = terminal.name;
    if (terminal.ipAddress) payload.ipAddress = terminal.ipAddress;
    if (terminal.macAddress) payload.macAddress = terminal.macAddress;
    if (terminal.firmwareVersion) payload.firmwareVersion = terminal.firmwareVersion;

    const { data } = await apiClient.put<{ success: boolean; data: TerminalAPIResponse }>(`/terminals/${target.id}`, payload);
    return data.data;
  },

  async deleteTerminal(id: string) {
    const { data: searchData } = await apiClient.get<{ success: boolean; data: { data: TerminalAPIResponse[] } }>(`/terminals?terminalCode=${id}`);
    const target = searchData.data.data.find(t => t.terminalCode === id);
    if (!target) throw new Error("Terminal not found");

    const { data } = await apiClient.patch<{ success: boolean; data: TerminalAPIResponse }>(`/terminals/${target.id}/status`, {
      status: 'INACTIVE'
    });
    return data.data;
  }
};
