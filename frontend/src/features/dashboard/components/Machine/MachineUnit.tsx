import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { MachineData, MachineStatus } from "../../types/factory.types";
import { useMachineSelection } from "../../hooks/useMachineSelection";

// ── Status color map ────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<MachineStatus, {
  color: string;
  emissive: string;
  emissiveIntensity: number;
  glowColor: string;
  label: string;
  dotColor: string;
}> = {
  running:     { color: "#1a3a2a", emissive: "#00c853", emissiveIntensity: 0.12, glowColor: "#00e676", label: "Running",     dotColor: "bg-green-400"  },
  idle:        { color: "#2a2a18", emissive: "#ffab00", emissiveIntensity: 0.10, glowColor: "#ffd740", label: "Idle",        dotColor: "bg-yellow-400" },
  offline:     { color: "#2a1515", emissive: "#d32f2f", emissiveIntensity: 0.15, glowColor: "#ff5252", label: "Offline",     dotColor: "bg-red-400"    },
  maintenance: { color: "#2a1e10", emissive: "#e65100", emissiveIntensity: 0.12, glowColor: "#ff9100", label: "Maintenance", dotColor: "bg-orange-400" },
  unassigned:  { color: "#1e1e1e", emissive: "#424242", emissiveIntensity: 0.05, glowColor: "#757575", label: "Unassigned",  dotColor: "bg-gray-400"   },
};

interface MachineUnitProps {
  machine: MachineData;
  onSelect: (machine: MachineData) => void;
}

