import { create } from "zustand";

interface ControlCenterState {
  isValidationModalOpen: boolean;
  selectedOrderId: string | null;
  setValidationModalOpen: (open: boolean) => void;
  setSelectedOrder: (id: string | null) => void;
}

export const useControlCenterStore = create<ControlCenterState>((set) => ({
  isValidationModalOpen: false,
  selectedOrderId: null,
  setValidationModalOpen: (open) => set({ isValidationModalOpen: open }),
  setSelectedOrder: (id) => set({ selectedOrderId: id }),
}));
