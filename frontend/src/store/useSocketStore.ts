import { create } from 'zustand';
import type { AlertItem, TimelineEvent } from '../features/dashboard/types/factory.types';

type ConnectionStatus = 'connected' | 'reconnecting' | 'disconnected';

  // imported from factory.types.ts

interface SocketStore {
  status: ConnectionStatus;
  alerts: AlertItem[];
  timeline: TimelineEvent[];
  
  setStatus: (status: ConnectionStatus) => void;
  addAlert: (alert: Omit<AlertItem, 'id'>) => void;
  removeAlert: (id: string) => void;
  addTimelineEvent: (event: Omit<TimelineEvent, 'id'>) => void;
}

export const useSocketStore = create<SocketStore>((set) => ({
  status: 'disconnected',
  alerts: [],
  timeline: [],

  setStatus: (status) => set({ status }),

  addAlert: (alert) => set((state) => {
    const newAlert = { ...alert, id: `alert-${Date.now()}-${Math.random()}` };
    // Keep max 50 alerts
    return { alerts: [newAlert, ...state.alerts].slice(0, 50) };
  }),

  removeAlert: (id) => set((state) => ({
    alerts: state.alerts.filter((a) => a.id !== id)
  })),

  addTimelineEvent: (event) => set((state) => {
    const newEvent = { ...event, id: `tl-${Date.now()}-${Math.random()}` };
    // Keep max 100 events
    return { timeline: [newEvent, ...state.timeline].slice(0, 100) };
  })
}));
