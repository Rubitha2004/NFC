import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ─── Ambient + Directional + Factory Spotlights ────────────────────────────
export function Lighting() {
  const spotRef1 = useRef<THREE.SpotLight>(null!);
  const spotRef2 = useRef<THREE.SpotLight>(null!);

  // Subtle flicker simulation on spot 2 (barely perceptible – industrial feel)
  useFrame(({ clock }) => {
    if (spotRef2.current) {
      spotRef2.current.intensity = 1.4 + Math.sin(clock.elapsedTime * 3.7) * 0.05;
    }
  });

  return (
    <>
      {/* Base ambient – keeps dark areas visible */}
      <ambientLight intensity={0.35} color="#e8f0fe" />

      {/* Key directional light – overhead factory light angle */}
      <directionalLight
        position={[8, 20, 8]}
        intensity={1.2}
        color="#ffffff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={60}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />

      {/* Fill light from opposite side – softens harsh shadows */}
      <directionalLight position={[-10, 12, -5]} intensity={0.5} color="#dce9ff" />

      {/* Section spotlights – industrial overhead look */}
      <spotLight
        ref={spotRef1}
        position={[0, 18, -9]}
        angle={0.5}
        penumbra={0.4}
        intensity={1.6}
        color="#ffffff"
        castShadow
        target-position={[0, 0, -9]}
      />
      <spotLight
        ref={spotRef2}
        position={[0, 18, 6]}
        angle={0.5}
        penumbra={0.4}
        intensity={1.4}
        color="#fff8e8"
        castShadow
        target-position={[0, 0, 6]}
      />

      {/* Subtle back rim light – gives 3D depth */}
      <directionalLight position={[0, 5, 20]} intensity={0.25} color="#1a237e" />
    </>
  );
}
