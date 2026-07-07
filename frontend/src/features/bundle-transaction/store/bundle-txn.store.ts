import { create } from "zustand";

interface BundleTxnStore {
  selectedTxnId: string | null;
  isDrawerOpen: boolean;
  drawerTab: string;

  searchQuery: string;

  setSelectedTxn: (id: string | null) => void;
  setDrawerOpen: (open: boolean) => void;
  setDrawerTab: (tab: string) => void;

  setSearchQuery: (q: string) => void;
}

export const useBundleTxnStore = create<BundleTxnStore>((set) => ({
  selectedTxnId: null,
  isDrawerOpen: false,
  drawerTab: "history",

  searchQuery: "",

  setSelectedTxn: (id) =>
    set({ selectedTxnId: id, isDrawerOpen: !!id, drawerTab: "history" }),
  setDrawerOpen: (open) =>
    set((s) => ({
      isDrawerOpen: open,
      selectedTxnId: open ? s.selectedTxnId : null,
    })),
  setDrawerTab: (tab) => set({ drawerTab: tab }),

  setSearchQuery: (q) => set({ searchQuery: q }),
}));
