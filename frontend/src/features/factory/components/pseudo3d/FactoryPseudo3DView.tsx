import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';
import type { FactoryBuilding } from '../../types/factory.types';
import { Room3D } from './Room3D';
import { useFactoryStore } from '../../store/factory.store';
import { useFactoryData } from '../../hooks/useFactoryData';
import { useMouseParallax } from '../../hooks/useMouseParallax';

// ─── Building accent colors ───────────────────────────────────────────────────

const BUILDING_ACCENTS = [
  { top: '#3b82f6', rgb: '59, 130, 246' },  // blue — Building A
  { top: '#8b5cf6', rgb: '139, 92, 246' },  // violet — Building B
  { top: '#10b981', rgb: '16, 185, 129' },  // emerald — Building C
];

// ─── Root Pseudo-3D View ──────────────────────────────────────────────────────

export function FactoryPseudo3DView() {
  const { config }                       = useFactoryData();
  const { statusFilter, buildingFilter } = useFactoryStore();
  const tilt                             = useMouseParallax(2.2);

  const visibleBuildings =
    buildingFilter === 'all'
      ? config.buildings
      : config.buildings.filter((b) => b.id === buildingFilter);

  return (
    // Outer container: sets the CSS perspective depth
    <div
      className="flex-1 overflow-hidden"
      style={{ perspective: '2200px', perspectiveOrigin: '50% 0%' }}
    >
      {/* Inner: rotates with mouse parallax + has its own scroll */}
      <motion.div
        animate={{ rotateX: 5 + tilt.x, rotateY: tilt.y }}
        transition={{ type: 'spring', damping: 50, stiffness: 80 }}
        style={{
          transformOrigin: 'top center',
          transformStyle: 'preserve-3d',
          height: '100%',
          overflowY: 'auto',
        }}
      >
        {/* Grid floor texture visible between buildings */}
        <div
          className="p-5 space-y-7 min-w-max"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.024) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.024) 1px, transparent 1px)
            `,
            backgroundSize: '36px 36px',
          }}
        >
          {visibleBuildings.map((building, idx) => (
            <Building3DSection
              key={building.id}
              building={building}
              buildingIndex={idx}
              statusFilter={statusFilter}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Building Section (3D) ────────────────────────────────────────────────────

function Building3DSection({
  building, buildingIndex, statusFilter,
}: {
  building: FactoryBuilding;
  buildingIndex: number;
  statusFilter: string;
}) {
  const accent       = BUILDING_ACCENTS[buildingIndex % BUILDING_ACCENTS.length];
  const allMachines  = building.floors.flatMap((f) => f.rooms.flatMap((r) => r.lines.flatMap((l) => l.machines)));
  const totalFloors  = building.floors.length;
  const totalRooms   = building.floors.reduce((a, f) => a + f.rooms.length, 0);
  const running      = allMachines.filter((m) => m.status === 'running').length;
  const offline      = allMachines.filter((m) => m.status === 'offline' || m.status === 'maintenance').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: buildingIndex * 0.12, ease: [0.22, 1, 0.36, 1] }}
      style={{
        borderRadius: 20,
        border: '1px solid rgba(255,255,255,0.07)',
        borderTop: `2px solid ${accent.top}`,
        background: 'rgba(10,10,16,0.85)',
        boxShadow: `
          0 40px 100px rgba(0,0,0,0.75),
          0 8px 24px rgba(0,0,0,0.5),
          inset 0 1px 0 rgba(255,255,255,0.05),
          0 0 0 1px rgba(${accent.rgb},0.1)
        `,
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Building header */}
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: `linear-gradient(to right, rgba(${accent.rgb},0.08), transparent)`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 12,
            background: `rgba(${accent.rgb},0.12)`,
            border: `1px solid rgba(${accent.rgb},0.3)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Building2 style={{ width: 16, height: 16, color: accent.top }} />
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.92)', lineHeight: 1.2 }}>
              {building.name}
            </p>
            {building.description && (
              <p style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.28)', marginTop: 3 }}>
                {building.description}
              </p>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {[
            { label: 'Floors',   value: totalFloors },
            { label: 'Rooms',    value: totalRooms },
            { label: 'Machines', value: allMachines.length },
            { label: 'Running',  value: running,  color: '#10b981' },
            ...(offline > 0 ? [{ label: 'Issues', value: offline, color: '#ef4444' }] : []),
          ].map(({ label, value, color }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 16, fontWeight: 800, color: color ?? 'rgba(255,255,255,0.7)', lineHeight: 1 }}>
                {value}
              </p>
              <p style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.25)', marginTop: 2 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Floors */}
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {building.floors.map((floor, fIdx) => (
          <FloorLevel3DSection
            key={floor.id}
            floor={floor}
            floorIndex={fIdx}
            statusFilter={statusFilter}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Floor Level Section (3D) ─────────────────────────────────────────────────

function FloorLevel3DSection({
  floor, floorIndex, statusFilter,
}: {
  floor: ReturnType<typeof useFactoryData>['config']['buildings'][0]['floors'][0];
  floorIndex: number;
  statusFilter: string;
}) {
  const allMachines = floor.rooms.flatMap((r) => r.lines.flatMap((l) => l.machines));
  const running     = allMachines.filter((m) => m.status === 'running').length;

  return (
    <div
      style={{
        borderRadius: 14,
        border: '1px solid rgba(255,255,255,0.055)',
        background: 'rgba(16,16,24,0.55)',
        overflow: 'visible',
      }}
    >
      {/* Floor header */}
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          background: 'rgba(255,255,255,0.02)',
          borderRadius: '14px 14px 0 0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 24, height: 24, borderRadius: 7,
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.45)',
          }}>
            {floor.floorNumber}
          </div>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: 'rgba(255,255,255,0.45)' }}>
            {floor.name}
          </span>
        </div>
        <span style={{ fontSize: 10, color: '#10b981', opacity: 0.7 }}>{running} running</span>
      </div>

      {/* Rooms — side by side (floor plan) */}
      <div
        style={{
          padding: 16,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          alignItems: 'flex-start',
        }}
      >
        {floor.rooms.map((room, rIdx) => (
          <Room3D
            key={room.id}
            room={room}
            roomIndex={rIdx}
            statusFilter={statusFilter as any}
          />
        ))}
      </div>
    </div>
  );
}
