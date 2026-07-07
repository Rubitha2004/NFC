import { create } from "zustand";

interface QCStore {
  selectedInspectionId: string | null;
  isDrawerOpen: boolean;
  drawerTab: string;
  isCreateModalOpen: boolean;

  searchQuery: string;
  bundleFilter: string;
  poFilter: string;
  workerFilter: string;
  machineFilter: string;
  departmentFilter: string;

  setSelectedInspection: (id: string | null) => void;
  setDrawerOpen: (open: boolean) => void;
  setDrawerTab: (tab: string) => void;
  setCreateModalOpen: (open: boolean) => void;

  setSearchQuery: (q: string) => void;
  setBundleFilter: (v: string) => void;
  setPoFilter: (v: string) => void;
  setWorkerFilter: (v: string) => void;
  setMachineFilter: (v: string) => void;
  setDepartmentFilter: (v: string) => void;
  resetFilters: () => void;
}

const FILTER_DEFAULTS = {
  searchQuery: "",
  bundleFilter: "all",
  poFilter: "all",
  workerFilter: "all",
  machineFilter: "all",
  departmentFilter: "all",
};

export const useQCStore = create<QCStore>((set) => ({
  selectedInspectionId: null,
  isDrawerOpen: false,
  drawerTab: "overview",
  isCreateModalOpen: false,

  ...FILTER_DEFAULTS,

  setSelectedInspection: (id) =>
    set({ selectedInspectionId: id, isDrawerOpen: !!id, drawerTab: "overview" }),
  setDrawerOpen: (open) =>
    set((s) => ({
      isDrawerOpen: open,
      selectedInspectionId: open ? s.selectedInspectionId : null,
    })),
  setDrawerTab: (tab) => set({ drawerTab: tab }),
  setCreateModalOpen: (open) => set({ isCreateModalOpen: open }),

  setSearchQuery: (q) => set({ searchQuery: q }),
  setBundleFilter: (v) => set({ bundleFilter: v }),
  setPoFilter: (v) => set({ poFilter: v }),
  setWorkerFilter: (v) => set({ workerFilter: v }),
  setMachineFilter: (v) => set({ machineFilter: v }),
  setDepartmentFilter: (v) => set({ departmentFilter: v }),
  resetFilters: () => set(FILTER_DEFAULTS),
}));
