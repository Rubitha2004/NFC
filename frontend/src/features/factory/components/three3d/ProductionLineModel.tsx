import { Text } from '@react-three/drei';
import type { ProductionLine } from '../../types/factory.types';
import { MachineModel } from './MachineModel';

interface ProductionLineModelProps {
  line: ProductionLine;
  offsetX: number;
  statusFilter: string;
}

export function ProductionLineModel({ line, offsetX, statusFilter }: ProductionLineModelProps) {
  const topMachines = line.machines.filter((m) => m.position.row === 'top').sort((a, b) => a.position.index - b.position.index);
  const bottomMachines = line.machines.filter((m) => m.position.row === 'bottom').sort((a, b) => a.position.index - b.position.index);

  const maxMachines = Math.max(topMachines.length, bottomMachines.length);
  const tableWidth = maxMachines * 1.5;

  return (
    <group position={[offsetX, 0, 0]}>
      {/* Line Label */}
      <Text
        position={[0, 0.2, 0.5]}
        fontSize={0.4}
        color="#aaaaaa"
        anchorX="left"
        anchorY="bottom"
        rotation={[-Math.PI / 2, 0, 0]}
      >
        Line {line.lineNumber}
      </Text>

      {/* Production Table */}
      <mesh position={[tableWidth / 2 - 0.75, 0.5, 3.5]} castShadow receiveShadow>
        <boxGeometry args={[tableWidth, 1, 1.2]} />
        <meshStandardMaterial color="#3a2f24" />
      </mesh>

      {/* Top Row Machines */}
      {topMachines.map((machine, idx) => (
        <MachineModel
          key={machine.id}
          machine={machine}
          position={[idx * 1.5, 1.2, 2.5]} // Rest on table
          statusFilter={statusFilter}
        />
      ))}

      {/* Bottom Row Machines */}
      {bottomMachines.map((machine, idx) => (
        <MachineModel
          key={machine.id}
          machine={machine}
          position={[idx * 1.5, 1.2, 4.5]} // Rest on table
          statusFilter={statusFilter}
        />
      ))}
    </group>
  );
}
