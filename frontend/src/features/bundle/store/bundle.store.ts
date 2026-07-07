import { create } from "zustand";

interface BundleStore {
  selectedBundleId: string | null;
  isDrawerOpen: boolean;
  drawerTab: string;
  isCreateModalOpen: boolean;

  searchQuery: string;
  poFilter: string;
  operationFilter: string;
  departmentFilter: string;
  statusFilter: string;

  setSelectedBundle: (id: string | null) => void;
  setDrawerOpen: (open: boolean) => void;
  setDrawerTab: (tab: string) => void;
  setCreateModalOpen: (open: boolean) => void;

  setSearchQuery: (q: string) => void;
  setPoFilter: (v: string) => void;
  setOperationFilter: (v: string) => void;
  setDepartmentFilter: (v: string) => void;
  setStatusFilter: (v: string) => void;
  resetFilters: () => void;
}

const FILTER_DEFAULTS = {
  searchQuery: "",
  poFilter: "all",
  operationFilter: "all",
  departmentFilter: "all",
  statusFilter: "all",
};

export const useBundleStore = create<BundleStore>((set) => ({
  selectedBundleId: null,
  isDrawerOpen: false,
  drawerTab: "overview",
  isCreateModalOpen: false,

  ...FILTER_DEFAULTS,

  setSelectedBundle: (id) =>
    set({ selectedBundleId: id, isDrawerOpen: !!id, drawerTab: "overview" }),
  setDrawerOpen: (open) =>
    set((s) => ({
      isDrawerOpen: open,
      selectedBundleId: open ? s.selectedBundleId : null,
    })),
  setDrawerTab: (tab) => set({ drawerTab: tab }),
  setCreateModalOpen: (open) => set({ isCreateModalOpen: open }),

  setSearchQuery: (q) => set({ searchQuery: q }),
  setPoFilter: (v) => set({ poFilter: v }),
  setOperationFilter: (v) => set({ operationFilter: v }),
  setDepartmentFilter: (v) => set({ departmentFilter: v }),
  setStatusFilter: (v) => set({ statusFilter: v }),
  resetFilters: () => set(FILTER_DEFAULTS),
}));
