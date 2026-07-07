import { create } from "zustand";

interface ProductionOrderStore {
  selectedOrderId: string | null;
  isDrawerOpen: boolean;
  drawerTab: string;
  isCreateModalOpen: boolean;

  searchQuery: string;
  customerFilter: string;
  departmentFilter: string;
  statusFilter: string;
  priorityFilter: string;

  setSelectedOrder: (id: string | null) => void;
  setDrawerOpen: (open: boolean) => void;
  setDrawerTab: (tab: string) => void;
  setCreateModalOpen: (open: boolean) => void;

  setSearchQuery: (q: string) => void;
  setCustomerFilter: (v: string) => void;
  setDepartmentFilter: (v: string) => void;
  setStatusFilter: (v: string) => void;
  setPriorityFilter: (v: string) => void;
  resetFilters: () => void;
}

const FILTER_DEFAULTS = {
  searchQuery: "",
  customerFilter: "all",
  departmentFilter: "all",
  statusFilter: "all",
  priorityFilter: "all",
};

export const useProductionOrderStore = create<ProductionOrderStore>((set) => ({
  selectedOrderId: null,
  isDrawerOpen: false,
  drawerTab: "overview",
  isCreateModalOpen: false,

  ...FILTER_DEFAULTS,

  setSelectedOrder: (id) =>
    set({ selectedOrderId: id, isDrawerOpen: !!id, drawerTab: "overview" }),
  setDrawerOpen: (open) =>
    set((s) => ({
      isDrawerOpen: open,
      selectedOrderId: open ? s.selectedOrderId : null,
    })),
  setDrawerTab: (tab) => set({ drawerTab: tab }),
  setCreateModalOpen: (open) => set({ isCreateModalOpen: open }),

  setSearchQuery: (q) => set({ searchQuery: q }),
  setCustomerFilter: (v) => set({ customerFilter: v }),
  setDepartmentFilter: (v) => set({ departmentFilter: v }),
  setStatusFilter: (v) => set({ statusFilter: v }),
  setPriorityFilter: (v) => set({ priorityFilter: v }),
  resetFilters: () => set(FILTER_DEFAULTS),
}));
