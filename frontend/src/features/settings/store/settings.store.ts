import { create } from "zustand";
import type { SettingsTabId } from "../types/settings.types";

interface SettingsStore {
  activeTab: SettingsTabId;
  hasUnsavedChanges: boolean;

  setActiveTab: (tab: SettingsTabId) => void;
  setHasUnsavedChanges: (val: boolean) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  activeTab: "General",
  hasUnsavedChanges: false,
  
  setActiveTab: (tab) => set({ activeTab: tab }),
  setHasUnsavedChanges: (val) => set({ hasUnsavedChanges: val }),
}));
