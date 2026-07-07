import { X, Calendar as CalendarIcon, BarChart3, Clock, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAttendanceStore } from "../store/attendance.store";
import { useAttendanceRecords } from "../hooks/useAttendanceData";
import { cn } from "@/lib/utils";
import { AttendanceStatusBadge } from "./AttendanceUIHelpers";
import { AttendanceCalendar } from "./drawer-tabs/AttendanceCalendar";
import { AttendanceAnalytics } from "./drawer-tabs/AttendanceAnalytics";
import { AttendanceTimeline } from "./drawer-tabs/AttendanceTimeline";

const TABS = [
  { id: "overview", label: "Overview", icon: User },
  { id: "calendar", label: "Calendar", icon: CalendarIcon },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "timeline", label: "Timeline", icon: Clock },
];

export function AttendanceDetailsDrawer() {
  const store = useAttendanceStore();
  const { records, isLoading } = useAttendanceRecords();
  
  const record = records.find(r => r.workerId === store.selectedWorkerId);

  return (
    <AnimatePresence>
      {store.isDrawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => store.setDrawerOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-lg xl:max-w-xl bg-zinc-950 border-l border-white/10 flex flex-col shadow-2xl overflow-hidden"
          >
            {isLoading || !record ? (
              <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                <p className="text-zinc-500 text-sm">Loading attendance details...</p>
              </div>
            ) : (
              <>
            {/* Header */}
            <div className="bg-zinc-900/60 border-b border-white/10 px-6 py-5 flex-shrink-0">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400 text-lg">
                    {record.workerName.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white leading-tight">
                      {record.workerName}
                    </h2>
                    <p className="text-sm text-white/50 font-mono mt-0.5">
                      {record.employeeCode} · {record.department}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => store.setDrawerOpen(false)}
                  className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex px-6 border-b border-white/5 bg-zinc-900/20 overflow-x-auto no-scrollbar flex-shrink-0">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = store.drawerTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => store.setDrawerTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-medium transition-colors whitespace-nowrap",
                      isActive
                        ? "border-blue-500 text-blue-400"
                        : "border-transparent text-white/40 hover:text-white/80 hover:border-white/20"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 no-scrollbar relative">
              {store.drawerTab === "overview" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Today's Summary</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-zinc-900/50 rounded-xl border border-white/5">
                        <p className="text-white/40 text-[10px] uppercase mb-1">Status</p>
                        <AttendanceStatusBadge status={record.status} isLate={record.isLate} />
                      </div>
                      <div className="p-4 bg-zinc-900/50 rounded-xl border border-white/5">
                        <p className="text-white/40 text-[10px] uppercase mb-1">Shift</p>
                        <p className="text-white text-sm font-medium">{record.shift}</p>
                      </div>
                      <div className="p-4 bg-zinc-900/50 rounded-xl border border-white/5">
                        <p className="text-white/40 text-[10px] uppercase mb-1">Check In</p>
                        <p className="text-white text-sm font-mono">
                          {record.checkIn ? new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—"}
                        </p>
                      </div>
                      <div className="p-4 bg-zinc-900/50 rounded-xl border border-white/5">
                        <p className="text-white/40 text-[10px] uppercase mb-1">Check Out</p>
                        <p className="text-white text-sm font-mono">
                          {record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—"}
                        </p>
                      </div>
                      <div className="col-span-2 p-4 bg-zinc-900/50 rounded-xl border border-white/5 flex items-center justify-between">
                        <div>
                          <p className="text-white/40 text-[10px] uppercase mb-1">Total Hours Today</p>
                          <p className="text-white text-xl font-bold font-mono">{record.workingHours || 0}h</p>
                        </div>
                        {record.overtimeHours ? (
                          <div className="text-right">
                            <p className="text-orange-400/50 text-[10px] uppercase mb-1">Overtime</p>
                            <p className="text-orange-400 font-bold font-mono">+{record.overtimeHours}h</p>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Monthly KPI</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 bg-zinc-900/50 rounded-lg border border-white/5 text-center">
                        <p className="text-xl font-black text-emerald-400">21</p>
                        <p className="text-[10px] text-white/40 uppercase mt-1">Present</p>
                      </div>
                      <div className="p-3 bg-zinc-900/50 rounded-lg border border-white/5 text-center">
                        <p className="text-xl font-black text-rose-400">2</p>
                        <p className="text-[10px] text-white/40 uppercase mt-1">Absent</p>
                      </div>
                      <div className="p-3 bg-zinc-900/50 rounded-lg border border-white/5 text-center">
                        <p className="text-xl font-black text-amber-400">3</p>
                        <p className="text-[10px] text-white/40 uppercase mt-1">Late</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {store.drawerTab === "calendar" && <AttendanceCalendar />}
              {store.drawerTab === "analytics" && <AttendanceAnalytics />}
              {store.drawerTab === "timeline" && <AttendanceTimeline workerId={record.workerId} />}
            </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
