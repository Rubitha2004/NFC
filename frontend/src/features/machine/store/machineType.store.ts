import { create } from "zustand";
import type { MachineType, MachineTypeKPIs } from "../types/machineType.types";
import { DUMMY_MACHINE_TYPES, DUMMY_KPIS } from "./machineType.data";

interface MachineTypeState {
  machineTypes: MachineType[];
  kpis: MachineTypeKPIs;
  selectedMachineType: MachineType | null;
  isDrawerOpen: boolean;
  isFormOpen: boolean;
  
  // Actions
  setMachineTypes: (types: MachineType[]) => void;
  addMachineType: (type: MachineType) => void;
  updateMachineType: (id: string, type: Partial<MachineType>) => void;
  deleteMachineType: (id: string) => void;
  
  setSelectedMachineType: (type: MachineType | null) => void;
  setDrawerOpen: (isOpen: boolean) => void;
  setFormOpen: (isOpen: boolean) => void;
}

export const useMachineTypeStore = create<MachineTypeState>((set) => ({
  machineTypes: DUMMY_MACHINE_TYPES,
  kpis: DUMMY_KPIS,
  selectedMachineType: null,
  isDrawerOpen: false,
  isFormOpen: false,

  setMachineTypes: (types) => set({ machineTypes: types }),
  addMachineType: (type) => set((state) => ({ 
    machineTypes: [...state.machineTypes, type] 
  })),
  updateMachineType: (id, updatedType) => set((state) => ({
    machineTypes: state.machineTypes.map((t) => (t.id === id ? { ...t, ...updatedType } : t)),
    selectedMachineType: state.selectedMachineType?.id === id ? { ...state.selectedMachineType, ...updatedType } as MachineType : state.selectedMachineType
  })),
  deleteMachineType: (id) => set((state) => ({
    machineTypes: state.machineTypes.filter((t) => t.id !== id),
    selectedMachineType: state.selectedMachineType?.id === id ? null : state.selectedMachineType,
    isDrawerOpen: state.selectedMachineType?.id === id ? false : state.isDrawerOpen
  })),

  setSelectedMachineType: (type) => set({ selectedMachineType: type }),
  setDrawerOpen: (isOpen) => set({ isDrawerOpen: isOpen }),
  setFormOpen: (isOpen) => set({ isFormOpen: isOpen }),
}));
