import { memo } from 'react';
import { motion } from 'framer-motion';
import type { FactoryRoom, RoomType, MachineStatus } from '../../types/factory.types';
import { ProductionLine3D } from './ProductionLine3D';

// ─── Room type raw colors (for inline gradients / shadows) ───────────────────

const ROOM_TYPE_RGB: Record<RoomType, string> = {
  stitching:  '6, 182, 212',
  finishing:  '245, 158, 11',
  embroidery: '139, 92, 246',
  qc:         '16, 185, 129',
  packing:    '59, 130, 246',
  cutting:    '249, 115, 22',
};

const ROOM_TYPE_HEX: Record<RoomType, string> = {
  stitching:  '#06b6d4',
  finishing:  '#f59e0b',
  embroidery: '#8b5cf6',
  qc:         '#10b981',
  packing:    '#3b82f6',
  cutting:    '#f97316',
};

interface Room3DProps {
  room: FactoryRoom;
  roomIndex: number;
  statusFilter: MachineStatus | 'all';
}

export const Room3D = memo(function Room3D({ room, roomIndex, statusFilter }: Room3DProps) {
  const rgb       = ROOM_TYPE_RGB[room.roomType];
  const hex       = ROOM_TYPE_HEX[room.roomType];
  const machines  = room.lines.flatMap((l) => l.machines);
  const total     = machines.length;
  const running   = machines.filter((m) => m.status === 'running').length;
  const offline   = machines.filter((m) => m.status === 'offline' || m.status === 'maintenance').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: roomIndex * 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{
        minWidth: 490,
        borderRadius: 16,
        borderLeft: `5px solid ${hex}`,
        border: `1px solid rgba(255,255,255,0.07)`,
        borderLeftColor: hex,
        borderLeftWidth: 5,
        // Layered room background: darker "back wall" fades to slightly lighter "floor"
        background: `
          linear-gradient(
            to bottom,
            rgba(${rgb}, 0.07) 0%,
            rgba(14, 14, 20, 0.92) 18%,
            rgba(18, 18, 26, 0.88) 50%,
            rgba(22, 22, 32, 0.80) 100%
          )
        `,
        boxShadow: `
          0 24px 64px rgba(0,0,0,0.65),
          0 4px 12px rgba(0,0,0,0.4),
          inset 0 1px 0 rgba(255,255,255,0.05),
          0 0 0 1px rgba(${rgb},0.12)
        `,
      }}
    >
      {/* ── Back wall / name plate ── */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: `1px solid rgba(${rgb}, 0.18)`,
          background: `linear-gradient(to right, rgba(${rgb}, 0.14), rgba(${rgb}, 0.04), transparent)`,
          borderRadius: '12px 12px 0 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Type indicator dot */}
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: hex,
            boxShadow: `0 0 8px ${hex}`,
            flexShrink: 0,
          }} />
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.9)', lineHeight: 1.2 }}>
              {room.name}
            </p>
            {room.description && (
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
                {room.description}
              </p>
            )}
          </div>
        </div>

        {/* Room stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <RoomStat label="Lines" value={room.lines.length}  />
          <RoomStat label="Machines" value={total}  />
          <RoomStatBubble value={running} label="🟢" color="#10b981" />
          {offline > 0 && <RoomStatBubble value={offline} label="⚠" color="#ef4444" />}
          <span style={{
            fontSize: 10, fontWeight: 600,
            color: hex,
            background: `rgba(${rgb},0.12)`,
            padding: '2px 8px', borderRadius: 20,
          }}>
            {room.roomType.charAt(0).toUpperCase() + room.roomType.slice(1)}
          </span>
        </div>
      </div>

      {/* ── Room interior — production lines ── */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {room.lines.map((line, lineIdx) => (
          <ProductionLine3D
            key={line.id}
            line={line}
            lineIndex={lineIdx}
            statusFilter={statusFilter}
          />
        ))}
      </div>

      {/* ── Floor reflection strip at bottom ── */}
      <div
        style={{
          height: 4,
          borderRadius: '0 0 12px 12px',
          background: `linear-gradient(to right, transparent, rgba(${rgb},0.25), transparent)`,
        }}
      />
    </motion.div>
  );
});

// ─── Room stat helpers ────────────────────────────────────────────────────────

function RoomStat({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.65)', lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', marginTop: 1 }}>{label}</p>
    </div>
  );
}

function RoomStatBubble({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 4,
      background: 'rgba(255,255,255,0.05)',
      borderRadius: 6, padding: '2px 6px',
    }}>
      <span style={{ fontSize: 11, fontWeight: 700, color }}>{value}</span>
      <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>{label}</span>
    </div>
  );
}
