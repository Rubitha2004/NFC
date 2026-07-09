import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROOM_TYPE_META } from '../types/factory.types';
import type { FactoryRoom } from '../types/factory.types';
import { ProductionLine } from './ProductionLine';

interface RoomProps {
  room: FactoryRoom;
  roomIndex: number;
}

export const Room = memo(function Room({ room, roomIndex }: RoomProps) {
  const typeMeta  = ROOM_TYPE_META[room.roomType];
  const machines  = room.lines.flatMap((l) => l.machines);
  const total     = machines.length;
  const running   = machines.filter((m) => m.status === 'running').length;
  const offline   = machines.filter((m) => m.status === 'offline' || m.status === 'maintenance').length;

  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: roomIndex * 0.07 }}
      className={cn(
        // Physical wall feel: thick left border colored by roomType
        'relative rounded-xl border border-white/[0.08] border-l-4 bg-zinc-900/60 backdrop-blur-sm',
        'flex flex-col min-w-[480px]',
        typeMeta.borderAccent
      )}
    >
      {/* Room name plate header */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
        'w-full flex items-center justify-between px-4 py-3 rounded-t-xl border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors',
        typeMeta.headerBg
      )}>
        <div className="flex items-center gap-2.5">
          <div className="text-white/40">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </div>
          <span className={cn('w-2 h-2 rounded-full flex-shrink-0', typeMeta.dotColor)} />
          <div className="text-left">
            <h3 className="text-sm font-bold text-white leading-tight">{room.name}</h3>
            {room.description && (
              <p className="text-[10px] text-white/30 mt-0.5">{room.description}</p>
            )}
          </div>
        </div>

        {/* Room stats badges */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <RoomBadge label="Lines"    value={room.lines.length} />
          <RoomBadge label="Machines" value={total} />
          <RoomBadge label="🟢"        value={running} textClass="text-emerald-400" />
          {offline > 0 && <RoomBadge label="⚠"    value={offline}  textClass="text-red-400" />}
          <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-full', typeMeta.iconColor, 'bg-white/5')}>
            {typeMeta.label}
          </span>
        </div>
      </button>

      {/* Production lines */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-4 space-y-5 overflow-hidden"
          >
            {room.lines.map((line, lineIdx) => (
              <ProductionLine key={line.id} line={line} lineIndex={lineIdx} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

function RoomBadge({
  label, value, textClass = 'text-white/60',
}: { label: string; value: number; textClass?: string }) {
  return (
    <div className="flex items-center gap-1 bg-white/[0.05] rounded-md px-1.5 py-0.5">
      <span className={cn('text-[11px] font-bold', textClass)}>{value}</span>
      <span className="text-[10px] text-white/25">{label}</span>
    </div>
  );
}
