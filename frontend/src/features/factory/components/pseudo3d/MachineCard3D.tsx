import { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MACHINE_STATUS_META } from '../../types/factory.types';
import type { Machine, MachineStatus } from '../../types/factory.types';
import { WorkerIndicator } from '../WorkerIndicator';
import { MachineTooltip } from '../MachineTooltip';
import { useFactoryStore } from '../../store/factory.store';

// ─── Status → raw RGB for inline shadow/glow ─────────────────────────────────

const STATUS_RGB: Record<MachineStatus, string> = {
  running:     '239, 68, 68',
  idle:        '16, 185, 129',
  offline:     '245, 158, 11',
  maintenance: '245, 158, 11',
  no_worker:   '16, 185, 129',
};

const STATUS_DEPTH_BG: Record<MachineStatus, string> = {
  running:     'rgba(239, 68, 68, 0.45)',
  idle:        'rgba(16, 185, 129, 0.35)',
  offline:     'rgba(245, 158, 11, 0.35)',
  maintenance: 'rgba(245, 158, 11, 0.35)',
  no_worker:   'rgba(16, 185, 129, 0.30)',
};

interface MachineCard3DProps {
  machine: Machine;
  statusFilter: MachineStatus | 'all';
}

export const MachineCard3D = memo(function MachineCard3D({ machine, statusFilter }: MachineCard3DProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { selectedMachineId, selectMachine } = useFactoryStore();

  const isSelected  = selectedMachineId === machine.id;
  const isDimmed    = statusFilter !== 'all' && machine.status !== statusFilter;
  const isRunning   = machine.status === 'running';
  const meta        = MACHINE_STATUS_META[machine.status];
  const glowRgb     = STATUS_RGB[machine.status];
  const depthBg     = STATUS_DEPTH_BG[machine.status];

  // Each machine floats at a different rate so they don't sync
  const machineNum    = parseInt(machine.id.replace(/\D/g, '')) || 1;
  const floatDuration = 2.6 + (machineNum % 5) * 0.45;
  const floatDelay    = (machineNum % 7) * 0.28;

  const handleClick = useCallback(() => {
    selectMachine(isSelected ? null : machine.id);
  }, [isSelected, machine.id, selectMachine]);

  const normalShadow = `0 14px 32px rgba(0,0,0,0.72), 0 4px 8px rgba(0,0,0,0.5), 0 0 20px rgba(${glowRgb},0.28)`;
  const hoverShadow  = `0 28px 56px rgba(0,0,0,0.82), 0 8px 16px rgba(0,0,0,0.6), 0 0 40px rgba(${glowRgb},0.55)`;
  const selectShadow = `0 0 0 2px rgba(255,255,255,0.55), 0 24px 56px rgba(0,0,0,0.8), 0 0 36px rgba(${glowRgb},0.6)`;

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

      {/* Floating wrapper — running machines bob gently */}
      <motion.div
        animate={isRunning && !isDimmed
          ? { y: [0, -5, 0] }
          : { y: 0 }
        }
        transition={isRunning && !isDimmed
          ? { duration: floatDuration, repeat: Infinity, ease: 'easeInOut', delay: floatDelay }
          : { duration: 0.3 }
        }
      >
        {/* Dimming wrapper */}
        <motion.div
          animate={{ opacity: isDimmed ? 0.18 : 1 }}
          transition={{ duration: 0.25 }}
          className="relative"
        >
          {/* ── Ambient shadow (blurred blob behind) ── */}
          <div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              background: `rgba(${glowRgb}, 0.22)`,
              transform: 'translateY(12px) scale(0.88)',
              filter: 'blur(14px)',
            }}
          />

          {/* ── Depth face (visible front edge of machine body) ── */}
          <div
            className="absolute -bottom-[7px] left-[5px] right-[5px] h-[9px] rounded-b-xl pointer-events-none"
            style={{
              background: `linear-gradient(to bottom, ${depthBg}, rgba(0,0,0,0.75))`,
            }}
          />

          {/* ── Main card surface ── */}
          <motion.button
            onClick={handleClick}
            whileHover={{ y: -10, scale: 1.07 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', damping: 22, stiffness: 380 }}
            className={cn(
              'relative flex flex-col items-center justify-between overflow-hidden',
              'w-[84px] h-[96px] rounded-xl border cursor-pointer focus:outline-none',
              meta.bg, meta.border,
            )}
            style={{
              boxShadow: isSelected ? selectShadow : isHovered ? hoverShadow : normalShadow,
            }}
          >
            {/* Header: machine # + status dot */}
            <div className="flex items-center justify-between w-full px-1.5 pt-1.5">
              <span className="text-[9px] font-bold text-white/60 leading-none">{machine.machineNumber}</span>
              <StatusDot3D status={machine.status} meta={meta} />
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

            {/* Worker name + operation */}
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

            {/* Efficiency strip — thicker in 3D mode */}
            <div className="w-full h-[4px] bg-white/[0.07]">
              <div
                className={cn(
                  'h-full transition-all',
                  machine.efficiency >= 80 ? 'bg-emerald-400'
                  : machine.efficiency >= 50 ? 'bg-amber-400'
                  : machine.status === 'running' ? 'bg-red-400'
                  : 'bg-zinc-600/60'
                )}
                style={{ width: `${Math.max(machine.efficiency, 3)}%` }}
              />
            </div>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Machine type label */}
      <span className="mt-3 text-[8.5px] text-muted-foreground/45 truncate max-w-[84px] text-center">
        {machine.machineType}
      </span>
    </div>
  );
});

// ─── 3D Status Dot (bigger, more prominent) ───────────────────────────────────

function StatusDot3D({ status, meta }: { status: Machine['status']; meta: typeof MACHINE_STATUS_META[MachineStatus] }) {
  const isPulsing = status === 'running' || status === 'maintenance';
  return (
    <span className="relative flex items-center justify-center w-3 h-3">
      {isPulsing && (
        <motion.span
          animate={{ scale: [1, 2.2, 1], opacity: [0.7, 0, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className={cn('absolute inline-flex rounded-full w-full h-full', meta.dot)}
        />
      )}
      <span className={cn('relative inline-flex rounded-full w-2.5 h-2.5', meta.dot)} />
    </span>
  );
}
