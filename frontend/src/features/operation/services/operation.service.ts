import apiClient from '@/services/axios';
import type { Operation } from '../types/operation.types';

export interface OperationAPIResponse {
  id: number;
  operationCode: string;
  operationName: string;
  description: string | null;
  standardMinuteValue: number;
  displayOrder: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const mapOperationAPIToUI = (data: OperationAPIResponse): Operation => ({
  id: String(data.id),
  operationCode: data.operationCode,
  name: data.operationName,
  department: 'Sewing', // Defaulting as not present in backend
  description: data.description || '',
  smv: data.standardMinuteValue,
  requiredGrade: 'Grade A', // Defaulting
  requiredSkill: 'Stitching', // Defaulting
  compatibleMachines: ['Single Needle'], // Defaulting
  status: data.status === 'ACTIVE' ? 'active' : 'inactive',
  assignedWorkers: 0,
  assignedMachines: 0,
});

export const operationService = {
  async getOperations() {
    const { data } = await apiClient.get<{ success: boolean; data: { data: OperationAPIResponse[] } }>('/operations');
    return data.data.data.map(mapOperationAPIToUI);
  },

  async getOperation(id: string) {
    const { data } = await apiClient.get<{ success: boolean; data: OperationAPIResponse }>(`/operations/${id}`);
    return mapOperationAPIToUI(data.data);
  },

  async createOperation(operation: Operation) {
    const payload = {
      operationCode: operation.operationCode,
      operationName: operation.name,
      description: operation.description,
      standardMinuteValue: operation.smv,
      status: operation.status === 'active' ? 'ACTIVE' : 'INACTIVE',
    };
    const { data } = await apiClient.post<{ success: boolean; data: OperationAPIResponse }>('/operations', payload);
    return mapOperationAPIToUI(data.data);
  },

  async updateOperation(id: string, operation: Partial<Operation>) {
    const payload: any = {};
    if (operation.operationCode) payload.operationCode = operation.operationCode;
    if (operation.name) payload.operationName = operation.name;
    if (operation.description !== undefined) payload.description = operation.description;
    if (operation.smv) payload.standardMinuteValue = operation.smv;
    if (operation.status) payload.status = operation.status === 'active' ? 'ACTIVE' : 'INACTIVE';

    const { data } = await apiClient.put<{ success: boolean; data: OperationAPIResponse }>(`/operations/${id}`, payload);
    return mapOperationAPIToUI(data.data);
  },

  async deleteOperation(id: string) {
    const { data } = await apiClient.patch<{ success: boolean; data: OperationAPIResponse }>(`/operations/${id}/status`, {
      status: 'INACTIVE'
    });
    return mapOperationAPIToUI(data.data);
  }
};
