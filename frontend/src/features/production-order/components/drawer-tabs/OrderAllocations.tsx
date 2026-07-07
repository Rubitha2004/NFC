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

      <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-6 text-center text-white/40">
        <p className="text-sm">Detailed allocation lists would appear here in production.</p>
        <p className="text-xs mt-2">Connects to Worker and Machine management modules.</p>
      </div>
    </div>
  );
}
