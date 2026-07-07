import { create } from 'zustand';

interface WorkerState {
  selectedWorkerId: string | null;
  isDrawerOpen: boolean;
  isAddDialogOpen: boolean;
  
  // Filters
  searchQuery: string;
  departmentFilter: string;
  gradeFilter: string;
  statusFilter: string;

  // Actions
  setSelectedWorker: (id: string | null) => void;
  setDrawerOpen: (isOpen: boolean) => void;
  setAddDialogOpen: (isOpen: boolean) => void;
  
  setSearchQuery: (query: string) => void;
  setDepartmentFilter: (dept: string) => void;
  setGradeFilter: (grade: string) => void;
  setStatusFilter: (status: string) => void;
  resetFilters: () => void;
}

export const useWorkerStore = create<WorkerState>((set) => ({
  selectedWorkerId: null,
  isDrawerOpen: false,
  isAddDialogOpen: false,

  searchQuery: "",
  departmentFilter: "all",
  gradeFilter: "all",
  statusFilter: "all",

  setSelectedWorker: (id) => set({ selectedWorkerId: id, isDrawerOpen: !!id }),
  setDrawerOpen: (isOpen) => set((state) => ({ 
    isDrawerOpen: isOpen, 
    selectedWorkerId: isOpen ? state.selectedWorkerId : null 
  })),
  setAddDialogOpen: (isOpen) => set({ isAddDialogOpen: isOpen }),

  setSearchQuery: (query) => set({ searchQuery: query }),
  setDepartmentFilter: (dept) => set({ departmentFilter: dept }),
  setGradeFilter: (grade) => set({ gradeFilter: grade }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  
  resetFilters: () => set({
    searchQuery: "",
    departmentFilter: "all",
    gradeFilter: "all",
    statusFilter: "all",
  }),
}));
