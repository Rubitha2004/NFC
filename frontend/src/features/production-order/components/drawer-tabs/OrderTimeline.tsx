import { motion } from "framer-motion";
import type { ProductionOrder } from "../../types/production-order.types";
import { Clock } from "lucide-react";

export function OrderTimeline({ order }: { order: ProductionOrder }) {
  return (
    <div className="p-6">
      <div className="relative pl-6 border-l border-white/10 space-y-8">
        {order.timeline.map((event, idx) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative"
          >
            {/* Timeline dot */}
            <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-zinc-900 border-2 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            
            <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4 shadow-sm">
              <p className="text-white font-semibold text-sm mb-1">{event.action}</p>
              <div className="flex items-center gap-4 text-[11px] text-white/40 font-mono">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(event.timestamp).toLocaleString()}
                </span>
                <span className="text-blue-400/70">By: {event.user}</span>
              </div>
            </div>
          </motion.div>
        ))}

        {order.status === "completed" && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: order.timeline.length * 0.1 }}
            className="relative"
          >
            <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-zinc-900 border-2 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
              <p className="text-emerald-400 font-bold text-sm">Order Completed</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
