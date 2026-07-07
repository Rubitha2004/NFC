import type { FactoryConfig, Machine, FactoryBuilding, FactoryFloorLevel, FactoryRoom, ProductionLine, RoomType } from '../../factory/types/factory.types';
import type { LiveMachineCard } from '../../dashboard/services/dashboard.service';

/**
 * Transforms a flat list of LiveMachineCard objects from the backend
 * into the rich 3D-ready nested hierarchy required by the FactoryFloor component.
 */
export function buildFactoryHierarchy(liveMachines: LiveMachineCard[]): FactoryConfig {
  const now = new Date().toISOString();
  
  if (!liveMachines || liveMachines.length === 0) {
    return {
      id: 'factory-empty',
      name: 'NFC Garment Production Facility',
      location: 'Chennai, Tamil Nadu',
      buildings: [],
      lastUpdated: now,
    };
  }

  // 1. Convert LiveMachineCard to frontend Machine interface
  const mappedMachines: Machine[] = liveMachines.map((m, idx) => ({
    id: m.machineCode, // use code as ID
    machineNumber: m.machineCode,
    machineType: 'Sewing Machine',
    status: m.machineStatus.toLowerCase() as any, // RUNNING -> running
    department: m.departmentName || 'Stitching', // Fallback
    worker: m.workerName ? {
      id: m.employeeCode || `w-${idx}`,
      name: m.workerName,
      employeeId: m.employeeCode || `EMP-${idx}`,
      role: 'Operator',
      department: m.departmentName || 'Stitching',
      shiftId: m.shift || 'Shift A',
      grade: 'A',
      attendanceToday: m.attendance === 'IN' ? 'present' : 'absent',
      checkInTime: now,
    } : null,
    assignment: m.operation ? {
      id: `assig-${idx}`,
      workerId: m.employeeCode || `w-${idx}`,
      machineId: m.machineCode,
      operationId: `op-${idx}`,
      operationName: m.operation,
      bundleId: m.bundle || '',
      startedAt: now,
      targetPieces: 500,
      completedPieces: 250,
    } : null,
    bundle: m.bundle ? {
      id: `bndl-${idx}`,
      bundleNumber: m.bundle,
      styleCode: 'STL-999',
      totalPieces: 500,
      completedPieces: 250,
      progress: 50,
    } : null,
    healthScore: m.terminalStatus === 'ONLINE' ? 100 : 0,
    uptimePercent: 95,
    efficiency: m.machineStatus === 'RUNNING' ? 92 : 0,
    lastMaintenance: '2023-01-01',
    nextMaintenanceDate: '2024-01-01',
    temperatureC: 30,
    powerStatus: 'on',
    networkStatus: m.terminalStatus === 'ONLINE' ? 'online' : 'offline',
    todayTimeline: [],
    position: { row: 'top', index: 0 }, // Will be set by layout engine
  }));

  // 2. Group machines by department (to create rooms)
  const machinesByDept = mappedMachines.reduce((acc, m) => {
    if (!acc[m.department]) acc[m.department] = [];
    acc[m.department].push(m);
    return acc;
  }, {} as Record<string, Machine[]>);

  // If everything is in one department but there are many machines, let's artificially split them for better UI layout.
  // Actually, we'll just chunk them. 20 machines per room.
  const ROOM_CAPACITY = 20;
  const MACHINES_PER_LINE = 10;
  
  const rooms: FactoryRoom[] = [];
  let roomCounter = 1;

  Object.keys(machinesByDept).forEach(deptName => {
    const deptMachines = machinesByDept[deptName];
    
    // Chunk into rooms
    for (let i = 0; i < deptMachines.length; i += ROOM_CAPACITY) {
      const roomMachines = deptMachines.slice(i, i + ROOM_CAPACITY);
      
      const lines: ProductionLine[] = [];
      let lineCounter = 1;
      
      // Chunk into lines
      for (let j = 0; j < roomMachines.length; j += MACHINES_PER_LINE) {
        const lineMachines = roomMachines.slice(j, j + MACHINES_PER_LINE);
        
        // Assign positions for 3D layout (top and bottom rows of the table)
        lineMachines.forEach((lm, idx) => {
          lm.position = {
            row: idx % 2 === 0 ? 'top' : 'bottom',
            index: Math.floor(idx / 2)
          };
        });

        lines.push({
          id: `line-${roomCounter}-${lineCounter}`,
          lineNumber: lineCounter,
          lineName: `Line ${lineCounter}`,
          machines: lineMachines
        });
        
        lineCounter++;
      }
      
      // Map department string to RoomType enum color
      let roomType: RoomType = 'stitching';
      const dLower = deptName.toLowerCase();
      if (dLower.includes('finish')) roomType = 'finishing';
      if (dLower.includes('cut')) roomType = 'cutting';
      if (dLower.includes('qc') || dLower.includes('quality')) roomType = 'qc';
      if (dLower.includes('pack')) roomType = 'packing';
      if (dLower.includes('embroid')) roomType = 'embroidery';

      rooms.push({
        id: `room-${roomCounter}`,
        name: `${deptName} Hall ${Math.ceil((i+1)/ROOM_CAPACITY)}`,
        roomType: roomType,
        lines: lines
      });
      
      roomCounter++;
    }
  });

  // 3. Put rooms into floors, floors into building
  const floor: FactoryFloorLevel = {
    id: 'floor-1',
    floorNumber: 1,
    name: 'Production Floor',
    rooms: rooms,
  };

  const building: FactoryBuilding = {
    id: 'bldg-a',
    name: 'Main Factory Block',
    floors: [floor],
  };

  return {
    id: 'live-factory',
    name: 'NFC Garment Production Facility',
    location: 'Chennai, Tamil Nadu',
    buildings: [building],
    lastUpdated: now,
  };
}
