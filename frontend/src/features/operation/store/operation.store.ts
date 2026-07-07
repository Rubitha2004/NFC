import { create } from "zustand";
import type { Operation } from "../types/operation.types";

interface OperationState {
  selectedOperation: Operation | null;
  isDrawerOpen: boolean;
  isFormOpen: boolean;

  setSelectedOperation: (operation: Operation | null) => void;
  setDrawerOpen: (isOpen: boolean) => void;
  setFormOpen: (isOpen: boolean) => void;
}

export const useOperationStore = create<OperationState>((set) => ({
  selectedOperation: null,
  isDrawerOpen: false,
  isFormOpen: false,

  setSelectedOperation: (operation) => set({ selectedOperation: operation }),
  setDrawerOpen: (isOpen) => set({ isDrawerOpen: isOpen }),
  setFormOpen: (isOpen) => set({ isFormOpen: isOpen }),
}));
