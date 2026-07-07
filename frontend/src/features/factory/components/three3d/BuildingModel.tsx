import { Text } from '@react-three/drei';
import type { FactoryBuilding } from '../../types/factory.types';
import { FloorModel } from './FloorModel';

interface BuildingModelProps {
  building: FactoryBuilding;
  offset: number;
  statusFilter: string;
}

export function BuildingModel({ building, offset, statusFilter }: BuildingModelProps) {
  // Building label
  return (
    <group position={[offset, 0, 0]}>
      {/* Building Label */}
      <Text
        position={[0, building.floors.length * 6, -5]}
        fontSize={2}
        color="#ffffff"
        anchorX="left"
        anchorY="bottom"
        outlineWidth={0.1}
        outlineColor="#000000"
      >
        {building.name}
      </Text>

      {/* Floors */}
      {building.floors.map((floor, fIdx) => (
        <FloorModel
          key={floor.id}
          floor={floor}
          offsetY={fIdx * 6} // Stack floors on Y axis
          statusFilter={statusFilter}
        />
      ))}
    </group>
  );
}
