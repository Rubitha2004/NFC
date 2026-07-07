import { create } from 'zustand';

interface DepartmentStore {
  isAddDialogOpen: boolean;
  setAddDialogOpen: (open: boolean) => void;
  
  isDetailsDrawerOpen: boolean;
  setDetailsDrawerOpen: (open: boolean) => void;
  
  selectedDepartmentId: string | null;
  setSelectedDepartmentId: (id: string | null) => void;
  
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  
  typeFilter: string;
  setTypeFilter: (type: string) => void;
}

export const useDepartmentStore = create<DepartmentStore>((set) => ({
  isAddDialogOpen: false,
  setAddDialogOpen: (open) => set({ isAddDialogOpen: open }),
  
  isDetailsDrawerOpen: false,
  setDetailsDrawerOpen: (open) => set({ isDetailsDrawerOpen: open }),
  
  selectedDepartmentId: null,
  setSelectedDepartmentId: (id) => set({ selectedDepartmentId: id }),
  
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  statusFilter: 'all',
  setStatusFilter: (status) => set({ statusFilter: status }),
  
  typeFilter: 'all',
  setTypeFilter: (type) => set({ typeFilter: type }),
}));
