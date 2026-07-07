import { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ProductionLine as ProductionLineType } from '../types/factory.types';
import { MachineCard } from './MachineCard';
import { useFactoryStore } from '../store/factory.store';

interface ProductionLineProps {
  line: ProductionLineType;
  lineIndex: number;
}

export const ProductionLine = memo(function ProductionLine({
  line,
  lineIndex,
}: ProductionLineProps) {
  const { statusFilter } = useFactoryStore();

  // Split machines into top and bottom rows by their position.row field
  const topMachines = line.machines.filter((m) => m.position.row === 'top');
  const bottomMachines = line.machines.filter((m) => m.position.row === 'bottom');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: lineIndex * 0.08 }}
      className="relative"
    >
      {/* Line header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white/60">
            {line.lineNumber}
          </span>
          <span className="text-xs font-semibold text-white/50">{line.lineName}</span>
        </div>
        <div className="flex-1 h-px bg-white/[0.05]" />
        <span className="text-[10px] text-white/30 font-mono">
          {line.machines.length} machines
        </span>
      </div>

      {/* Production line body */}
      <div className="relative rounded-2xl border border-white/[0.07] bg-zinc-900/60 backdrop-blur-sm overflow-visible">
        {/* Top row of machines */}
        <div className="px-4 pt-4 pb-2 flex flex-wrap gap-3">
          {topMachines
            .sort((a, b) => a.position.index - b.position.index)
            .map((machine) => (
              <MachineCard
                key={machine.id}
                machine={machine}
                statusFilter={statusFilter}
              />
            ))}
        </div>

        {/* Central table / walking path */}
        <ProductionTable machineCount={Math.max(topMachines.length, bottomMachines.length)} />

        {/* Bottom row of machines */}
        <div className="px-4 pt-2 pb-4 flex flex-wrap gap-3">
          {bottomMachines
            .sort((a, b) => a.position.index - b.position.index)
            .map((machine) => (
              <MachineCard
                key={machine.id}
                machine={machine}
                statusFilter={statusFilter}
              />
            ))}
        </div>
      </div>
    </motion.div>
  );
});

// ─── Production Table Visual ──────────────────────────────────────────────────

function ProductionTable({ machineCount }: { machineCount: number }) {
  // Approximate visual width based on machine count
  const approxWidth = machineCount * 95 + 32;

  return (
    <div
      className="mx-4 my-0 flex flex-col gap-px overflow-hidden rounded-lg"
      style={{ minWidth: Math.max(approxWidth, 300) }}
    >
      {/* Table top surface */}
      <div
        className={cn(
          'h-2 rounded-t-md',
          'bg-gradient-to-r from-zinc-700/40 via-zinc-600/60 to-zinc-700/40'
        )}
      />
      {/* Walking path */}
      <div className="h-5 bg-gradient-to-r from-zinc-900/0 via-white/[0.02] to-zinc-900/0 flex items-center justify-center">
        <div className="flex gap-2">
          {Array.from({ length: Math.min(machineCount * 2, 20) }).map((_, i) => (
            <span
              key={i}
              className="w-3 h-px bg-white/10"
            />
          ))}
        </div>
      </div>
      {/* Table bottom surface */}
      <div className="h-2 rounded-b-md bg-gradient-to-r from-zinc-700/40 via-zinc-600/60 to-zinc-700/40" />
    </div>
  );
}
