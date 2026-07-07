import apiClient from '@/services/axios';
import type { AttendanceRecord, AttendanceStatus, NFCEvent } from '../types/attendance.types';

export interface AttendanceAPIResponse {
  id: number;
  workerId: number;
  terminalId: number;
  machineId: number;
  shiftId: number;
  attendanceType: string;
  tapTime: string;
  status: string;
  createdAt: string;
  worker?: any;
  terminal?: any;
  machine?: any;
  shift?: any;
}

// Consolidates raw tap events into daily records per worker
export const mapAttendanceAPIToUI = (taps: AttendanceAPIResponse[]): AttendanceRecord[] => {
  const recordsMap = new Map<string, AttendanceRecord>();

  taps.forEach((tap) => {
    const dateStr = new Date(tap.tapTime).toISOString().split('T')[0];
    const key = `${tap.workerId}-${dateStr}`;

    if (!recordsMap.has(key)) {
      recordsMap.set(key, {
        id: `att_${tap.workerId}_${dateStr}`,
        workerId: String(tap.workerId),
        employeeCode: tap.worker?.employeeCode || 'UNK',
        workerName: tap.worker ? `${tap.worker.firstName} ${tap.worker.lastName}` : 'Unknown',
        department: tap.worker?.department || 'Sewing', // Mocked or map properly
        shift: tap.shift?.shiftName || 'Morning',
        machineId: tap.machine?.machineCode,
        machineName: tap.machine?.name,
        date: dateStr,
        status: 'absent', // Will determine based on taps
        isLate: false,
        nfcCardId: tap.worker?.nfcCardId || 'NFC-000000',
      });
    }

    const record = recordsMap.get(key)!;

    if (tap.attendanceType === 'CHECK_IN') {
      record.checkIn = tap.tapTime;
      record.status = 'present';
      
      const checkInDate = new Date(tap.tapTime);
      if (checkInDate.getHours() > 8 || (checkInDate.getHours() === 8 && checkInDate.getMinutes() > 15)) {
        record.isLate = true;
        record.lateMinutes = Math.floor((checkInDate.getTime() - new Date(checkInDate).setHours(8, 0, 0, 0)) / 60000);
      }
    } else if (tap.attendanceType === 'CHECK_OUT') {
      record.checkOut = tap.tapTime;
    }

    if (record.checkIn && record.checkOut) {
      const ms = new Date(record.checkOut).getTime() - new Date(record.checkIn).getTime();
      record.workingHours = parseFloat((ms / 3600000).toFixed(1));
      if (record.workingHours > 9) {
        record.overtimeHours = parseFloat((record.workingHours - 9).toFixed(1));
      }
    }
  });

  return Array.from(recordsMap.values());
};

export const mapAttendanceAPIToNFCEvent = (tap: AttendanceAPIResponse): NFCEvent => {
  return {
    id: `evt_${tap.id}`,
    workerId: String(tap.workerId),
    workerName: tap.worker ? `${tap.worker.firstName} ${tap.worker.lastName}` : 'Unknown',
    department: tap.worker?.department || 'Sewing',
    timestamp: tap.tapTime,
    terminalId: tap.terminal?.ipAddress || 'TERM-01', // Fallback
    type: tap.attendanceType.toLowerCase() as any,
    machineId: tap.machine?.machineCode,
  };
};

export const attendanceService = {
  async getAttendances(params?: any) {
    const { data } = await apiClient.get<{ success: boolean; data: { data: AttendanceAPIResponse[], total: number } }>('/attendance', { params });
    const records = mapAttendanceAPIToUI(data.data.data);
    return {
      data: records,
      raw: data.data.data.map(mapAttendanceAPIToNFCEvent),
      total: records.length,
    };
  },

  async getTodayAttendances() {
    const { data } = await apiClient.get<{ success: boolean; data: AttendanceAPIResponse[] }>('/attendance/today');
    const records = mapAttendanceAPIToUI(data.data);
    return {
      data: records,
      raw: data.data.map(mapAttendanceAPIToNFCEvent),
      total: records.length,
    };
  },

  async tapAttendance(payload: { nfcCardId: string; terminalId: number; machineId?: number; attendanceType: string }) {
    const { data } = await apiClient.post<{ success: boolean; data: AttendanceAPIResponse }>('/attendance/tap', payload);
    return data.data;
  }
};
