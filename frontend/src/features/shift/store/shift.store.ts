import { create } from "zustand";
import type { Shift } from "../types/shift.types";

interface ShiftState {
  selectedShift: Shift | null;
  isDrawerOpen: boolean;
  isFormOpen: boolean;

  setSelectedShift: (shift: Shift | null) => void;
  setDrawerOpen: (isOpen: boolean) => void;
  setFormOpen: (isOpen: boolean) => void;
}

export const useShiftStore = create<ShiftState>((set) => ({
  selectedShift: null,
  isDrawerOpen: false,
  isFormOpen: false,

  setSelectedShift: (shift) => set({ selectedShift: shift }),
  setDrawerOpen: (isOpen) => set({ isDrawerOpen: isOpen }),
  setFormOpen: (isOpen) => set({ isFormOpen: isOpen }),
}));
