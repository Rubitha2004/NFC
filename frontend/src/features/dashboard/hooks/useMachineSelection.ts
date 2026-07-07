import { create } from "zustand";
import type { MachineData } from "../types/factory.types";

interface MachineSelectionState {
  selectedMachine: MachineData | null;
  hoveredMachineId: string | null;
  searchQuery: string;
  searchTargetId: string | null;
  selectMachine: (machine: MachineData | null) => void;
  setHovered: (id: string | null) => void;
  setSearch: (query: string, targetId?: string | null) => void;
  clearSearch: () => void;
}

export const useMachineSelection = create<MachineSelectionState>()((set) => ({
  selectedMachine: null,
  hoveredMachineId: null,
  searchQuery: "",
  searchTargetId: null,
  selectMachine: (machine) => set({ selectedMachine: machine }),
  setHovered: (hoveredMachineId) => set({ hoveredMachineId }),
  setSearch: (searchQuery, searchTargetId = null) => set({ searchQuery, searchTargetId }),
  clearSearch: () => set({ searchQuery: "", searchTargetId: null }),
}));
