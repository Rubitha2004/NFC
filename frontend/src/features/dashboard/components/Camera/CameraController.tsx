import { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useMachineSelection } from "../../hooks/useMachineSelection";
import type { MachineData } from "../../types/factory.types";

interface CameraControllerProps {
  targetMachine: MachineData | null;
}

export function CameraController({ targetMachine }: CameraControllerProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null!);
  const { camera } = useThree();
  const isFlying = useRef(false);
  const flyTarget = useRef<THREE.Vector3 | null>(null);
  const flyLookAt = useRef<THREE.Vector3 | null>(null);

  // Default camera position (bird's eye overview)
  const DEFAULT_CAMERA = new THREE.Vector3(0, 26, 22);
  const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);

  useEffect(() => {
    // Initial camera position
    camera.position.copy(DEFAULT_CAMERA);
    if (controlsRef.current) {
      controlsRef.current.target.copy(DEFAULT_TARGET);
      controlsRef.current.update();
    }
  }, []);

  // Fly-to when machine selected
  useEffect(() => {
    if (!targetMachine) return;
    const [mx, , mz] = targetMachine.position;

    flyTarget.current = new THREE.Vector3(mx, 8, mz + 10);
    flyLookAt.current = new THREE.Vector3(mx, 0, mz);
    isFlying.current  = true;
  }, [targetMachine?.id]);

  useFrame(() => {
    if (!isFlying.current || !flyTarget.current || !flyLookAt.current) return;

    // Lerp camera position
    camera.position.lerp(flyTarget.current, 0.06);

    // Lerp orbit controls target
    if (controlsRef.current) {
      controlsRef.current.target.lerp(flyLookAt.current, 0.06);
      controlsRef.current.update();
    }

    // Stop flying when close enough
    if (camera.position.distanceTo(flyTarget.current) < 0.15) {
      camera.position.copy(flyTarget.current);
      isFlying.current = false;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan
      enableZoom
      enableRotate
      minDistance={4}
      maxDistance={60}
      maxPolarAngle={Math.PI / 2.1}
      dampingFactor={0.08}
      enableDamping
    />
  );
}

// Hook to trigger camera reset from UI
export function useResetCamera() {
  const { camera } = useThree();
  const selection = useMachineSelection();

  return () => {
    selection.selectMachine(null);
    const target = new THREE.Vector3(0, 26, 22);
    camera.position.lerp(target, 1);
  };
}
