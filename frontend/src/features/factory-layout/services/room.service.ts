import api from '@/services/axios';
import type { Room } from '../types/factory-layout.types';

export const roomService = {
  getAll: async (floorId?: number) => {
    const url = floorId ? `/rooms?floorId=${floorId}` : "/rooms";
    const { data } = await api.get<{ success: boolean; data: Room[]; total: number }>(url);
    return data.data;
  },

  getById: async (id: number) => {
    const { data } = await api.get<{ success: boolean; data: Room }>(`/rooms/${id}`);
    return data.data;
  },

  create: async (payload: Partial<Room>) => {
    const { data } = await api.post<{ success: boolean; data: Room }>("/rooms", payload);
    return data.data;
  },

  update: async (id: number, payload: Partial<Room>) => {
    const { data } = await api.put<{ success: boolean; data: Room }>(`/rooms/${id}`, payload);
    return data.data;
  },

  delete: async (id: number) => {
    const { data } = await api.delete<{ success: boolean; message: string }>(`/rooms/${id}`);
    return data.message;
  },
};
