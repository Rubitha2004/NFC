export interface ReportSearchParams {
  startDate?: string;
  endDate?: string;
  departmentId?: number;
  shiftId?: number;
  workerId?: number;
  machineId?: number;
  operationId?: number;
  productionOrderId?: number;
  limit?: number;
  page?: number;
}
