import { create } from "zustand";

interface UserStore {
  selectedUserId: string | null;
  isDrawerOpen: boolean;
  drawerTab: string;
  isCreateModalOpen: boolean;

  searchQuery: string;
  departmentFilter: string;
  roleFilter: string;
  statusFilter: string;

  setSelectedUser: (id: string | null) => void;
  setDrawerOpen: (open: boolean) => void;
  setDrawerTab: (tab: string) => void;
  setCreateModalOpen: (open: boolean) => void;

  setSearchQuery: (q: string) => void;
  setDepartmentFilter: (v: string) => void;
  setRoleFilter: (v: string) => void;
  setStatusFilter: (v: string) => void;
  resetFilters: () => void;
}

const FILTER_DEFAULTS = {
  searchQuery: "",
  departmentFilter: "all",
  roleFilter: "all",
  statusFilter: "all",
};

export const useUserStore = create<UserStore>((set) => ({
  selectedUserId: null,
  isDrawerOpen: false,
  drawerTab: "profile",
  isCreateModalOpen: false,

  ...FILTER_DEFAULTS,

  setSelectedUser: (id) =>
    set({ selectedUserId: id, isDrawerOpen: !!id, drawerTab: "profile" }),
  setDrawerOpen: (open) =>
    set((s) => ({
      isDrawerOpen: open,
      selectedUserId: open ? s.selectedUserId : null,
    })),
  setDrawerTab: (tab) => set({ drawerTab: tab }),
  setCreateModalOpen: (open) => set({ isCreateModalOpen: open }),

  setSearchQuery: (q) => set({ searchQuery: q }),
  setDepartmentFilter: (v) => set({ departmentFilter: v }),
  setRoleFilter: (v) => set({ roleFilter: v }),
  setStatusFilter: (v) => set({ statusFilter: v }),
  resetFilters: () => set(FILTER_DEFAULTS),
}));
