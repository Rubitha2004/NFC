import { Download, Upload, FileText, UserPlus, Radio } from "lucide-react";
import { useAttendanceStore } from "../store/attendance.store";
import { cn } from "@/lib/utils";

export function AttendanceHeader() {
  const store = useAttendanceStore();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-6 py-4 bg-zinc-950 border-b border-white/[0.05] flex-shrink-0">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
          Attendance Management
        </h1>
        <p className="text-sm text-white/50 mt-1">
          Track worker attendance, shifts, and live NFC events.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={store.toggleLivePanel}
          className={cn(
            "flex items-center gap-2 px-3 py-2 text-sm font-bold rounded-md border transition-colors",
            store.isLivePanelOpen
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-zinc-900 text-white/60 border-white/10 hover:bg-zinc-800"
          )}
        >
          <Radio className={cn("w-4 h-4", store.isLivePanelOpen && "animate-pulse")} />
          Live Feed
        </button>

        <div className="w-px h-6 bg-white/10 mx-1" />

        <button className="flex items-center gap-2 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium rounded-md border border-white/10 transition-colors">
          <FileText className="w-4 h-4 text-white/60" />
          Report
        </button>
        <button className="flex items-center gap-2 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium rounded-md border border-white/10 transition-colors">
          <Download className="w-4 h-4 text-white/60" />
          Export
        </button>
        <button className="flex items-center gap-2 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium rounded-md border border-white/10 transition-colors">
          <Upload className="w-4 h-4 text-white/60" />
          Import
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-md shadow-lg shadow-blue-900/20 transition-colors">
          <UserPlus className="w-4 h-4" />
          Manual Entry
        </button>
      </div>
    </div>
  );
}
