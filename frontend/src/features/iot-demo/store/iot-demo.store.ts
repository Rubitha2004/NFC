import { create } from 'zustand';
import type { HardwareMode, DemoActivityLog, IIoTProviderStrategy } from '../types/iot-demo.types';
import { demoHardwareStrategy } from '../strategies/DemoHardwareStrategy';

interface IotDemoStoreState {
  hardwareMode: HardwareMode;
  strategy: IIoTProviderStrategy;
  selectedOrderId: number | null;
  activeOperationId: number | null;
  logs: DemoActivityLog[];
  logFilter: string;

  setHardwareMode: (mode: HardwareMode) => void;
  setSelectedOrderId: (orderId: number | null) => void;
  setActiveOperationId: (opId: number | null) => void;
  setLogFilter: (filter: string) => void;
  addLog: (entry: DemoActivityLog) => void;
  setLogs: (logs: DemoActivityLog[]) => void;
  clearLogs: () => void;
}

export const useIotDemoStore = create<IotDemoStoreState>((set) => ({
  hardwareMode: 'SIMULATOR',
  strategy: demoHardwareStrategy,
  selectedOrderId: null,
  activeOperationId: null,
  logs: [],
  logFilter: 'all',

  setHardwareMode: (mode) =>
    set({
      hardwareMode: mode,
      strategy: demoHardwareStrategy,
    }),
  setSelectedOrderId: (orderId) => set({ selectedOrderId: orderId }),
  setActiveOperationId: (opId) => set({ activeOperationId: opId }),
  setLogFilter: (filter) => set({ logFilter: filter }),
  addLog: (entry) =>
    set((state) => ({
      logs: [entry, ...state.logs].slice(0, 100),
    })),
  setLogs: (logs) => set({ logs }),
  clearLogs: () => set({ logs: [] }),
}));
