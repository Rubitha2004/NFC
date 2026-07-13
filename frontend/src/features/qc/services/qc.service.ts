import apiClient from '@/services/axios';
import type {
  ApiResponse,
  QCsResponse,
  QCQueryParams,
  QCInspection,
  QCResult
} from '../types/qc.types';

const BASE = '/qc-checks';

export const mapQCAPIToUI = (apiData: any): QCInspection => {
  const statusMap: Record<string, QCResult> = {
    PASS: "Pass",
    FAIL: "Fail",
    REWORK: "Rework"
  };

  return {
    id: apiData.id.toString(),
    inspectionId: `QC-${apiData.id.toString().padStart(4, '0')}`,
    bundleNumber: apiData.bundle?.bundleNumber || "Unknown",
    productionOrder: `PO-${apiData.bundle?.productionOrderId || "Unknown"}`,
    worker: apiData.worker 
      ? `${apiData.worker.firstName} ${apiData.worker.lastName}` 
      : "Unknown",
    machine: "N/A", // QCCheckLog doesn't store machine directly, would need to resolve via transaction/assignment if needed
    department: "Sewing",
    operation: apiData.operation?.operationName || "Unknown",
    inspector: apiData.qcPerson 
      ? `${apiData.qcPerson.firstName} ${apiData.qcPerson.lastName}` 
      : "System",
    result: statusMap[apiData.status] || "Pending",
    defectCount: apiData.rejectQuantity || 0,
    remarks: apiData.defectNotes || undefined,
    images: [],
    date: apiData.checkedAt,
    timeline: []
  };
};

export const qcService = {
  async getAll(params?: QCQueryParams): Promise<QCInspection[]> {
    const { data } = await apiClient.get<any>(BASE, { params });
    const items = Array.isArray(data.data) ? data.data : (data as unknown as any[]);
    return items.map(mapQCAPIToUI);
  },

  async getById(id: number): Promise<QCInspection> {
    const { data } = await apiClient.get<any>(`${BASE}/${id}`);
    return mapQCAPIToUI(data.data);
  },

  async create(payload: any): Promise<QCInspection> {
    console.warn("QC create via this service is deprecated. Use QCTerminalPage.");
    return {} as QCInspection;
  },

  async update(id: number, payload: any): Promise<QCInspection> {
    console.warn("QC update via this service is deprecated.");
    return {} as QCInspection;
  },

  async delete(id: number): Promise<void> {
    console.warn("QC delete via this service is deprecated.");
  }
};
