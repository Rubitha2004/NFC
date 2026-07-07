import * as THREE from "three";
import { SECTIONS } from "../../hooks/useFactoryData";

const FLOOR_W = 38;
const FLOOR_D = 36;

// Grid line material
// const gridMaterial = new THREE.LineBasicMaterial({
//   color: "#1e3a5f",
//   transparent: true,
//   opacity: 0.35,
// });

// Section divider material
const dividerMaterial = new THREE.LineBasicMaterial({
  color: "#2d4a6e",
  transparent: true,
  opacity: 0.6,
});

export function Floor() {
  return (
    <group>
      {/* ── Main floor plane ─────────────────────────────────────── */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[FLOOR_W, FLOOR_D, 1, 1]} />
        <meshStandardMaterial
          color="#0a1628"
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>

      {/* ── Grid overlay ─────────────────────────────────────────── */}
      <gridHelper
        args={[FLOOR_W, 20, "#0d2040", "#0d2040"]}
        position={[0, 0, 0]}
      />

      {/* ── Section labels (3D text via Html overlay) ───────────── */}
      {/* Handled in HTML overlay layer below the canvas */}

      {/* ── Section divider lines ────────────────────────────────── */}
      {SECTIONS.slice(0, -1).map((section, i) => {
        const zMid = section.zOffset + (SECTIONS[i + 1]?.zOffset ?? section.zOffset + 6) - 3;
        const points = [
          new THREE.Vector3(-FLOOR_W / 2, 0.02, zMid),
          new THREE.Vector3(FLOOR_W / 2,  0.02, zMid),
        ];
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        return (
          <primitive key={section.name} object={new THREE.Line(geo, dividerMaterial)} />
        );
      })}

      {/* ── Subtle edge border ───────────────────────────────────── */}
      {[
        [-FLOOR_W / 2, FLOOR_D / 2],
        [FLOOR_W / 2, FLOOR_D / 2],
        [FLOOR_W / 2, -FLOOR_D / 2],
        [-FLOOR_W / 2, -FLOOR_D / 2],
        [-FLOOR_W / 2, FLOOR_D / 2],
      ].reduce<THREE.Vector3[][]>((acc, [x, z], idx, arr) => {
        if (idx > 0) {
          acc.push([
            new THREE.Vector3(arr[idx - 1][0], 0.02, arr[idx - 1][1]),
            new THREE.Vector3(x, 0.02, z),
          ]);
        }
        return acc;
      }, []).map((pts, i) => {
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        return (
          <primitive key={i} object={new THREE.Line(geo, dividerMaterial)} />
        );
      })}
    </group>
  );
}
