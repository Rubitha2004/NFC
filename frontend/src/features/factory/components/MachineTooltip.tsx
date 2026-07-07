import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MACHINE_STATUS_META } from '../types/factory.types';
import type { Machine } from '../types/factory.types';

interface MachineTooltipProps {
  machine: Machine;
  className?: string;
}

export function MachineTooltip({ machine, className }: MachineTooltipProps) {
  const meta = MACHINE_STATUS_META[machine.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className={cn(
        'absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none',
        'w-52 rounded-xl border border-white/10 bg-zinc-900/95 backdrop-blur-xl shadow-2xl',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2 border-b border-white/[0.07]">
        <span className="text-xs font-bold text-white">{machine.machineNumber}</span>
        <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-full', meta.bg, meta.color)}>
          {meta.label}
        </span>
      </div>

      {/* Body */}
      <div className="px-3 py-2 space-y-1.5 text-[11px]">
        <TooltipRow label="Type" value={machine.machineType} />
        <TooltipRow label="Dept" value={machine.department} />
        <TooltipRow
          label="Worker"
          value={machine.worker?.name ?? '—'}
        />
        <TooltipRow
          label="Operation"
          value={machine.assignment?.operationName ?? '—'}
        />
        <TooltipRow
          label="Bundle"
          value={machine.bundle?.bundleNumber ?? '—'}
        />
      </div>

      {/* Progress bar */}
      {machine.bundle && (
        <div className="px-3 pb-3">
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
            <span>Progress</span>
            <span>{machine.bundle.progress}%</span>
          </div>
          <div className="h-1 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${machine.bundle.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Arrow */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 w-2.5 h-2.5 -mt-1.5 rotate-45 bg-zinc-900 border-r border-b border-white/10" />
    </motion.div>
  );
}

function TooltipRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-zinc-500 flex-shrink-0">{label}</span>
      <span className="text-zinc-200 font-medium truncate text-right">{value}</span>
    </div>
  );
}
