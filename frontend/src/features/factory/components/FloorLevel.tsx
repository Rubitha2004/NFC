import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { FactoryFloorLevel } from '../types/factory.types';
import { Room } from './Room';

interface FloorLevelProps {
  floor: FactoryFloorLevel;
  floorIndex: number;
}

export const FloorLevel = memo(function FloorLevel({ floor, floorIndex }: FloorLevelProps) {
  const totalMachines = floor.rooms.flatMap((r) => r.lines.flatMap((l) => l.machines)).length;
  const running       = floor.rooms.flatMap((r) => r.lines.flatMap((l) => l.machines)).filter((m) => m.status === 'running').length;

  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: floorIndex * 0.06 }}
      className="rounded-xl border border-white/[0.06] bg-zinc-900/30 overflow-hidden"
    >
      {/* Floor header */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-2.5 border-b border-white/[0.05] bg-zinc-900/50 hover:bg-zinc-800/50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="text-white/40">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </div>
          {/* Floor number pill */}
          <span className="w-6 h-6 rounded-md bg-white/[0.07] border border-white/[0.1] flex items-center justify-center text-[11px] font-bold text-white/50">
            {floor.floorNumber}
          </span>
          <span className="text-xs font-semibold text-white/50">{floor.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-white/25">{floor.rooms.length} rooms</span>
          <span className="text-[10px] text-white/25">·</span>
          <span className="text-[10px] text-white/25">{totalMachines} machines</span>
          <span className="text-[10px] text-white/25">·</span>
          <span className="text-[10px] text-emerald-400/70">{running} running</span>
        </div>
      </button>

      {/* Rooms — side-by-side (floor plan layout) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-4 flex flex-wrap gap-4 items-start"
          >
            {floor.rooms.map((room, roomIdx) => (
              <Room key={room.id} room={room} roomIndex={roomIdx} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});
