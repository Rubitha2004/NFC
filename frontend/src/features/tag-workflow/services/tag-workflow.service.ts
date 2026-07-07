import apiClient from '@/services/axios';
import type { Tag, StageLog, QCCheck, AccountabilityTrail } from '../types/tag-workflow.types';

// ─── Tag API ──────────────────────────────────────────────────────────────────

export const tagService = {
  async getAll(): Promise<Tag[]> {
    const { data } = await apiClient.get<{ success: boolean; data: Tag[] }>('/tags');
    return data.data;
  },
  async getAvailable(): Promise<Tag[]> {
    const { data } = await apiClient.get<{ success: boolean; data: Tag[] }>('/tags/available');
    return data.data;
  },
  async create(tagCode: string, assignedBy?: string): Promise<Tag> {
    const { data } = await apiClient.post<{ success: boolean; data: Tag }>('/tags', { tagCode, assignedBy });
    return data.data;
  },
  async assign(id: number, bundleId: number, assignedBy?: string): Promise<Tag> {
    const { data } = await apiClient.post<{ success: boolean; data: Tag }>(`/tags/${id}/assign`, { bundleId, assignedBy });
    return data.data;
  },
  async release(id: number): Promise<Tag> {
    const { data } = await apiClient.post<{ success: boolean; data: Tag }>(`/tags/${id}/release`, {});
    return data.data;
  },
};

// ─── Stage Log API ────────────────────────────────────────────────────────────

export const stageLogService = {
  async getAll(bundleId?: number): Promise<StageLog[]> {
    const { data } = await apiClient.get<{ success: boolean; data: StageLog[] }>('/stage-logs', {
      params: bundleId ? { bundleId } : undefined
    });
    return data.data;
  },
  async getByBundle(bundleId: number): Promise<StageLog[]> {
    const { data } = await apiClient.get<{ success: boolean; data: StageLog[] }>(`/stage-logs/bundle/${bundleId}`);
    return data.data;
  },
  async scanIn(payload: { bundleId: number; tagId: number; operationId: number; operatorId: number; remarks?: string }): Promise<StageLog> {
    const { data } = await apiClient.post<{ success: boolean; data: StageLog }>('/stage-logs/scan-in', payload);
    return data.data;
  },
  async scanOut(logId: number, remarks?: string): Promise<StageLog> {
    const { data } = await apiClient.post<{ success: boolean; data: StageLog }>(`/stage-logs/${logId}/scan-out`, { remarks });
    return data.data;
  },
};

// ─── QC Check API ─────────────────────────────────────────────────────────────

export const qcCheckService = {
  async getAll(filters?: { bundleId?: number; qcTier?: string; status?: string }): Promise<QCCheck[]> {
    const { data } = await apiClient.get<{ success: boolean; data: QCCheck[] }>('/qc-checks', { params: filters });
    return data.data;
  },
  async getByBundle(bundleId: number): Promise<QCCheck[]> {
    const { data } = await apiClient.get<{ success: boolean; data: QCCheck[] }>(`/qc-checks/bundle/${bundleId}`);
    return data.data;
  },
  async getAccountabilityTrail(bundleId: number): Promise<AccountabilityTrail> {
    const { data } = await apiClient.get<{ success: boolean; data: AccountabilityTrail }>(`/qc-checks/bundle/${bundleId}/trail`);
    return data.data;
  },
  async create(payload: {
    bundleId: number;
    tagId?: number;
    qcPersonId: number;
    qcTier: string;
    operationId?: number;
    workerId?: number;
    status: string;
    defectNotes?: string;
  }): Promise<QCCheck> {
    const { data } = await apiClient.post<{ success: boolean; data: QCCheck }>('/qc-checks', payload);
    return data.data;
  },
};
