import apiClient from '@/services/axios';
import type { MachineType } from '../types/machineType.types';

export interface MachineTypeAPIResponse {
  id: number;
  code: string;
  name: string;
  description: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  machines?: any[];
}

export const mapMachineTypeAPIToUI = (data: MachineTypeAPIResponse): MachineType => ({
  id: String(data.id),
  typeCode: data.code,
  typeName: data.name,
  manufacturer: 'Unknown', // Default fallback
  description: data.description || undefined,
  capacity: 1, // Default fallback
  powerRating: 'Standard', // Default fallback
  speed: 'Normal', // Default fallback
  supportedOperations: [], // Default fallback
  maintenanceIntervalDays: 30, // Default fallback
  status: data.status === 'ACTIVE' ? 'active' : data.status === 'MAINTENANCE' ? 'maintenance' : 'inactive',
  totalMachines: data.machines ? data.machines.length : 0,
  averageEfficiency: 0, // Default fallback
});

export const machineTypeService = {
  async getMachineTypes() {
    const { data } = await apiClient.get<{ success: boolean; data: { data: MachineTypeAPIResponse[] } }>('/machine-types');
    return data.data.data.map(mapMachineTypeAPIToUI);
  },

  async getMachineType(id: string) {
    const { data } = await apiClient.get<{ success: boolean; data: MachineTypeAPIResponse }>(`/machine-types/${id}`);
    return mapMachineTypeAPIToUI(data.data);
  },

  async createMachineType(machineType: MachineType) {
    const payload = {
      code: machineType.typeCode,
      name: machineType.typeName,
      description: machineType.description,
      status: machineType.status === 'active' ? 'ACTIVE' : machineType.status === 'maintenance' ? 'MAINTENANCE' : 'INACTIVE',
    };
    const { data } = await apiClient.post<{ success: boolean; data: MachineTypeAPIResponse }>('/machine-types', payload);
    return mapMachineTypeAPIToUI(data.data);
  },

  async updateMachineType(id: string, machineType: Partial<MachineType>) {
    const payload: any = {};
    if (machineType.typeCode) payload.code = machineType.typeCode;
    if (machineType.typeName) payload.name = machineType.typeName;
    if (machineType.description) payload.description = machineType.description;
    if (machineType.status) payload.status = machineType.status === 'active' ? 'ACTIVE' : machineType.status === 'maintenance' ? 'MAINTENANCE' : 'INACTIVE';

    const { data } = await apiClient.put<{ success: boolean; data: MachineTypeAPIResponse }>(`/machine-types/${id}`, payload);
    return mapMachineTypeAPIToUI(data.data);
  },

  async deleteMachineType(id: string) {
    const { data } = await apiClient.patch<{ success: boolean; data: MachineTypeAPIResponse }>(`/machine-types/${id}/status`, {
      status: 'INACTIVE'
    });
    return mapMachineTypeAPIToUI(data.data);
  },

  async getKPIs() {
    // Return dummy KPIs for now since there's no endpoint
    return {
      totalTypes: 0,
      totalMachines: 0,
      activeTypes: 0,
      maintenanceDue: 0,
      supportedOperations: 0,
      averageUtilization: 0,
    };
  }
};
