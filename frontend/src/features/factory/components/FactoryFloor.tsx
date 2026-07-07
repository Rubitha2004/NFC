import { motion } from 'framer-motion';
import { Factory, RefreshCw, ZoomIn, ZoomOut, Box, LayoutGrid, Cuboid } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MACHINE_STATUS_META, type MachineStatus } from '../types/factory.types';
import type { FactoryConfig, FactoryStats } from '../types/factory.types';
import { Building } from './Building';
import { MachineDetailsPanel } from './MachineDetailsPanel';
import { useFactoryStore } from '../store/factory.store';
import { useFactoryData } from '../hooks/useFactoryData';
import { FactoryPseudo3DView } from './pseudo3d/FactoryPseudo3DView';
import { Factory3DView } from './three3d/Factory3DView';

// ─── Root Factory Floor ───────────────────────────────────────────────────────

export function FactoryFloor() {
  const { config, stats } = useFactoryData();
  const { buildingFilter, zoom, setZoom, viewMode } = useFactoryStore();

  const visibleBuildings =
    buildingFilter === 'all'
      ? config.buildings
      : config.buildings.filter((b) => b.id === buildingFilter);

  return (
    <div className="relative flex flex-col h-full min-h-0 bg-zinc-950 text-white">

      {/* Control bar */}
      <FactoryHeader config={config} stats={stats} zoom={zoom} setZoom={setZoom} />

      {/* Filter bar */}
      <FilterBar stats={stats} config={config} />

      {/* Canvas */}
      {viewMode === '3d' ? (
        <Factory3DView />
      ) : viewMode === 'pseudo3d' ? (
        <FactoryPseudo3DView />
      ) : (
        <div className="flex-1 overflow-auto">
          <motion.div
            animate={{ scale: zoom }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{ transformOrigin: 'top left' }}
            className="p-5 space-y-6 min-w-max"
          >
            {visibleBuildings.map((building, idx) => (
              <Building key={building.id} building={building} buildingIndex={idx} />
            ))}
          </motion.div>
        </div>
      )}

      {/* Smart Inspector Panel — self-contained, reads from store */}
      <MachineDetailsPanel />
    </div>
  );
}

// ─── Factory Header ───────────────────────────────────────────────────────────

function FactoryHeader({
  config, stats, zoom, setZoom,
}: {
  config: FactoryConfig;
  stats: FactoryStats;
  zoom: number;
  setZoom: (z: number) => void;
}) {
  const { viewMode, setViewMode } = useFactoryStore();

  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.07] bg-zinc-950/90 backdrop-blur-sm flex-shrink-0">
      {/* Left: factory identity */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
          <Factory className="w-4 h-4 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-white leading-tight">{config.name}</h1>
          <p className="text-[10px] text-white/30">{config.location}</p>
        </div>
      </div>

      {/* Center: hierarchy stats */}
      <div className="hidden md:flex items-center gap-2">
        {[
          { label: 'Buildings', value: stats.totalBuildings },
          { label: 'Floors',    value: stats.totalFloors },
          { label: 'Rooms',     value: stats.totalRooms },
          { label: 'Lines',     value: stats.totalLines },
          { label: 'Machines',  value: stats.totalMachines },
          { label: 'Workers',   value: stats.activeWorkers, accent: true },
        ].map(({ label, value, accent }) => (
          <StatPill key={label} label={label} value={value} accent={accent} />
        ))}
      </div>

      {/* Right: live clock + view mode + zoom */}
      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-1.5 text-[10px] text-white/30">
          <RefreshCw className="w-3 h-3" />
          <span>Live · {new Date(config.lastUpdated).toLocaleTimeString()}</span>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-white/[0.05] border border-white/[0.09] rounded-lg p-0.5">
          <button
            onClick={() => setViewMode('2d')}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all',
              viewMode === '2d' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/70'
            )}
          >
            <LayoutGrid className="w-3 h-3" />
            2D
          </button>
          <button
            onClick={() => setViewMode('pseudo3d')}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all',
              viewMode === 'pseudo3d' ? 'bg-white/10 text-emerald-400 shadow-sm' : 'text-white/40 hover:text-white/70'
            )}
          >
            <Box className="w-3 h-3" />
            2.5D
          </button>
          <button
            onClick={() => setViewMode('3d')}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all',
              viewMode === '3d' ? 'bg-white/10 text-emerald-400 shadow-sm' : 'text-white/40 hover:text-white/70'
            )}
          >
            <Cuboid className="w-3 h-3" />
            True 3D
          </button>
        </div>

        <div className="flex items-center gap-1 bg-white/[0.05] border border-white/[0.09] rounded-lg px-2 py-1">
          <button
            onClick={() => setZoom(zoom - 0.1)}
            className="w-5 h-5 flex items-center justify-center text-white/40 hover:text-white transition-colors"
          >
            <ZoomOut className="w-3 h-3" />
          </button>
          <span className="text-[11px] text-white/35 font-mono w-9 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(zoom + 0.1)}
            className="w-5 h-5 flex items-center justify-center text-white/40 hover:text-white transition-colors"
          >
            <ZoomIn className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Filter Bar ───────────────────────────────────────────────────────────────

