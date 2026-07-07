import { motion } from "framer-motion";
import type { BundleTxn } from "../../types/bundle-txn.types";
import { Package, PlayCircle, ArrowRightLeft, ShieldCheck, CheckCircle2 } from "lucide-react";

export function InteractiveTimeline({ txn }: { txn: BundleTxn }) {
  const steps = [
    { id: 1, label: "Bundle Created", icon: Package, completed: true },
    { id: 2, label: "Bundle Started", icon: PlayCircle, completed: true },
    { id: 3, label: "Transferred", icon: ArrowRightLeft, completed: txn.status === "Transferred" || txn.status === "Completed" || txn.status === "QC" || txn.status === "Rework" },
    { id: 4, label: "QC", icon: ShieldCheck, completed: txn.status === "QC" || txn.status === "Completed" },
    { id: 5, label: "Completed", icon: CheckCircle2, completed: txn.status === "Completed" },
  ];

  return (
    <div className="p-6">
      <h3 className="text-sm font-bold text-white/80 uppercase tracking-wider mb-8">Bundle Lifecycle Progress</h3>
      
      <div className="relative flex justify-between items-center max-w-sm mx-auto">
        {/* Background Line */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-zinc-900 border border-white/5 rounded-full z-0" />
        
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCurrent = step.completed && (!steps[idx + 1]?.completed);
          
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1, type: "spring" }}
              className="relative z-10 flex flex-col items-center gap-3"
            >
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-lg transition-colors duration-500
                  ${step.completed 
                    ? "bg-blue-600 border-blue-400 text-white shadow-blue-900/50" 
                    : "bg-zinc-950 border-white/10 text-white/30"
                  }
                  ${isCurrent ? "ring-4 ring-blue-500/20" : ""}
                `}
              >
                <Icon className="w-4 h-4" />
              </motion.div>
              <div className="absolute top-12 whitespace-nowrap">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${step.completed ? "text-blue-400" : "text-white/30"}`}>
                  {step.label}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-20 bg-zinc-900/50 border border-white/5 rounded-xl p-5 text-center">
        <p className="text-sm text-white/70">
          This bundle is currently <span className="font-bold text-white">{txn.status}</span>.
        </p>
        <p className="text-xs text-white/40 mt-1">Worker {txn.worker} at Operation: {txn.operation}</p>
      </div>
    </div>
  );
}
