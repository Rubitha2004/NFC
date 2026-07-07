import { create } from "zustand";
import type { Terminal } from "../types/terminal.types";

interface TerminalState {
  selectedTerminal: Terminal | null;
  isDrawerOpen: boolean;
  isFormOpen: boolean;

  setSelectedTerminal: (terminal: Terminal | null) => void;
  setDrawerOpen: (isOpen: boolean) => void;
  setFormOpen: (isOpen: boolean) => void;
}

export const useTerminalStore = create<TerminalState>((set) => ({
  selectedTerminal: null,
  isDrawerOpen: false,
  isFormOpen: false,

  setSelectedTerminal: (terminal) => set({ selectedTerminal: terminal }),
  setDrawerOpen: (isOpen) => set({ isDrawerOpen: isOpen }),
  setFormOpen: (isOpen) => set({ isFormOpen: isOpen }),
}));
