import { z } from "zod";

export type QCResult = "Pass" | "Fail" | "Rework" | "Pending";

export interface QCInspection {
  id: string;
  inspectionId: string;
  bundleNumber: string;
  productionOrder: string;
  worker: string;
  machine: string;
  department: string;
  operation: string;
  inspector: string;
  
  result: QCResult;
  defectCount: number;
  remarks?: string;
  
  images: string[];
  date: string;

  timeline: {
    id: string;
    timestamp: string;
    action: string;
    actor: string;
  }[];
}

export const qcSchema = z.object({
  bundleNumber: z.string().min(1, "Bundle Number is required"),
  operation: z.string().min(1, "Operation is required"),
  inspector: z.string().min(1, "Inspector name is required"),
  result: z.enum(["Pass", "Fail", "Rework", "Pending"]),
  defectCount: z.number().min(0, "Defect count cannot be negative"),
  remarks: z.string().optional(),
}).refine(data => {
  if ((data.result === "Fail" || data.result === "Rework") && data.defectCount === 0) {
    return false;
  }
  return true;
}, {
  message: "Failed or Reworked inspections must have at least 1 defect",
  path: ["defectCount"]
});

export type QCFormValues = z.infer<typeof qcSchema>;

// --- API Types ---

export interface QCAPI {
  id: number;
  bundleId: number;
  transactionId: number;
  inspectorId: number | null;
  inspectedQuantity: number;
  passedQuantity: number;
  defectiveQuantity: number;
  reworkQuantity: number;
  defectDetails: any; // JSON
  status: string; // PENDING | PASSED | FAILED | PARTIAL
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  bundle?: { id: number; bundleNumber: string; productionOrderId: number };
  inspector?: { id: number; firstName: string; lastName: string };
  transaction?: { 
    id: number;
    fromMachine?: { id: number; name: string };
    fromWorker?: { id: number; firstName: string; lastName: string };
    fromOperation?: { id: number; name: string };
  };
}

export interface QCQueryParams {
  search?: string;
  status?: string;
  bundleId?: number;
  page?: number;
  limit?: number;
}

export interface QCsResponse {
  success: boolean;
  data: QCAPI[];
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface CreateQCRequest {
  bundleId: number;
  transactionId: number;
  inspectorId?: number;
  inspectedQuantity: number;
  passedQuantity: number;
  defectiveQuantity: number;
  reworkQuantity: number;
  defectDetails?: any;
  status?: string;
  notes?: string;
}

export type UpdateQCRequest = Partial<CreateQCRequest>;
