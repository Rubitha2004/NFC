import { cn } from "@/lib/utils";
import { useSettingsStore } from "../store/settings.store";
import type { SettingsTabId } from "../types/settings.types";
import { 
  Building, 
  Settings, 
  Users, 
  Clock, 
  Bell, 
  ShieldAlert, 
  Palette, 
  DatabaseBackup, 
  Plug, 
  List
} from "lucide-react";

const NAV_ITEMS: { id: SettingsTabId; label: string; icon: any }[] = [
  { id: "General", label: "General", icon: Settings },
  { id: "Factory", label: "Factory", icon: Building },
  { id: "Departments", label: "Departments", icon: Users },
  { id: "Shifts", label: "Shifts", icon: Clock },
  { id: "Notifications", label: "Notifications", icon: Bell },
  { id: "Security", label: "Security", icon: ShieldAlert },
  { id: "Appearance", label: "Appearance", icon: Palette },
  { id: "Backup", label: "Backup", icon: DatabaseBackup },
  { id: "Integrations", label: "Integrations", icon: Plug },
  { id: "Audit Logs", label: "Audit Logs", icon: List },
];

export function SettingsSidebar() {
  const store = useSettingsStore();

  return (
    <div className="w-64 bg-zinc-950 border-r border-white/[0.05] flex-shrink-0 overflow-y-auto custom-scrollbar">
      <div className="p-4 space-y-1">
        <h3 className="px-2 text-xs font-bold text-white/40 uppercase tracking-wider mb-4">Configuration</h3>
        
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = store.activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => store.setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" 
                  : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
