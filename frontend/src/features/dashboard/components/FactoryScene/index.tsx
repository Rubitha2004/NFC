import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { Lighting } from "./Lighting";
import { Floor } from "./Floor";
import { MachineUnit } from "../Machine/MachineUnit";
import { CameraController } from "../Camera/CameraController";
import { useMachineSelection } from "../../hooks/useMachineSelection";
import { SECTIONS } from "../../hooks/useFactoryData";
import type { MachineData } from "../../types/factory.types";
import { Html } from "@react-three/drei";

// ── Section label overlay ────────────────────────────────────────────────
function SectionLabel({ name, label, zOffset, accentHex }: {
  name: string; label: string; zOffset: number; accentHex: string;
}) {
  return (
    <Html position={[-17, 0.1, zOffset]} distanceFactor={20} zIndexRange={[5, 0]}>
      <div
        className="pointer-events-none select-none text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded whitespace-nowrap"
        style={{
          color: accentHex,
          background: "rgba(0,0,0,0.65)",
          border: `1px solid ${accentHex}44`,
          backdropFilter: "blur(4px)",
        }}
      >
        {label}
      </div>
    </Html>
  );
}

interface FactorySceneProps {
  machines: MachineData[];
}

export function FactoryScene({ machines }: FactorySceneProps) {
  const { selectedMachine, selectMachine } = useMachineSelection();
  const canvasRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={canvasRef} className="w-full h-full relative">
      <Canvas
        shadows
        camera={{ position: [0, 26, 22], fov: 55, near: 0.1, far: 200 }}
        gl={{ antialias: true, alpha: false }}
        onPointerMissed={() => selectMachine(null)}
        style={{ background: "#06111f" }}
      >
        {/* Scene environment */}
        <fog attach="fog" args={["#06111f", 35, 75]} />

        {/* Subtle starfield visible at high zoom-out */}
        <Stars radius={60} depth={30} count={600} factor={2} saturation={0} fade speed={0.3} />

        {/* Lighting */}
        <Lighting />

        {/* Factory Floor */}
        <Floor />

        {/* Section labels */}
        {SECTIONS.map((section) => (
          <SectionLabel
            key={section.name}
            name={section.name}
            label={section.label}
            zOffset={section.zOffset}
            accentHex={section.accentHex}
          />
        ))}

        {/* All 35 Machines */}
        {machines.map((machine) => (
          <MachineUnit
            key={machine.id}
            machine={machine}
            onSelect={selectMachine}
          />
        ))}

        {/* Camera controls with fly-to support */}
        <CameraController targetMachine={selectedMachine} />
      </Canvas>
    </div>
  );
}
