import { create } from "zustand";

interface MachineStore {
  // Selection & Drawers
  selectedMachineId: string | null;
  isDrawerOpen: boolean;
  isAddDialogOpen: boolean;
  drawerTab: string;

  // Filters
  searchQuery: string;
  departmentFilter: string;
  buildingFilter: string;
  floorFilter: string;
  roomFilter: string;
  productionLineFilter: string;
  typeFilter: string;
  statusFilter: string;
  healthFilter: string;

  // Refresh
  refreshTrigger: number;

  // Actions
  setSelectedMachine: (id: string | null) => void;
  setDrawerOpen: (open: boolean) => void;
  setAddDialogOpen: (open: boolean) => void;
  setDrawerTab: (tab: string) => void;

  setSearchQuery: (q: string) => void;
  setDepartmentFilter: (v: string) => void;
  setBuildingFilter: (v: string) => void;
  setFloorFilter: (v: string) => void;
  setRoomFilter: (v: string) => void;
  setProductionLineFilter: (v: string) => void;
  setTypeFilter: (v: string) => void;
  setStatusFilter: (v: string) => void;
  setHealthFilter: (v: string) => void;
  resetFilters: () => void;
  
  triggerRefresh: () => void;
}

const FILTER_DEFAULTS = {
  searchQuery: "",
  departmentFilter: "all",
  buildingFilter: "all",
  floorFilter: "all",
  roomFilter: "all",
  productionLineFilter: "all",
  typeFilter: "all",
  statusFilter: "all",
  healthFilter: "all",
};

export const useMachineStore = create<MachineStore>((set) => ({
  selectedMachineId: null,
  isDrawerOpen: false,
  isAddDialogOpen: false,
  drawerTab: "overview",

  ...FILTER_DEFAULTS,

  setSelectedMachine: (id) =>
    set({ selectedMachineId: id, isDrawerOpen: !!id, drawerTab: "overview" }),
  setDrawerOpen: (open) =>
    set((s) => ({
      isDrawerOpen: open,
      selectedMachineId: open ? s.selectedMachineId : null,
    })),
  setAddDialogOpen: (open) => set({ isAddDialogOpen: open }),
  setDrawerTab: (tab) => set({ drawerTab: tab }),

  setSearchQuery: (q) => set({ searchQuery: q }),
  setDepartmentFilter: (v) => set({ departmentFilter: v }),
  setBuildingFilter: (v) => set({ buildingFilter: v }),
  setFloorFilter: (v) => set({ floorFilter: v }),
  setRoomFilter: (v) => set({ roomFilter: v }),
  setProductionLineFilter: (v) => set({ productionLineFilter: v }),
  setTypeFilter: (v) => set({ typeFilter: v }),
  setStatusFilter: (v) => set({ statusFilter: v }),
  setHealthFilter: (v) => set({ healthFilter: v }),
  resetFilters: () => set(FILTER_DEFAULTS),

  refreshTrigger: 0,
  triggerRefresh: () => set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
}));
