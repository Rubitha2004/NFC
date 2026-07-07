import { motion, AnimatePresence } from "framer-motion";
import { X, ClipboardList, User, Cpu, BarChart2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAssignmentStore } from "../store/assignment.store";
import { useAssignment } from "../hooks/useAssignment";
import { AssignmentStatusBadge, AssignmentPriorityBadge } from "./AssignmentUIHelpers";

const TABS = [
  { id: "overview", label: "Overview", icon: ClipboardList },
  { id: "worker", label: "Worker", icon: User },
  { id: "machine", label: "Machine", icon: Cpu },
  { id: "production", label: "Production", icon: BarChart2 },
  { id: "timeline", label: "Timeline", icon: Clock },
];

export function AssignmentDetailsDrawer() {
  const store = useAssignmentStore();
  const { data: assignment, isLoading } = useAssignment(store.selectedAssignmentId);

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
            {isLoading || !assignment ? (
              <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                <p className="text-zinc-500 text-sm">Loading assignment details...</p>
              </div>
            ) : (
              <>
            {/* Header */}
            <div className="bg-zinc-900/60 border-b border-white/10 px-6 py-5 flex-shrink-0">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white leading-tight">
                    Assignment {assignment.assignmentId}
                  </h2>
                  <p className="text-sm text-white/50 font-mono mt-1">
                    {assignment.department} · {assignment.shift} Shift
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <AssignmentStatusBadge status={assignment.status} />
                    <AssignmentPriorityBadge priority={assignment.priority} />
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
                    <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Key Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-zinc-900/50 rounded-lg border border-white/5">
                        <p className="text-white/40 text-[10px] uppercase mb-1">Supervisor</p>
                        <p className="text-white text-sm font-medium">{assignment.supervisor}</p>
                      </div>
                      <div className="p-3 bg-zinc-900/50 rounded-lg border border-white/5">
                        <p className="text-white/40 text-[10px] uppercase mb-1">Assigned Time</p>
                        <p className="text-white text-sm font-mono">{new Date(assignment.assignedTime).toLocaleString()}</p>
                      </div>
                      <div className="p-3 bg-zinc-900/50 rounded-lg border border-white/5">
                        <p className="text-white/40 text-[10px] uppercase mb-1">Expected Completion</p>
                        <p className="text-white text-sm font-mono">{new Date(assignment.expectedCompletion).toLocaleString()}</p>
                      </div>
                      <div className="p-3 bg-zinc-900/50 rounded-lg border border-white/5">
                        <p className="text-white/40 text-[10px] uppercase mb-1">Remarks</p>
                        <p className="text-white text-sm">{assignment.remarks || "No remarks"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {store.drawerTab === "worker" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400 text-xl">
                      {assignment.worker.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-lg font-bold text-white">{assignment.worker.name}</p>
                      <p className="text-sm text-white/50">{assignment.worker.employeeCode}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-zinc-900/50 rounded-lg border border-white/5">
                      <p className="text-white/40 text-[10px] uppercase mb-1">Grade</p>
                      <p className="text-white text-sm font-medium">{assignment.worker.grade}</p>
                    </div>
                    <div className="p-3 bg-zinc-900/50 rounded-lg border border-white/5">
                      <p className="text-white/40 text-[10px] uppercase mb-1">Primary Skill</p>
                      <p className="text-white text-sm font-medium">{assignment.worker.skill}</p>
                    </div>
                  </div>
                </div>
              )}

              {store.drawerTab === "machine" && (
                <div className="space-y-6">
                  <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-white">{assignment.machine.name}</p>
                      <p className="text-sm text-white/50 font-mono">{assignment.machine.machineId}</p>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/80 uppercase">
                      {assignment.machine.status}
                    </div>
                  </div>
                </div>
              )}

              {store.drawerTab === "production" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-xl">
                      <p className="text-white/40 text-xs uppercase mb-1">Production Order</p>
                      <p className="text-white font-mono">{assignment.production.orderId}</p>
                    </div>
                    <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-xl">
                      <p className="text-white/40 text-xs uppercase mb-1">Bundle ID</p>
                      <p className="text-white font-mono">{assignment.production.bundleId}</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-xl">
                    <p className="text-white/40 text-xs uppercase mb-1">Style</p>
                    <p className="text-white">{assignment.production.style}</p>
                  </div>

                  <div className="p-5 bg-zinc-900/50 rounded-xl border border-white/5">
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <p className="text-white/40 text-xs uppercase font-bold mb-1">Progress</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-white">{assignment.production.completedQuantity}</span>
                          <span className="text-sm text-white/40">/ {assignment.production.targetQuantity}</span>
                        </div>
                      </div>
                      <div className="text-emerald-400 font-bold text-xl">
                        {Math.round((assignment.production.completedQuantity / assignment.production.targetQuantity) * 100)}%
                      </div>
                    </div>
                    <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(assignment.production.completedQuantity / assignment.production.targetQuantity) * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" 
                      />
                    </div>
                  </div>
                </div>
              )}

              {store.drawerTab === "timeline" && (
                <div className="relative pl-4 space-y-6">
                  <div className="absolute top-2 bottom-2 left-[21px] w-0.5 bg-white/10" />
                  {assignment.timeline.map((event) => (
                    <div key={event.id} className="relative pl-8">
                      <div className="absolute left-[3px] top-1.5 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] ring-4 ring-zinc-950" />
                      <p className="text-[10px] text-white/40 font-mono mb-0.5">
                        {new Date(event.timestamp).toLocaleString()}
                      </p>
                      <p className="text-sm font-semibold text-white/90">{event.title}</p>
                      {event.description && (
                        <p className="text-xs text-white/60 mt-1 leading-relaxed">{event.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
