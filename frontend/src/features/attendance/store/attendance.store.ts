import { create } from "zustand";

interface AttendanceStore {
  // Selection
  selectedWorkerId: string | null;
  isDrawerOpen: boolean;
  drawerTab: string;

  // Filters
  searchQuery: string;
  departmentFilter: string;
  shiftFilter: string;
  statusFilter: string;
  dateFilter: string;
  machineFilter: string;

  // Layout
  isLivePanelOpen: boolean;

  // Actions
  setSelectedWorker: (id: string | null) => void;
  setDrawerOpen: (open: boolean) => void;
  setDrawerTab: (tab: string) => void;

  setSearchQuery: (q: string) => void;
  setDepartmentFilter: (v: string) => void;
  setShiftFilter: (v: string) => void;
  setStatusFilter: (v: string) => void;
  setDateFilter: (v: string) => void;
  setMachineFilter: (v: string) => void;
  resetFilters: () => void;

  toggleLivePanel: () => void;
}

const FILTER_DEFAULTS = {
  searchQuery: "",
  departmentFilter: "all",
  shiftFilter: "all",
  statusFilter: "all",
  dateFilter: "today",
  machineFilter: "all",
};

export const useAttendanceStore = create<AttendanceStore>((set) => ({
  selectedWorkerId: null,
  isDrawerOpen: false,
  drawerTab: "overview",
  isLivePanelOpen: true,

  ...FILTER_DEFAULTS,

  setSelectedWorker: (id) =>
    set({ selectedWorkerId: id, isDrawerOpen: !!id, drawerTab: "overview" }),
  setDrawerOpen: (open) =>
    set((s) => ({
      isDrawerOpen: open,
      selectedWorkerId: open ? s.selectedWorkerId : null,
    })),
  setDrawerTab: (tab) => set({ drawerTab: tab }),

  setSearchQuery: (q) => set({ searchQuery: q }),
  setDepartmentFilter: (v) => set({ departmentFilter: v }),
  setShiftFilter: (v) => set({ shiftFilter: v }),
  setStatusFilter: (v) => set({ statusFilter: v }),
  setDateFilter: (v) => set({ dateFilter: v }),
  setMachineFilter: (v) => set({ machineFilter: v }),
  resetFilters: () => set(FILTER_DEFAULTS),

  toggleLivePanel: () => set((s) => ({ isLivePanelOpen: !s.isLivePanelOpen })),
}));
