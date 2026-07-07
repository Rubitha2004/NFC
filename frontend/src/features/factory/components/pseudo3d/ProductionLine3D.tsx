import { memo } from 'react';
import { cn } from '@/lib/utils';
import type { ProductionLine, MachineStatus } from '../../types/factory.types';
import { MachineCard3D } from './MachineCard3D';

interface ProductionLine3DProps {
  line: ProductionLine;
  lineIndex: number;
  statusFilter: MachineStatus | 'all';
}

export const ProductionLine3D = memo(function ProductionLine3D({
  line, statusFilter,
}: ProductionLine3DProps) {
  const topMachines    = line.machines.filter((m) => m.position.row === 'top');
  const bottomMachines = line.machines.filter((m) => m.position.row === 'bottom');

  return (
    <div>
      {/* Line label */}
      <div className="flex items-center gap-2 mb-2.5">
        <span
          className="text-[10px] font-bold text-white/40 px-2 py-0.5 rounded-md"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {line.lineNumber}
        </span>
        <span className="text-[11px] font-semibold text-white/50">{line.lineName}</span>
        <span className="text-[10px] text-white/20 ml-auto">{line.machines.length} machines</span>
      </div>

      {/* Line body */}
      <div
        className="rounded-2xl overflow-visible"
        style={{
          background: 'rgba(20,20,28,0.70)',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
      >
        {/* TOP ROW — machines on the far side of the table */}
        <div className={cn(
          'px-4 pt-4 pb-2 flex flex-wrap gap-3',
          topMachines.length === 0 && 'hidden'
        )}>
          {topMachines
            .sort((a, b) => a.position.index - b.position.index)
            .map((machine) => (
              <MachineCard3D key={machine.id} machine={machine} statusFilter={statusFilter} />
            ))}
        </div>

        {/* PRODUCTION TABLE — the physical sewing table between the two rows */}
        <ProductionTable3D machineCount={Math.max(topMachines.length, bottomMachines.length)} />

        {/* BOTTOM ROW — machines on the near side of the table */}
        <div className={cn(
          'px-4 pt-2 pb-4 flex flex-wrap gap-3',
          bottomMachines.length === 0 && 'hidden'
        )}>
          {bottomMachines
            .sort((a, b) => a.position.index - b.position.index)
            .map((machine) => (
              <MachineCard3D key={machine.id} machine={machine} statusFilter={statusFilter} />
            ))}
        </div>
      </div>
    </div>
  );
});

// ─── Production Table 3D ─────────────────────────────────────────────────────

function ProductionTable3D({ machineCount }: { machineCount: number }) {
  return (
    <div className="mx-4 my-1 flex flex-col select-none">
      {/* Walking path (top aisle) */}
      <AisleStrip />

      {/* Table top surface — wood grain look */}
      <div
        style={{
          height: 20,
          borderRadius: '6px 6px 0 0',
          background: 'linear-gradient(135deg, #57473a 0%, #4a3c30 25%, #5c4d3f 50%, #4a3c30 75%, #57473a 100%)',
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.08), inset 0 -1px 2px rgba(0,0,0,0.4)',
        }}
      />

      {/* Table front face — visible depth edge */}
      <div
        style={{
          height: 18,
          borderRadius: '0 0 6px 6px',
          background: 'linear-gradient(to bottom, #2e2318, #1a1510)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.75), 0 4px 8px rgba(0,0,0,0.5)',
        }}
      />

      {/* Walking path (bottom aisle) */}
      <AisleStrip />
    </div>
  );
}

// ─── Aisle / Walking Path Strip ───────────────────────────────────────────────

function AisleStrip() {
  return (
    <div
      style={{
        height: 14,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.35))',
      }}
    >
      {/* Dotted floor marking line */}
      {Array.from({ length: 18 }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 10, height: 1.5,
            background: 'rgba(255,255,255,0.10)',
            borderRadius: 1,
          }}
        />
      ))}
    </div>
  );
}
