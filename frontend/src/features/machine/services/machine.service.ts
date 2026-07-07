import apiClient from '@/services/axios';
import type { MachineData, MachineFormData, MachineStatus, MachineHealth, MachineType } from '../types/machine.types';

// Interface for Backend Response
export interface MachineAPIResponse {
  id: number;
  machineCode: string;
  machineName: string;
  departmentId: number;
  machineTypeId: number;
  terminalId: number;
  status: string;
  department?: {
    id: number;
    name: string;
  };
  machineType?: {
    id: number;
    name: string;
  };
  terminal?: {
    id: number;
    name: string;
    terminalCode: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Static Mappings for IDs
const DEPT_MAP: Record<string, number> = {
  'Stitching': 1,
  'Cutting': 2,
  'Finishing': 3,
  'Packing': 4,
};

const MACHINE_TYPE_MAP: Record<string, number> = {
  "Single Needle": 1,
  "Double Needle": 2,
  "Overlock": 3,
  "Flatlock": 4,
  "Interlock": 5,
  "Bar Tack": 6,
  "Button Hole": 7,
  "Feed Off Arm": 8,
  "Embroidery": 9,
  "Cutting": 10,
};

// Map backend API data to frontend UI format
export const mapMachineAPIToUI = (data: MachineAPIResponse): MachineData => {
  return {
    id: data.machineCode,
    machineId: data.machineCode,
    name: data.machineName,
    department: data.department?.name || 'Unknown',
    type: (data.machineType?.name || 'Single Needle') as MachineType,
    building: 'Main',
    floor: '1st',
    room: 'A',
    productionLine: 'Line 1',
    status: (data.status?.toLowerCase() === 'active' ? 'running' : 'idle') as MachineStatus,
    health: 'healthy' as MachineHealth,
    healthScore: 95,
    terminalId: data.terminal?.terminalCode || String(data.terminalId),
    terminalName: data.terminal?.name,
    runningHours: 0,
    temperature: 30,
    powerConsumption: 100,
    lastHeartbeat: new Date().toISOString(),
    todayTarget: 0,
    todayCompleted: 0,
    efficiency: 0,
    purchaseDate: data.createdAt,
    maintenanceHistory: [],
    productionHistory: [],
    timeline: []
  };
};

export const machineService = {
  async getMachines() {
    const { data } = await apiClient.get<{ success: boolean; data: { data: MachineAPIResponse[] } }>('/machines');
    return data.data.data.map(mapMachineAPIToUI);
  },

  async getMachine(id: string) {
    // Attempt to search by machineCode if ID is string
    const { data } = await apiClient.get<{ success: boolean; data: { data: MachineAPIResponse[] } }>(`/machines?machineCode=${id}`);
    const machine = data.data.data.find(m => m.machineCode === id);
    if (!machine) throw new Error("Machine not found");
    return mapMachineAPIToUI(machine);
  },

  async createMachine(machine: MachineFormData) {
    const payload = {
      machineCode: machine.machineId,
      machineName: machine.name,
      departmentId: DEPT_MAP[machine.department] || 1,
      machineTypeId: MACHINE_TYPE_MAP[machine.type] || 1,
      // Need a terminal id, mocking to 1 if not provided or valid
      terminalId: machine.terminalId ? parseInt(machine.terminalId) || 1 : 1,
      status: 'ACTIVE',
    };
    
    const { data } = await apiClient.post<{ success: boolean; data: MachineAPIResponse }>('/machines', payload);
    return data.data;
  },

  async updateMachine(id: string, machine: Partial<MachineFormData>) {
    const { data: searchData } = await apiClient.get<{ success: boolean; data: { data: MachineAPIResponse[] } }>(`/machines?machineCode=${id}`);
    const target = searchData.data.data.find(m => m.machineCode === id);
    if (!target) throw new Error("Machine not found");

    const payload: any = {};
    if (machine.name) payload.machineName = machine.name;
    if (machine.department) payload.departmentId = DEPT_MAP[machine.department] || target.departmentId;
    if (machine.type) payload.machineTypeId = MACHINE_TYPE_MAP[machine.type] || target.machineTypeId;

    const { data } = await apiClient.put<{ success: boolean; data: MachineAPIResponse }>(`/machines/${target.id}`, payload);
    return data.data;
  },

  async deleteMachine(id: string) {
    const { data: searchData } = await apiClient.get<{ success: boolean; data: { data: MachineAPIResponse[] } }>(`/machines?machineCode=${id}`);
    const target = searchData.data.data.find(m => m.machineCode === id);
    if (!target) throw new Error("Machine not found");

    const { data } = await apiClient.patch<{ success: boolean; data: MachineAPIResponse }>(`/machines/${target.id}/status`, {
      status: 'INACTIVE'
    });
    return data.data;
  }
};
