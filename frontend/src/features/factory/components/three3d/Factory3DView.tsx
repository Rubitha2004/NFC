import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import { useFactoryData } from '../../hooks/useFactoryData';
import { useFactoryStore } from '../../store/factory.store';
import { BuildingModel } from './BuildingModel';

export function Factory3DView() {
  const { config } = useFactoryData();
  const { buildingFilter, statusFilter } = useFactoryStore();

  const visibleBuildings =
    buildingFilter === 'all'
      ? config.buildings
      : config.buildings.filter((b) => b.id === buildingFilter);

  return (
    <div className="flex-1 w-full h-full relative bg-zinc-950">
      <Canvas
        camera={{ position: [0, 25, 40], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        shadows
      >
        {/* Environment & Lighting */}
        <color attach="background" args={['#09090b']} />
        <fog attach="fog" args={['#09090b', 30, 100]} />
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[20, 30, 20]}
          intensity={1.2}
          castShadow
          shadow-mapSize={2048}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.2} />

        {/* Render Buildings */}
        <group position={[-15, 0, 0]}>
          {visibleBuildings.map((building, idx) => (
            <BuildingModel
              key={building.id}
              building={building}
              offset={idx * 40} // 40 units gap between buildings
              statusFilter={statusFilter}
            />
          ))}
        </group>

        {/* Ground & Shadows */}
        <ContactShadows
          position={[0, -0.1, 0]}
          opacity={0.7}
          scale={150}
          blur={1.5}
          far={10}
        />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.11, 0]} receiveShadow>
          <planeGeometry args={[200, 200]} />
          <meshStandardMaterial color="#050505" />
        </mesh>

        {/* Grid helper */}
        <gridHelper args={[200, 100, '#111', '#0a0a0a']} position={[0, -0.1, 0]} />

        {/* Controls */}
        <OrbitControls
          makeDefault
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.1} // Prevent going below ground
          minDistance={10}
          maxDistance={150}
        />
      </Canvas>
    </div>
  );
}
