import apiClient from '@/services/axios';
import type {
  QCAPI,
  ApiResponse,
  QCsResponse,
  CreateQCRequest,
  UpdateQCRequest,
  QCQueryParams,
  QCInspection,
  QCResult
} from '../types/qc.types';

const BASE = '/qcs';

export const mapQCAPIToUI = (apiData: QCAPI): QCInspection => {
  const statusMap: Record<string, QCResult> = {
    PENDING: "Pending",
    PASSED: "Pass",
    FAILED: "Fail",
    PARTIAL: "Rework"
  };

  return {
    id: apiData.id.toString(),
    inspectionId: `QC-${apiData.id.toString().padStart(4, '0')}`,
    bundleNumber: apiData.bundle?.bundleNumber || "Unknown",
    productionOrder: `PO-${apiData.bundle?.productionOrderId || "Unknown"}`,
    worker: apiData.transaction?.fromWorker 
      ? `${apiData.transaction.fromWorker.firstName} ${apiData.transaction.fromWorker.lastName}` 
      : "Unknown",
    machine: apiData.transaction?.fromMachine?.name || "Unknown",
    department: "Sewing", // Usually derived from machine or operation
    operation: apiData.transaction?.fromOperation?.name || "Unknown",
    inspector: apiData.inspector 
      ? `${apiData.inspector.firstName} ${apiData.inspector.lastName}` 
      : "System",
    result: statusMap[apiData.status] || "Pending",
    defectCount: apiData.defectiveQuantity,
    remarks: apiData.notes || undefined,
    images: [],
    date: apiData.createdAt,
    timeline: []
  };
};

export const qcService = {
  async getAll(params?: QCQueryParams): Promise<QCInspection[]> {
    const { data } = await apiClient.get<QCsResponse>(BASE, { params });
    const items = Array.isArray(data.data) ? data.data : (data as unknown as QCAPI[]);
    return items.map(mapQCAPIToUI);
  },

  async getById(id: number): Promise<QCInspection> {
    const { data } = await apiClient.get<ApiResponse<QCAPI>>(`${BASE}/${id}`);
    return mapQCAPIToUI(data.data);
  },

  async create(payload: CreateQCRequest): Promise<QCInspection> {
    const { data } = await apiClient.post<ApiResponse<QCAPI>>(BASE, payload);
    return mapQCAPIToUI(data.data);
  },

  async update(id: number, payload: UpdateQCRequest): Promise<QCInspection> {
    const { data } = await apiClient.put<ApiResponse<QCAPI>>(`${BASE}/${id}`, payload);
    return mapQCAPIToUI(data.data);
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${BASE}/${id}`);
  },
};
