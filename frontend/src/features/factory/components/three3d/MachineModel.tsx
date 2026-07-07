import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Edges } from '@react-three/drei';
import type { Mesh } from 'three';
import type { Machine, MachineStatus } from '../../types/factory.types';
import { useFactoryStore } from '../../store/factory.store';

// ─── Status Colors for 3D ─────────────────────────────────────────────────────

const STATUS_COLOR: Record<MachineStatus, string> = {
  running: '#10b981',
  idle: '#f59e0b',
  offline: '#ef4444',
  maintenance: '#8b5cf6',
  no_worker: '#71717a',
};

interface MachineModelProps {
  machine: Machine;
  position: [number, number, number];
  statusFilter: string;
}

export function MachineModel({ machine, position, statusFilter }: MachineModelProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  const { selectedMachineId, selectMachine } = useFactoryStore();
  const isSelected = selectedMachineId === machine.id;
  const isDimmed = statusFilter !== 'all' && machine.status !== statusFilter;
  
  const color = STATUS_COLOR[machine.status];
  const isRunning = machine.status === 'running';

  // Floating animation for running machines
  useFrame((state) => {
    if (meshRef.current && isRunning && !isDimmed) {
      const time = state.clock.getElapsedTime();
      const offset = parseInt(machine.id.replace(/\D/g, '')) || 0;
      meshRef.current.position.y = position[1] + Math.sin(time * 2 + offset) * 0.1;
    } else if (meshRef.current) {
      // Reset position if not running or if dimmed
      meshRef.current.position.y = position[1];
    }
  });

  return (
    <group position={position} scale={isDimmed ? 0.9 : (hovered || isSelected ? 1.1 : 1)}>
      {/* Machine Box */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          selectMachine(isSelected ? null : machine.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 0.8 : hovered ? 0.4 : isRunning ? 0.2 : 0}
          transparent
          opacity={isDimmed ? 0.15 : 1}
        />
        {(hovered || isSelected) && (
          <Edges scale={1.05} threshold={15} color="white" />
        )}
      </mesh>

      {/* HTML Hover Label */}
      {(hovered || isSelected) && !isDimmed && (
        <Html position={[0, 1.2, 0]} center zIndexRange={[100, 0]}>
          <div className="bg-zinc-900/95 border border-zinc-700 rounded-lg px-2 py-1 flex flex-col items-center pointer-events-none shadow-xl backdrop-blur-md min-w-[80px]">
            <span className="text-[10px] font-bold text-white mb-0.5">{machine.machineNumber}</span>
            {machine.worker ? (
              <span className="text-[9px] text-zinc-300 truncate max-w-[100px]">
                {machine.worker.name.split(' ')[0]}
              </span>
            ) : (
              <span className="text-[9px] text-zinc-500">No Worker</span>
            )}
            <div
              className="mt-1 h-[2px] w-full"
              style={{ background: color }}
            />
          </div>
        </Html>
      )}
    </group>
  );
}