export function MachineUnit({ machine, onSelect }: MachineUnitProps) {
  const meshRef      = useRef<THREE.Mesh>(null!);
  const glowRef      = useRef<THREE.Mesh>(null!);
  const motorRef     = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered]   = useState(false);
  const { selectedMachine, searchTargetId } = useMachineSelection();

  const cfg      = STATUS_CONFIG[machine.status];
  const isSelected  = selectedMachine?.id === machine.id;
  const isSearchHit = searchTargetId === machine.id;

  // ── Animate per frame ───────────────────────────────────────────────────
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;

    if (!meshRef.current) return;

    // Running: slight vibration + bounce
    if (machine.status === "running") {
      meshRef.current.position.y = 0.5 + Math.sin(t * 18 + machine.numericId) * 0.004;
      meshRef.current.rotation.z = Math.sin(t * 15 + machine.numericId * 0.7) * 0.003;
      if (motorRef.current) motorRef.current.rotation.y = t * 4;
    }

    // Glow pulse
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshStandardMaterial;
      const base = cfg.emissiveIntensity;

      if (machine.status === "running")     mat.emissiveIntensity = base + Math.sin(t * 2.5) * 0.08;
      else if (machine.status === "idle")   mat.emissiveIntensity = base + Math.sin(t * 1.2) * 0.06;
      else if (machine.status === "offline") mat.emissiveIntensity = base + (Math.sin(t * 4) > 0 ? 0.15 : 0);

      // Search hit – blue pulse
      if (isSearchHit) {
        mat.emissive.set("#2196f3");
        mat.emissiveIntensity = 0.25 + Math.sin(t * 3) * 0.1;
      }
    }

    // Hover / selected: lift
    if (meshRef.current) {
      const targetY = (hovered || isSelected) ? 0.65 : 0.5;
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.1);
    }
  });

  const [px, , pz] = machine.position;

  return (
    <group position={[px, 0, pz]}>
      {/* ── Machine body ──────────────────────────────────────── */}
      <mesh
        ref={meshRef}
        position={[0, 0.5, 0]}
        castShadow
        receiveShadow
        onClick={(e) => { e.stopPropagation(); onSelect(machine); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = "default"; }}
      >
        <boxGeometry args={[1.6, 1.0, 1.2]} />
        <meshStandardMaterial
          color={hovered || isSelected ? "#1a2a4a" : cfg.color}
          emissive={cfg.emissive}
          emissiveIntensity={cfg.emissiveIntensity}
          roughness={0.45}
          metalness={0.6}
        />
      </mesh>

      {/* ── Glow shell (slightly bigger, semi-transparent) ─────── */}
      <mesh ref={glowRef} position={[0, 0.5, 0]}>
        <boxGeometry args={[1.68, 1.08, 1.28]} />
        <meshStandardMaterial
          color={cfg.glowColor}
          emissive={cfg.glowColor}
          emissiveIntensity={cfg.emissiveIntensity}
          transparent
          opacity={0.06}
          depthWrite={false}
        />
      </mesh>

      {/* ── Machine top surface (control panel look) ───────────── */}
      <mesh position={[0, 1.02, -0.15]} rotation={[-0.25, 0, 0]}>
        <boxGeometry args={[1.4, 0.04, 0.7]} />
        <meshStandardMaterial color="#263238" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* ── Motor / rotating part (running only) ───────────────── */}
      {machine.status === "running" && (
        <mesh ref={motorRef} position={[0.6, 1.05, 0.3]}>
          <cylinderGeometry args={[0.12, 0.12, 0.22, 8]} />
          <meshStandardMaterial color={cfg.glowColor} emissive={cfg.glowColor} emissiveIntensity={0.5} metalness={0.7} roughness={0.2} />
        </mesh>
      )}

      {/* ── Selection / hover ring ─────────────────────────────── */}
      {(isSelected || isSearchHit) && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.95, 1.1, 32]} />
          <meshStandardMaterial
            color={isSearchHit ? "#2196f3" : "#ffffff"}
            emissive={isSearchHit ? "#2196f3" : "#ffffff"}
            emissiveIntensity={0.6}
            transparent
            opacity={0.7}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* ── HTML Overlay: Machine Label ────────────────────────── */}
      <Html
        position={[0, 1.8, 0]}
        center
        distanceFactor={14}
        zIndexRange={[10, 0]}
        occlude={false}
      >
        <div className="pointer-events-none select-none text-center" style={{ width: 68 }}>
          {/* Machine ID */}
          <div
            className="text-[9px] font-bold tracking-widest px-1.5 py-0.5 rounded-md mb-0.5"
            style={{
              background: "rgba(0,0,0,0.75)",
              color: hovered || isSelected ? "#60a5fa" : "#e2e8f0",
              border: isSelected ? "1px solid #60a5fa" : "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(4px)",
            }}
          >
            {machine.id}
          </div>

          {/* Worker initials bubble */}
          {machine.worker && (
            <div
              className="text-[8px] font-semibold mx-auto w-fit px-1.5 py-0.5 rounded-full"
              style={{
                background: "rgba(37,99,235,0.85)",
                color: "#fff",
                border: "1px solid rgba(96,165,250,0.4)",
              }}
            >
              {machine.worker.initials}
            </div>
          )}

          {/* Status dot */}
          <div className="flex items-center justify-center gap-1 mt-0.5">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: machine.status === "running" ? "#4ade80"
                  : machine.status === "idle" ? "#facc15"
                  : machine.status === "offline" ? "#f87171"
                  : machine.status === "maintenance" ? "#fb923c"
                  : "#9ca3af",
                boxShadow: machine.status === "running" ? "0 0 4px #4ade80" : "none",
              }}
            />
          </div>
        </div>
      </Html>

      {/* ── Hover Tooltip ────────────────────────────────────────── */}
      {hovered && !isSelected && (
        <Html position={[1.2, 1.2, 0]} distanceFactor={14} zIndexRange={[20, 0]}>
          <div
            className="pointer-events-none select-none text-xs rounded-xl p-3 w-44 shadow-2xl"
            style={{
              background: "rgba(10, 22, 40, 0.96)",
              border: "1px solid rgba(96,165,250,0.3)",
              backdropFilter: "blur(12px)",
              color: "#e2e8f0",
            }}
          >
            <div className="font-bold text-blue-400 mb-2">{machine.id}</div>
            {machine.worker ? (
              <>
                <div className="text-[10px] font-semibold text-white">{machine.worker.name}</div>
                <div className="text-[9px] text-slate-400 mt-0.5">{machine.worker.department}</div>
                <div className="text-[9px] text-slate-400">{machine.worker.grade} · {machine.worker.shift}</div>
              </>
            ) : (
              <div className="text-[9px] text-slate-400">No worker assigned</div>
            )}
            {machine.bundle && (
              <>
                <div className="border-t border-white/10 mt-2 pt-2 text-[9px] text-slate-300">
                  <span className="text-cyan-400">Bundle:</span> {machine.bundle.bundleNumber}
                </div>
                <div className="text-[9px] text-slate-400">{machine.bundle.operation}</div>
              </>
            )}
            <div className="mt-2 flex items-center justify-between text-[9px]">
              <span className="text-slate-400">Status</span>
              <span
                className="font-semibold"
                style={{ color: cfg.glowColor }}
              >
                {cfg.label}
              </span>
            </div>
            {machine.status === "running" && (
              <div className="mt-1 flex items-center justify-between text-[9px]">
                <span className="text-slate-400">Efficiency</span>
                <span className="text-green-400 font-semibold">{machine.efficiency}%</span>
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}
