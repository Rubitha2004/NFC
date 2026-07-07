import { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MACHINE_STATUS_META } from '../types/factory.types';
import type { Machine } from '../types/factory.types';
import { WorkerIndicator } from './WorkerIndicator';
import { MachineTooltip } from './MachineTooltip';
import { useFactoryStore } from '../store/factory.store';

interface MachineCardProps {
  machine: Machine;
  statusFilter: string;
}

/** Returns Tailwind color classes for the efficiency bottom strip */
function efficiencyStripClass(efficiency: number, status: Machine['status']): string {
  if (status === 'offline' || status === 'maintenance') return 'bg-red-500/30';
  if (status === 'no_worker') return 'bg-zinc-600/40';
  if (efficiency >= 80) return 'bg-emerald-500';
  if (efficiency >= 50) return 'bg-amber-400';
  return 'bg-red-500';
}

export const MachineCard = memo(function MachineCard({ machine, statusFilter }: MachineCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { selectedMachineId, selectMachine } = useFactoryStore();

  const isSelected = selectedMachineId === machine.id;
  const isDimmed   = statusFilter !== 'all' && machine.status !== statusFilter;
  const meta       = MACHINE_STATUS_META[machine.status];

  const handleClick = useCallback(() => {
    selectMachine(isSelected ? null : machine.id);
  }, [isSelected, machine.id, selectMachine]);

  const hasEfficiency = machine.status !== 'no_worker';
  const stripClass    = efficiencyStripClass(machine.efficiency, machine.status);

  return (
    <div
      className="relative flex flex-col items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover tooltip */}
      <AnimatePresence>
        {isHovered && !isSelected && <MachineTooltip machine={machine} />}
      </AnimatePresence>

      {/* Card */}
      <motion.button
        onClick={handleClick}
        whileHover={{ scale: 1.09, y: -3 }}
        whileTap={{ scale: 0.96 }}
        animate={{ opacity: isDimmed ? 0.2 : 1, scale: isSelected ? 1.12 : 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 400 }}
        className={cn(
          'relative flex flex-col items-center justify-between overflow-hidden',
          'w-[84px] h-[92px] rounded-xl border cursor-pointer focus:outline-none',
          'transition-colors duration-200',
          meta.bg, meta.border,
          isSelected  ? 'ring-2 ring-white/60 ring-offset-1 ring-offset-transparent' : '',
          isHovered && !isDimmed ? meta.glow : '',
        )}
      >
        {/* Header row: machine # + status dot */}
        <div className="flex items-center justify-between w-full px-1.5 pt-1.5">
          <span className="text-[9px] font-bold text-white/60 leading-none">
            {machine.machineNumber}
          </span>
          <StatusDot status={machine.status} dotClass={meta.dot} />
        </div>

        {/* Worker avatar */}
        <div className="flex-1 flex items-center justify-center">
          {machine.worker ? (
            <WorkerIndicator worker={machine.worker} size="sm" showName={false} />
          ) : (
            <div className="w-7 h-7 rounded-full bg-white/5 border border-dashed border-white/20 flex items-center justify-center">
              <span className="text-[9px] text-white/25">—</span>
            </div>
          )}
        </div>

        {/* Worker first name */}
        <div className="w-full px-1 pb-0.5">
          <span className="text-[8.5px] text-white/55 truncate w-full text-center block leading-none">
            {machine.worker?.name.split(' ')[0] ?? 'No Worker'}
          </span>
          {machine.assignment && (
            <span className="text-[7.5px] text-white/30 truncate w-full text-center block leading-none mt-0.5">
              {machine.assignment.operationName}
            </span>
          )}
        </div>

        {/* Efficiency strip — colored bottom bar like a mini progress indicator */}
        {hasEfficiency && (
          <div className="w-full h-[3px] bg-white/[0.07] relative">
            <div
              className={cn('h-full transition-all', stripClass)}
              style={{ width: `${Math.max(machine.efficiency, 4)}%` }}
            />
          </div>
        )}
      </motion.button>

      {/* Machine type label */}
      <span className="mt-1 text-[8.5px] text-muted-foreground/50 truncate max-w-[84px] text-center">
        {machine.machineType}
      </span>
    </div>
  );
});

// ─── Animated Status Dot ──────────────────────────────────────────────────────

function StatusDot({ status, dotClass }: { status: Machine['status']; dotClass: string }) {
  const isPulsing = status === 'running' || status === 'maintenance';
  return (
    <span className="relative flex items-center justify-center w-2.5 h-2.5">
      {isPulsing && (
        <motion.span
          animate={{ scale: [1, 1.9, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className={cn('absolute inline-flex rounded-full w-full h-full', dotClass)}
        />
      )}
      <span className={cn('relative inline-flex rounded-full w-2 h-2', dotClass)} />
    </span>
  );
}
