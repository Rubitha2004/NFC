import { create } from "zustand";

interface DashboardState {
  activeWorkers: number;
  activeMachines: number;
  idleMachines: number;
  offlineMachines: number;
  productionEfficiency: number;
  completedBundles: number;
  pendingQC: number;
  todayAttendance: number;
  isLiveConnected: boolean;
  setMetrics: (metrics: Partial<DashboardState>) => void;
  setLiveConnected: (connected: boolean) => void;
}

export const useDashboardStore = create<DashboardState>()((set) => ({
  activeWorkers: 0,
  activeMachines: 0,
  idleMachines: 0,
  offlineMachines: 0,
  productionEfficiency: 0,
  completedBundles: 0,
  pendingQC: 0,
  todayAttendance: 0,
  isLiveConnected: false,
  setMetrics: (metrics) => set((state) => ({ ...state, ...metrics })),
  setLiveConnected: (isLiveConnected) => set({ isLiveConnected }),
}));
