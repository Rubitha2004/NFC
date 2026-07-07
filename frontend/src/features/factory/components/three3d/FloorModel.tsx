import { Text } from '@react-three/drei';
import type { FactoryBuilding } from '../../types/factory.types';
import { RoomModel } from './RoomModel';

interface FloorModelProps {
  floor: FactoryBuilding['floors'][0];
  offsetY: number;
  statusFilter: string;
}

export function FloorModel({ floor, offsetY, statusFilter }: FloorModelProps) {
  // Simple transparent floor plate
  // Rooms laid out along Z axis
  return (
    <group position={[0, offsetY, 0]}>
      {/* Floor Plate */}
      <mesh position={[10, -0.1, 10]} receiveShadow>
        <boxGeometry args={[30, 0.2, 40]} />
        <meshStandardMaterial color="#1a1a24" transparent opacity={0.6} />
      </mesh>

      {/* Floor Label */}
      <Text
        position={[-4, 0.2, -8]}
        fontSize={1}
        color="#888888"
        anchorX="left"
        anchorY="bottom"
        rotation={[-Math.PI / 2, 0, 0]}
      >
        {floor.name}
      </Text>

      {/* Rooms */}
      {floor.rooms.map((room, rIdx) => (
        <RoomModel
          key={room.id}
          room={room}
          offsetZ={rIdx * 12} // 12 units gap between rooms along Z
          statusFilter={statusFilter}
        />
      ))}
    </group>
  );
}
