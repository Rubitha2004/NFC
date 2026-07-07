import apiClient from '@/services/axios';
import type { AssignmentData, AssignmentStatus, AssignmentPriority } from '../types/assignment.types';

export interface AssignmentAPIResponse {
  id: number;
  workerId: number;
  machineId: number;
  operationId: number;
  shiftId: number;
  assignedBy: string | null;
  assignedAt: string;
  releasedAt: string | null;
  status: string;
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
  worker?: any;
  machine?: any;
  operation?: any;
  shift?: any;
}

export const mapAssignmentAPIToUI = (data: AssignmentAPIResponse): AssignmentData => {
  return {
    id: String(data.id),
    assignmentId: `ASN-${data.id}`,
    department: 'Sewing', // Mocked, missing from API
    operation: data.operation?.operationName || 'Unknown Operation',
    shift: data.shift?.shiftName || 'Unknown Shift',
    status: data.status.toLowerCase() as AssignmentStatus,
    priority: 'medium' as AssignmentPriority, // Mocked
    worker: {
      id: String(data.workerId),
      name: data.worker ? `${data.worker.firstName} ${data.worker.lastName}` : 'Unknown',
      employeeCode: data.worker?.employeeCode || 'UNK',
      grade: data.worker?.grade || 'N/A',
      skill: data.worker?.skillLevel || 'N/A'
    },
    machine: {
      id: String(data.machineId),
      machineId: data.machine?.machineCode || 'UNK',
      name: data.machine?.name || 'Unknown',
      status: (data.machine?.status?.toLowerCase() || 'offline') as any
    },
    production: { // Mocked, missing from API
      orderId: 'PO-10001',
      bundleId: 'BND-10001',
      style: 'Basic T-Shirt',
      targetQuantity: 500,
      completedQuantity: 0
    },
    assignedTime: data.assignedAt,
    expectedCompletion: new Date(new Date(data.assignedAt).getTime() + 8 * 60 * 60 * 1000).toISOString(), // Mocked +8 hrs
    supervisor: data.assignedBy || 'System',
    remarks: data.remarks || undefined,
    timeline: [
      {
        id: `tl-${data.id}-1`,
        timestamp: data.assignedAt,
        title: 'Assignment Created',
        description: `Assigned to ${data.worker ? data.worker.firstName : 'Worker'}`,
        status: 'completed'
      }
    ]
  };
};

export const assignmentService = {
  async getAssignments(params?: any) {
    const { data } = await apiClient.get<{ success: boolean; data: { data: AssignmentAPIResponse[], total: number } }>('/assignments', { params });
    return {
      data: data.data.data.map(mapAssignmentAPIToUI),
      total: data.data.total
    };
  },

  async getAssignmentById(id: string) {
    const { data } = await apiClient.get<{ success: boolean; data: AssignmentAPIResponse }>(`/assignments/${id}`);
    return mapAssignmentAPIToUI(data.data);
  },

  async createAssignment(payload: any) {
    const { data } = await apiClient.post<{ success: boolean; data: AssignmentAPIResponse }>('/assignments', payload);
    return mapAssignmentAPIToUI(data.data);
  },

  async updateAssignment(id: string, payload: any) {
    const { data } = await apiClient.put<{ success: boolean; data: AssignmentAPIResponse }>(`/assignments/${id}`, payload);
    return mapAssignmentAPIToUI(data.data);
  },

  async releaseAssignment(id: string) {
    const { data } = await apiClient.patch<{ success: boolean; data: AssignmentAPIResponse }>(`/assignments/${id}/release`);
    return mapAssignmentAPIToUI(data.data);
  }
};
