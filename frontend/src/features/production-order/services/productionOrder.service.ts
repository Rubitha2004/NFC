import apiClient from '@/services/axios';
import type { ProductionOrder, ProductionOrderFormValues, OrderStatus } from '../types/production-order.types';

export interface ProductionOrderAPIResponse {
  id: number;
  orderNumber: string;
  buyerName: string;
  styleNumber: string;
  styleName: string;
  color: string;
  size: string;
  plannedQuantity: number;
  completedQuantity: number;
  priority: number;
  plannedStartDate: string;
  plannedEndDate: string;
  status: string;
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
}

const mapPriority = (p: number): 'low' | 'medium' | 'high' | 'urgent' => {
  if (p === 0) return 'low';
  if (p === 1) return 'medium';
  if (p === 2) return 'high';
  return 'urgent';
};

const mapPriorityToNumber = (p: string): number => {
  if (p === 'low') return 0;
  if (p === 'medium') return 1;
  if (p === 'high') return 2;
  if (p === 'urgent') return 3;
  return 0;
};

export const mapProductionOrderAPIToUI = (order: ProductionOrderAPIResponse): ProductionOrder => ({
  id: String(order.id),
  orderNumber: order.orderNumber,
  customerName: order.buyerName,
  styleNumber: order.styleNumber,
  color: order.color,
  size: order.size,
  targetQuantity: order.plannedQuantity,
  completedQuantity: order.completedQuantity,
  defectiveQuantity: 0, // Not present in schema yet
  department: order.styleName || "Sewing", // Mapping styleName as department fallback or mock
  priority: mapPriority(order.priority),
  status: order.status.toLowerCase() as OrderStatus,
  startDate: order.plannedStartDate,
  dueDate: order.plannedEndDate,
  remarks: order.remarks || undefined,
  timeline: [],
  allocations: {
    workersCount: 0,
    machinesCount: 0,
    bundlesCount: 0,
  }
});

export const productionOrderService = {
  async getProductionOrders() {
    const { data } = await apiClient.get<{ success: boolean; data: ProductionOrderAPIResponse[] }>('/production-orders');
    return data.data.map(mapProductionOrderAPIToUI);
  },

  async getProductionOrder(id: string) {
    const { data } = await apiClient.get<{ success: boolean; data: ProductionOrderAPIResponse }>(`/production-orders/${id}`);
    return mapProductionOrderAPIToUI(data.data);
  },

  async createProductionOrder(payload: ProductionOrderFormValues) {
    const endDate = new Date(payload.dueDate);
    endDate.setHours(23, 59, 59, 999);

    const apiPayload = {
      orderNumber: `PO-${Date.now()}`, // Temporary fallback
      buyerName: payload.customerName,
      styleNumber: payload.styleNumber,
      styleName: payload.department, // Storing department in styleName
      color: payload.color,
      size: payload.size,
      plannedQuantity: payload.targetQuantity,
      priority: mapPriorityToNumber(payload.priority),
      plannedStartDate: new Date().toISOString(),
      plannedEndDate: endDate.toISOString(),
      remarks: payload.remarks
    };
    const { data } = await apiClient.post<{ success: boolean; data: ProductionOrderAPIResponse }>('/production-orders', apiPayload);
    return mapProductionOrderAPIToUI(data.data);
  },

  async updateProductionOrder(id: string, payload: Partial<ProductionOrderFormValues>) {
    const apiPayload: any = {};
    if (payload.customerName) apiPayload.buyerName = payload.customerName;
    if (payload.styleNumber) apiPayload.styleNumber = payload.styleNumber;
    if (payload.department) apiPayload.styleName = payload.department;
    if (payload.color) apiPayload.color = payload.color;
    if (payload.size) apiPayload.size = payload.size;
    if (payload.targetQuantity) apiPayload.plannedQuantity = payload.targetQuantity;
    if (payload.priority) apiPayload.priority = mapPriorityToNumber(payload.priority);
    if (payload.dueDate) {
      const endDate = new Date(payload.dueDate);
      endDate.setHours(23, 59, 59, 999);
      apiPayload.plannedEndDate = endDate.toISOString();
    }
    if (payload.remarks !== undefined) apiPayload.remarks = payload.remarks;

    const { data } = await apiClient.put<{ success: boolean; data: ProductionOrderAPIResponse }>(`/production-orders/${id}`, apiPayload);
    return mapProductionOrderAPIToUI(data.data);
  },
  
  async updateStatus(id: string, status: string) {
    const { data } = await apiClient.patch<{ success: boolean; data: ProductionOrderAPIResponse }>(`/production-orders/${id}/status`, { status: status.toUpperCase() });
    return mapProductionOrderAPIToUI(data.data);
  },

  async deleteProductionOrder(id: string) {
    await apiClient.delete(`/production-orders/${id}`);
  }
};
