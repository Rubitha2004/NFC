import { Users, Settings, PackageOpen } from "lucide-react";
import type { ProductionOrder } from "../../types/production-order.types";
import { motion } from "framer-motion";

export function OrderAllocations({ order }: { order: ProductionOrder }) {
  const allocations = [
    {
      id: "workers",
      label: "Assigned Workers",
      count: order.allocations.workersCount,
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      id: "machines",
      label: "Machine Allocation",
      count: order.allocations.machinesCount,
      icon: Settings,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      id: "bundles",
      label: "Active Bundles",
      count: order.allocations.bundlesCount,
      icon: PackageOpen,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {allocations.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-4 rounded-xl border ${item.bg} ${item.border} flex flex-col items-center text-center`}
            >
              <div className={`p-3 rounded-full bg-zinc-950/50 ${item.color} mb-3`}>
                <Icon className="w-6 h-6" />
              </div>
              <p className={`text-3xl font-black ${item.color}`}>{item.count}</p>
              <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mt-1">{item.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center">
            <Users className="w-4 h-4 mr-2 text-blue-400" /> Worker Roster
          </h3>
          <div className="space-y-2">
            {order.allocations.workersList?.length ? (
              order.allocations.workersList.map(w => (
                <div key={w.id} className="flex justify-between items-center p-2 rounded-lg bg-zinc-950/50 border border-white/5">
                  <span className="text-sm text-white/90">{w.name}</span>
                  <span className="text-xs text-white/40 font-mono">{w.code}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-white/30 text-center py-4">No workers assigned</p>
            )}
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center">
            <Settings className="w-4 h-4 mr-2 text-emerald-400" /> Machine Roster
          </h3>
          <div className="space-y-2">
            {order.allocations.machinesList?.length ? (
              order.allocations.machinesList.map(m => (
                <div key={m.id} className="flex justify-between items-center p-2 rounded-lg bg-zinc-950/50 border border-white/5">
                  <span className="text-sm text-white/90">{m.name}</span>
                  <span className="text-xs text-white/40 font-mono">{m.code}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-white/30 text-center py-4">No machines assigned</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
