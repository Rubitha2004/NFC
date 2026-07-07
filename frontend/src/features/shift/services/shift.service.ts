import apiClient from '@/services/axios';
import type { Shift } from '../types/shift.types';

export interface ShiftAPIResponse {
  id: number;
  shiftCode: string;
  shiftName: string;
  startTime: string;
  endTime: string;
  breakStart: string | null;
  breakEnd: string | null;
  workingHours: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const mapShiftAPIToUI = (data: ShiftAPIResponse): Shift => ({
  id: String(data.id),
  shiftCode: data.shiftCode,
  shiftName: data.shiftName,
  startTime: data.startTime,
  endTime: data.endTime,
  breakDuration: 60, // Defaulting as not present in backend
  supervisor: 'Unassigned', // Defaulting
  status: data.status === 'ACTIVE' ? 'active' : 'completed', // Map to UI status
  assignedWorkers: 0,
  assignedMachines: 0,
  productionTarget: 0,
  productionCompleted: 0,
  attendanceCount: 0,
});

export const shiftService = {
  async getShifts() {
    const { data } = await apiClient.get<{ success: boolean; data: { data: ShiftAPIResponse[] } }>('/shifts');
    return data.data.data.map(mapShiftAPIToUI);
  },

  async getShift(id: string) {
    const { data } = await apiClient.get<{ success: boolean; data: ShiftAPIResponse }>(`/shifts/${id}`);
    return mapShiftAPIToUI(data.data);
  },

  async createShift(shift: Shift) {
    const payload = {
      shiftCode: shift.shiftCode,
      shiftName: shift.shiftName,
      startTime: shift.startTime,
      endTime: shift.endTime,
      workingHours: 8, // Derived default
      status: shift.status === 'active' ? 'ACTIVE' : 'INACTIVE',
    };
    const { data } = await apiClient.post<{ success: boolean; data: ShiftAPIResponse }>('/shifts', payload);
    return mapShiftAPIToUI(data.data);
  },

  async updateShift(id: string, shift: Partial<Shift>) {
    const payload: any = {};
    if (shift.shiftCode) payload.shiftCode = shift.shiftCode;
    if (shift.shiftName) payload.shiftName = shift.shiftName;
    if (shift.startTime) payload.startTime = shift.startTime;
    if (shift.endTime) payload.endTime = shift.endTime;
    if (shift.status) payload.status = shift.status === 'active' ? 'ACTIVE' : 'INACTIVE';

    const { data } = await apiClient.put<{ success: boolean; data: ShiftAPIResponse }>(`/shifts/${id}`, payload);
    return mapShiftAPIToUI(data.data);
  },

  async deleteShift(id: string) {
    const { data } = await apiClient.patch<{ success: boolean; data: ShiftAPIResponse }>(`/shifts/${id}/status`, {
      status: 'INACTIVE'
    });
    return mapShiftAPIToUI(data.data);
  }
};
