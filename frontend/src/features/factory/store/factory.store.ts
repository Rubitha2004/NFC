import { create } from 'zustand';
import type { MachineStatus } from '../types/factory.types';

export type ViewMode = '2d' | 'pseudo3d' | '3d';

interface FactoryStore {
  selectedMachineId: string | null;
  selectMachine: (id: string | null) => void;
  hoveredMachineId: string | null;
  hoverMachine: (id: string | null) => void;
  statusFilter: MachineStatus | 'all';
  setStatusFilter: (status: MachineStatus | 'all') => void;
  buildingFilter: string | 'all';
  setBuildingFilter: (buildingId: string | 'all') => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  /** Level 1 = 2D flat map | Level 2 = Pseudo-3D with depth & parallax */
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Drill-down State
  currentLevel: 'facility' | 'floor' | 'room' | 'row';
  selectedFacility: string | null;
  selectedFloor: string | null;
  selectedRoom: string | null;
  selectedRow: string | null;
  
  navigateLevel: (level: 'facility' | 'floor' | 'room' | 'row', selection?: { facility?: string, floor?: string, room?: string, row?: string }) => void;
}

export const useFactoryStore = create<FactoryStore>((set) => ({
  selectedMachineId: null,
  selectMachine: (id) => set({ selectedMachineId: id }),
  hoveredMachineId: null,
  hoverMachine: (id) => set({ hoveredMachineId: id }),
  statusFilter: 'all',
  setStatusFilter: (status) => set({ statusFilter: status }),
  buildingFilter: 'all',
  setBuildingFilter: (buildingId) => set({ buildingFilter: buildingId }),
  zoom: 1,
  setZoom: (zoom) => set({ zoom: Math.min(Math.max(zoom, 0.5), 2) }),
  viewMode: '2d',
  setViewMode: (mode) => set({ viewMode: mode }),

  currentLevel: 'facility',
  selectedFacility: null,
  selectedFloor: null,
  selectedRoom: null,
  selectedRow: null,

  navigateLevel: (level, selection) => set((state) => ({
    currentLevel: level,
    selectedFacility: selection?.facility !== undefined ? selection.facility : state.selectedFacility,
    selectedFloor: selection?.floor !== undefined ? selection.floor : state.selectedFloor,
    selectedRoom: selection?.room !== undefined ? selection.room : state.selectedRoom,
    selectedRow: selection?.row !== undefined ? selection.row : state.selectedRow,
  })),
}));
