import apiClient from '@/services/axios';
import type { WorkerData, WorkerFormData, WorkerStatus } from '../types/worker.types';

// Interface for Backend Response
export interface WorkerAPIResponse {
  id: number;
  employeeCode: string;
  nfcCardId: string;
  firstName: string;
  lastName: string;
  departmentId: number;
  gradeId: number;
  status: string;
  department: {
    id: number;
    name: string;
    code: string;
  };
  grade: {
    id: number;
    code: string;
    name: string;
  };
  skills?: Array<{
    skill: {
      name: string;
    }
  }>;
  assignments?: Array<{
    machine?: { machineCode: string };
    operation?: { operationName: string };
    machineId?: number;
    operationId?: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

// Temporary static mappings to map Frontend string selections to Backend IDs 
// In a full production app, these would be dynamic lookups
const DEPT_MAP: Record<string, number> = {
  'Stitching': 1,
  'Cutting': 2,
  'Finishing': 3,
  'Packing': 4,
};

const GRADE_MAP: Record<string, number> = {
  'A': 1,
  'B': 2,
  'C': 3,
  'D': 4,
};

// Map backend API data to frontend UI format
export const mapWorkerAPIToUI = (data: WorkerAPIResponse): WorkerData => {
  return {
    id: data.employeeCode, // UI uses employeeCode as ID in many places
    employeeCode: data.employeeCode,
    firstName: data.firstName,
    lastName: data.lastName,
    department: data.department?.name || 'Unknown',
    grade: (data.grade?.code || 'C') as any,
    primarySkill: data.skills && data.skills.length > 0 ? data.skills[0].skill.name : 'Unassigned',
    secondarySkills: data.skills && data.skills.length > 1 ? data.skills.slice(1).map(s => s.skill.name) : [],
    shift: 'Morning', // Mocked shift as it's not strictly on Worker model directly
    nfcCardId: data.nfcCardId || '',
    currentAssignment: data.assignments && data.assignments.length > 0 ? {
      machineId: data.assignments[0].machine?.machineCode || `MAC-${(data.assignments[0] as any).machineId}`,
      operation: (data as any).productionTasks?.[0]?.operation?.name || (data.assignments[0] as any).operation?.operationName || 'Assigned Operation',
      project: (data as any).productionTasks?.[0]?.productionOrder?.styleName || 'N/A',
      productionOrder: (data as any).productionTasks?.[0]?.productionOrder?.orderNumber || 'N/A',
      department: (data as any).productionTasks?.[0]?.department?.name || data.department?.name || 'General',
      status: 'active' as const,
      assignedAt: new Date((data.assignments[0] as any).assignedAt || new Date())
    } : undefined,
    joiningDate: new Date(data.createdAt),
    status: (data.status?.toLowerCase() || 'active') as WorkerStatus,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
    
    // Mock records for details drawer
    attendanceRecords: [],
    productionHistory: [],
    timeline: []
  };
};

export const workerService = {
  async getWorkers() {
    const { data } = await apiClient.get<{ success: boolean; data: { data: WorkerAPIResponse[] } }>('/workers?limit=2000');
    return data.data.data.map(mapWorkerAPIToUI);
  },

  async getWorker(id: string) {
    // Note: the backend getById expects a numeric ID. 
    // Since UI uses employeeCode as ID mostly, we'll try to fetch all and find by code if id is string, 
    // or if we have the actual db ID we can use it.
    // Let's use the list endpoint with a filter to be safe if `id` is employeeCode
    const { data } = await apiClient.get<{ success: boolean; data: { data: WorkerAPIResponse[] } }>(`/workers?employeeCode=${id}`);
    const worker = data.data.data.find(w => w.employeeCode === id);
    if (!worker) throw new Error("Worker not found");
    return mapWorkerAPIToUI(worker);
  },

  async createWorker(worker: WorkerFormData) {
    const payload = {
      employeeCode: worker.employeeCode,
      firstName: worker.firstName,
      lastName: worker.lastName,
      nfcCardId: worker.nfcCardId || worker.employeeCode,
      departmentId: DEPT_MAP[worker.department] || 1,
      gradeId: GRADE_MAP[worker.grade] || 3,
      status: (worker.status?.toUpperCase() || 'ACTIVE') as any,
      // optional fields that backend might accept
      email: worker.email || `${worker.firstName.toLowerCase()}.${worker.lastName.toLowerCase()}@factory.com`,
      phone: worker.phone || "0000000000",
      joiningDate: worker.joiningDate.toISOString(),
    };
    
    const { data } = await apiClient.post<{ success: boolean; data: WorkerAPIResponse }>('/workers', payload);
    // Return mapped data (but we might need to fetch again to get relations like dept name, 
    // assuming backend returns them in create response or we handle it via refetch)
    return data.data;
  },

  async updateWorker(id: string, worker: Partial<WorkerFormData>) {
    // Need to find numeric ID first
    const { data: searchData } = await apiClient.get<{ success: boolean; data: { data: WorkerAPIResponse[] } }>(`/workers?employeeCode=${id}`);
    const target = searchData.data.data.find(w => w.employeeCode === id);
    if (!target) throw new Error("Worker not found");

    const payload: any = {};
    if (worker.firstName) payload.firstName = worker.firstName;
    if (worker.lastName) payload.lastName = worker.lastName;
    if (worker.department) payload.departmentId = DEPT_MAP[worker.department] || target.departmentId;
    if (worker.grade) payload.gradeId = GRADE_MAP[worker.grade] || target.gradeId;
    if (worker.nfcCardId) payload.nfcCardId = worker.nfcCardId;

    const { data } = await apiClient.put<{ success: boolean; data: WorkerAPIResponse }>(`/workers/${target.id}`, payload);
    return data.data;
  },

  async deleteWorker(id: string) {
    // Soft delete / change status to terminated/inactive
    const { data: searchData } = await apiClient.get<{ success: boolean; data: { data: WorkerAPIResponse[] } }>(`/workers?employeeCode=${id}`);
    const target = searchData.data.data.find(w => w.employeeCode === id);
    if (!target) throw new Error("Worker not found");

    const { data } = await apiClient.patch<{ success: boolean; data: WorkerAPIResponse }>(`/workers/${target.id}/status`, {
      status: 'INACTIVE'
    });
    return data.data;
  }
};
