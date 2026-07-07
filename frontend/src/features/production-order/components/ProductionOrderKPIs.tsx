import { motion } from "framer-motion";
import { ClipboardList, PlayCircle, CheckCircle2, Clock, AlertTriangle, Package } from "lucide-react";
import { useProductionOrders } from "../hooks/useProductionOrderData";

export function ProductionOrderKPIs() {
  const { stats, isLoading } = useProductionOrders();

  const KPI_CONFIG = [
    { id: "total", label: "Total Orders", value: stats.total, icon: ClipboardList, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { id: "running", label: "Running Orders", value: stats.running, icon: PlayCircle, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { id: "completed", label: "Completed Orders", value: stats.completed, icon: CheckCircle2, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    { id: "pending", label: "Pending Orders", value: stats.pending, icon: Clock, color: "text-zinc-400", bg: "bg-zinc-500/10", border: "border-zinc-500/20" },
    { id: "delayed", label: "Delayed Orders", value: stats.delayed, icon: AlertTriangle, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
    { id: "output", label: "Today's Output (pcs)", value: stats.todaysOutput.toLocaleString(), icon: Package, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  ];

  if (isLoading) {
    return (
      <div className="flex-shrink-0 px-6 py-4 border-b border-white/[0.05] bg-zinc-950 opacity-50 pointer-events-none">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-[68px] rounded-xl border border-white/10 bg-zinc-900 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-shrink-0 px-6 py-4 border-b border-white/[0.05] bg-zinc-950">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
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
                  {kpi.value}
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
