import { create } from "zustand";

interface AssignmentStore {
  // Selection & Drawers
  selectedAssignmentId: string | null;
  isDrawerOpen: boolean;
  isAddDialogOpen: boolean;
  drawerTab: string;

  // Filters
  searchQuery: string;
  workerFilter: string;
  departmentFilter: string;
  shiftFilter: string;
  machineFilter: string;
  operationFilter: string;
  statusFilter: string;
  dateFilter: string;

  // Actions
  setSelectedAssignment: (id: string | null) => void;
  setDrawerOpen: (open: boolean) => void;
  setAddDialogOpen: (open: boolean) => void;
  setDrawerTab: (tab: string) => void;

  setSearchQuery: (q: string) => void;
  setWorkerFilter: (v: string) => void;
  setDepartmentFilter: (v: string) => void;
  setShiftFilter: (v: string) => void;
  setMachineFilter: (v: string) => void;
  setOperationFilter: (v: string) => void;
  setStatusFilter: (v: string) => void;
  setDateFilter: (v: string) => void;
  resetFilters: () => void;
}

const FILTER_DEFAULTS = {
  searchQuery: "",
  workerFilter: "all",
  departmentFilter: "all",
  shiftFilter: "all",
  machineFilter: "all",
  operationFilter: "all",
  statusFilter: "all",
  dateFilter: "all",
};

export const useAssignmentStore = create<AssignmentStore>((set) => ({
  selectedAssignmentId: null,
  isDrawerOpen: false,
  isAddDialogOpen: false,
  drawerTab: "overview",

  ...FILTER_DEFAULTS,

  setSelectedAssignment: (id) =>
    set({ selectedAssignmentId: id, isDrawerOpen: !!id, drawerTab: "overview" }),
  setDrawerOpen: (open) =>
    set((s) => ({
      isDrawerOpen: open,
      selectedAssignmentId: open ? s.selectedAssignmentId : null,
    })),
  setAddDialogOpen: (open) => set({ isAddDialogOpen: open }),
  setDrawerTab: (tab) => set({ drawerTab: tab }),

  setSearchQuery: (q) => set({ searchQuery: q }),
  setWorkerFilter: (v) => set({ workerFilter: v }),
  setDepartmentFilter: (v) => set({ departmentFilter: v }),
  setShiftFilter: (v) => set({ shiftFilter: v }),
  setMachineFilter: (v) => set({ machineFilter: v }),
  setOperationFilter: (v) => set({ operationFilter: v }),
  setStatusFilter: (v) => set({ statusFilter: v }),
  setDateFilter: (v) => set({ dateFilter: v }),
  resetFilters: () => set(FILTER_DEFAULTS),
}));
