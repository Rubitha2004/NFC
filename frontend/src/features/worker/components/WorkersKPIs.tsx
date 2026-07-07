import { motion } from 'framer-motion';
import { Users, UserCheck, UserMinus, UserCog } from 'lucide-react';
import { useWorkers } from '../hooks/useWorkers';
import { KPICard } from '@/shared/components/ui/KPICard';

const KPI_CONFIG = [
  { id: 'total', label: 'Total Workers', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { id: 'present', label: 'Present', icon: UserCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { id: 'onLeave', label: 'On Leave', icon: UserMinus, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { id: 'unassigned', label: 'Unassigned', icon: UserCog, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
];

export function WorkersKPIs() {
  const { data: workers = [] } = useWorkers();

  // Compute stats from data
  const values: Record<string, number> = {
    total: workers.length,
    present: workers.filter(w => w.status === 'active').length,
    onLeave: workers.filter(w => w.status === 'on_leave').length,
    unassigned: workers.filter(w => w.status === 'active' && (!w.currentAssignment || w.currentAssignment === undefined)).length
  };

  return (
    <div className="flex-shrink-0 px-6 py-4 border-b border-white/[0.05] bg-zinc-950">
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4">
        {KPI_CONFIG.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
              className={`flex items-center gap-3 p-3 rounded-xl border ${kpi.bg} ${kpi.border} bg-opacity-50 backdrop-blur-sm`}
            >
              <div className={`p-2 rounded-lg bg-zinc-950/50 ${kpi.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className={`text-xl font-black leading-none ${kpi.color}`}>
                  {values[kpi.id]}
                </p>
                <p className="text-[11px] font-medium text-white/50 mt-1 uppercase tracking-wider">{kpi.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
