import { memo } from 'react';
import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FactoryBuilding } from '../types/factory.types';
import { FloorLevel } from './FloorLevel';

interface BuildingProps {
  building: FactoryBuilding;
  buildingIndex: number;
}

const BUILDING_TOP_ACCENTS = [
  'border-t-blue-500/60',
  'border-t-violet-500/60',
  'border-t-emerald-500/60',
  'border-t-amber-500/60',
];

const BUILDING_ICON_STYLES = [
  'bg-blue-500/10 border-blue-500/30 text-blue-400',
  'bg-violet-500/10 border-violet-500/30 text-violet-400',
  'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
  'bg-amber-500/10 border-amber-500/30 text-amber-400',
];

export const Building = memo(function Building({ building, buildingIndex }: BuildingProps) {
  const allMachines = building.floors.flatMap((f) => f.rooms.flatMap((r) => r.lines.flatMap((l) => l.machines)));
  const totalFloors = building.floors.length;
  const totalRooms  = building.floors.reduce((a, f) => a + f.rooms.length, 0);
  const running     = allMachines.filter((m) => m.status === 'running').length;
  const offline     = allMachines.filter((m) => m.status === 'offline' || m.status === 'maintenance').length;

  const topAccent  = BUILDING_TOP_ACCENTS[buildingIndex % BUILDING_TOP_ACCENTS.length];
  const iconStyle  = BUILDING_ICON_STYLES[buildingIndex % BUILDING_ICON_STYLES.length];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: buildingIndex * 0.1 }}
      className={cn(
        'rounded-2xl border-t-2 border border-white/[0.07] bg-zinc-950/60 backdrop-blur-sm',
        topAccent
      )}
    >
      {/* Building header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
        <div className="flex items-center gap-3">
          <div className={cn('w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0', iconStyle)}>
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white leading-tight">{building.name}</h2>
            {building.description && (
              <p className="text-[11px] text-white/30 mt-0.5">{building.description}</p>
            )}
          </div>
        </div>

        {/* Building stats */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <BuildingStat label="Floors"   value={totalFloors} />
          <BuildingStat label="Rooms"    value={totalRooms} />
          <BuildingStat label="Machines" value={allMachines.length} />
          <BuildingStat label="Running"  value={running}  accent="text-emerald-400" />
          {offline > 0 && <BuildingStat label="Issues" value={offline} accent="text-red-400" />}
        </div>
      </div>

      {/* Floors */}
      <div className="p-4 space-y-4">
        {building.floors.map((floor, floorIdx) => (
          <FloorLevel key={floor.id} floor={floor} floorIndex={floorIdx} />
        ))}
      </div>
    </motion.section>
  );
});

function BuildingStat({
  label, value, accent = 'text-white/60',
}: { label: string; value: number; accent?: string }) {
  return (
    <div className="text-center">
      <p className={cn('text-lg font-bold leading-none', accent)}>{value}</p>
      <p className="text-[10px] text-white/25 mt-0.5">{label}</p>
    </div>
  );
}
