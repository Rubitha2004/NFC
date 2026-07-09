import api from '@/services/axios';
import type { Floor } from '../types/factory-layout.types';

export const floorService = {
  getAll: async () => {
    const { data } = await api.get<{ success: boolean; data: Floor[]; total: number }>("/floors");
    return data.data;
  },

  getById: async (id: number) => {
    const { data } = await api.get<{ success: boolean; data: Floor }>(`/floors/${id}`);
    return data.data;
  },

  create: async (payload: Partial<Floor>) => {
    const { data } = await api.post<{ success: boolean; data: Floor }>("/floors", payload);
    return data.data;
  },

  update: async (id: number, payload: Partial<Floor>) => {
    const { data } = await api.put<{ success: boolean; data: Floor }>(`/floors/${id}`, payload);
    return data.data;
  },

  delete: async (id: number) => {
    const { data } = await api.delete<{ success: boolean; message: string }>(`/floors/${id}`);
    return data.message;
  },
};