const STATUS_ORDER: MachineStatus[] = ['running', 'idle', 'offline', 'maintenance', 'no_worker'];

function FilterBar({ stats, config }: { stats: FactoryStats; config: FactoryConfig }) {
  const { statusFilter, setStatusFilter, buildingFilter, setBuildingFilter } = useFactoryStore();

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-5 py-2 border-b border-white/[0.06] bg-zinc-950/60 flex-shrink-0">

      {/* Status filter */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-white/20 mr-1">Status</span>
        <FilterChip
          active={statusFilter === 'all'}
          onClick={() => setStatusFilter('all')}
          label="All"
          count={stats.totalMachines}
        />
        {STATUS_ORDER.map((s) => {
          const m = MACHINE_STATUS_META[s];
          return (
            <FilterChip
              key={s}
              active={statusFilter === s}
              onClick={() => setStatusFilter(s)}
              label={m.label}
              count={stats.byStatus[s]}
              dotClass={m.dot}
              activeClass={cn(m.bg, m.border, m.color)}
            />
          );
        })}
      </div>

      {/* Divider */}
      <div className="w-px h-4 bg-white/[0.08]" />

      {/* Building filter */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-white/20 mr-1">Building</span>
        <FilterChip
          active={buildingFilter === 'all'}
          onClick={() => setBuildingFilter('all')}
          label="All"
        />
        {config.buildings.map((b) => (
          <FilterChip
            key={b.id}
            active={buildingFilter === b.id}
            onClick={() => setBuildingFilter(b.id)}
            label={b.name}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Shared UI Atoms ──────────────────────────────────────────────────────────

function StatPill({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.08] rounded-lg px-2.5 py-1.5">
      <span className={cn('text-sm font-bold', accent ? 'text-emerald-400' : 'text-white/70')}>{value}</span>
      <span className="text-[11px] text-white/25">{label}</span>
    </div>
  );
}

function FilterChip({
  active, onClick, label, count, dotClass, activeClass,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count?: number;
  dotClass?: string;
  activeClass?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all duration-150',
        active
          ? activeClass ?? 'bg-white/[0.09] border-white/20 text-white'
          : 'bg-transparent border-transparent text-white/35 hover:text-white/60 hover:border-white/[0.08]'
      )}
    >
      {dotClass && <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', dotClass)} />}
      {label}
      {count !== undefined && (
        <span className={cn(
          'text-[10px] font-bold rounded-full px-1 min-w-[16px] text-center',
          active ? 'bg-white/20' : 'bg-white/[0.08]'
        )}>
          {count}
        </span>
      )}
    </button>
  );
}
