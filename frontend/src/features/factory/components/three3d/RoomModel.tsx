import { Text } from '@react-three/drei';
import type { FactoryRoom } from '../../types/factory.types';
import { ProductionLineModel } from './ProductionLineModel';

// Basic colors for room types
const ROOM_COLORS: Record<string, string> = {
  stitching: '#06b6d4',
  finishing: '#f59e0b',
  embroidery: '#8b5cf6',
  qc: '#10b981',
  packing: '#3b82f6',
  cutting: '#f97316',
};

interface RoomModelProps {
  room: FactoryRoom;
  offsetZ: number;
  statusFilter: string;
}

export function RoomModel({ room, offsetZ, statusFilter }: RoomModelProps) {
  const color = ROOM_COLORS[room.roomType] || '#888888';

  return (
    <group position={[0, 0, offsetZ]}>
      {/* Room Floor Boundary */}
      <mesh position={[10, 0, 4]} receiveShadow>
        <boxGeometry args={[28, 0.1, 10]} />
        <meshStandardMaterial color={color} transparent opacity={0.15} />
      </mesh>

      {/* Room Wall Accent (Back) */}
      <mesh position={[10, 1, -1]} castShadow receiveShadow>
        <boxGeometry args={[28, 2, 0.2]} />
        <meshStandardMaterial color={color} transparent opacity={0.4} />
      </mesh>

      {/* Room Label */}
      <Text
        position={[-3, 1, -0.8]}
        fontSize={0.8}
        color={color}
        anchorX="left"
        anchorY="middle"
      >
        {room.name}
      </Text>

      {/* Lines */}
      {room.lines.map((line, lIdx) => (
        <ProductionLineModel
          key={line.id}
          line={line}
          offsetX={lIdx * 10} // 10 units gap between lines along X
          statusFilter={statusFilter}
        />
      ))}
    </group>
  );
}
