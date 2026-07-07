import { motion } from "framer-motion";
import {
  ClipboardList,
  Play,
  CheckCircle2,
  Clock,
  Users,
  Cpu,
  Calendar,
  Percent,
} from "lucide-react";
import { useAssignmentsData } from "../hooks/useAssignmentsData";

const KPI_CONFIG = [
  { id: "total", label: "Total Assignments", icon: ClipboardList, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { id: "active", label: "Active", icon: Play, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  { id: "completed", label: "Completed", icon: CheckCircle2, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  { id: "pending", label: "Pending", icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  { id: "uniqueWorkers", label: "Workers Assigned", icon: Users, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
  { id: "uniqueMachines", label: "Machines Occupied", icon: Cpu, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  { id: "todaysAssignments", label: "Today's Assignments", icon: Calendar, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  { id: "shiftUtilization", label: "Shift Utilization %", icon: Percent, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
];

export function AssignmentKPIs() {
  const { stats, isLoading } = useAssignmentsData();

  const values: Record<string, number> = {
    total: stats.total,
    active: stats.active,
    completed: stats.completed,
    pending: stats.pending,
    uniqueWorkers: stats.uniqueWorkers,
    uniqueMachines: stats.uniqueMachines,
    todaysAssignments: stats.todaysAssignments,
    shiftUtilization: stats.shiftUtilization,
  };

  if (isLoading) {
    return (
      <div className="flex-shrink-0 px-6 py-4 border-b border-white/[0.05] bg-zinc-950 opacity-50 pointer-events-none">
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-[68px] rounded-xl border border-white/10 bg-zinc-900 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-shrink-0 px-6 py-4 border-b border-white/[0.05] bg-zinc-950">
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
        {KPI_CONFIG.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              whileHover={{ y: -2, transition: { duration: 0.15 } }}
              className={`flex items-center gap-3 p-3 rounded-xl border ${kpi.bg} ${kpi.border} shadow-lg shadow-black/20`}
            >
              <div className={`p-2 rounded-lg bg-zinc-950/60 ${kpi.color} flex-shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className={`text-xl font-black leading-none ${kpi.color}`}>
                  {values[kpi.id]}{kpi.id === 'shiftUtilization' ? '%' : ''}
                </p>
                <p className="text-[10px] font-semibold text-white/40 mt-1 uppercase tracking-wider truncate">
                  {kpi.label}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
