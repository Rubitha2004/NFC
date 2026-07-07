// ─── Tag Pool ─────────────────────────────────────────────────────────────────

export type TagStatus = 'AVAILABLE' | 'ASSIGNED';

export interface Tag {
  id: number;
  tagCode: string;
  status: TagStatus;
  bundleId: number | null;
  assignedAt: string | null;
  releasedAt: string | null;
  assignedBy: string | null;
  bundle?: {
    id: number;
    bundleNumber: string;
    productionOrder: { orderNumber: string; buyerName: string };
  } | null;
}

// ─── Stage Log ────────────────────────────────────────────────────────────────

export interface StageLog {
  id: number;
  bundleId: number;
  tagId: number;
  operationId: number;
  operatorId: number;
  inTime: string;
  outTime: string | null;
  remarks: string | null;
  bundle: { bundleNumber: string };
  tag: { tagCode: string };
  operation: { operationName: string; operationCode: string };
  operator: { firstName: string; lastName: string; employeeCode: string };
}

// ─── QC Check ─────────────────────────────────────────────────────────────────

export type QCTier = 'LINE_QC' | 'FINAL_QC';
export type QCCheckStatus = 'PASS' | 'FAIL' | 'REWORK';

export interface QCCheck {
  id: number;
  bundleId: number;
  tagId: number | null;
  qcPersonId: number;
  qcTier: QCTier;
  operationId: number | null;
  workerId: number | null;
  status: QCCheckStatus;
  defectNotes: string | null;
  checkedAt: string;
  bundle: { bundleNumber: string; productionOrder: { orderNumber: string } };
  qcPerson: { firstName: string; lastName: string; employeeCode: string };
  operation?: { operationName: string } | null;
  worker?: { firstName: string; lastName: string; employeeCode: string } | null;
  tag?: { tagCode: string } | null;
}

export interface AccountabilityTrail {
  checks: QCCheck[];
  failureTrails: Array<{
    tier2Failure: QCCheck;
    missedByTier1: QCCheck | null;
  }>;
}
