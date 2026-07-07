import { motion } from "framer-motion";
import { Users, UserCheck, Lock, ShieldCheck, Settings, Package } from "lucide-react";
import { useUserRecords } from "../hooks/useUserData";

export function UserKPIs() {
  const { stats } = useUserRecords();

  const KPI_CONFIG = [
    { id: "total", label: "Total Users", value: stats.total, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { id: "active", label: "Active", value: stats.active, icon: UserCheck, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { id: "locked", label: "Locked Accounts", value: stats.locked, icon: Lock, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
    { id: "admins", label: "Administrators", value: stats.admins, icon: ShieldCheck, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    { id: "supervisors", label: "Supervisors", value: stats.supervisors, icon: Settings, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { id: "operators", label: "Operators", value: stats.operators, icon: Package, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
  ];

  return (
    <div className="flex-shrink-0 px-6 py-4 border-b border-white/[0.05] bg-zinc-950">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
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
                  {kpi.value.toLocaleString()}
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
