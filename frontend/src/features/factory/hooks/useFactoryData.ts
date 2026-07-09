import { useState, useEffect, useMemo } from 'react';
import { FACTORY_CONFIG } from '../data/factory.mock';
import type {
  FactoryConfig, FactoryStats, Machine, MachineStatus,
  MachineContext,
  FactoryBuilding, FactoryFloorLevel, FactoryRoom, ProductionLine, RoomType
} from '../types/factory.types';
import api from '@/services/axios';
import { mapMachineAPIToUI } from '@/features/machine/services/machine.service';

export function useFactoryData(): {
  config: FactoryConfig;
  stats: FactoryStats;
  allMachines: Machine[];
  getMachineById: (id: string) => Machine | undefined;
  getMachineContext: (id: string) => MachineContext | undefined;
  loading: boolean;
} {
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<FactoryConfig>(FACTORY_CONFIG);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const [machinesRes] = await Promise.all([
          api.get('/machines?limit=2000') // increased limit to support 420+ machines
        ]);

        if (!mounted) return;

        const rawMachines = machinesRes.data.data?.data || machinesRes.data.data || [];

        const mappedMachines = rawMachines.map((m: any, index: number) => {
          const uiMachine = mapMachineAPIToUI(m);
          
          let worker: any = null;
          let assignment: any = null;
          
          if (m.assignments && m.assignments.length > 0) {
            const activeAssignment = m.assignments[0];
            if (activeAssignment.worker) {
               worker = {
                 id: activeAssignment.worker.id.toString(),
                 name: `${activeAssignment.worker.firstName} ${activeAssignment.worker.lastName}`,
                 photo: undefined,
                 role: 'Worker',
                 department: uiMachine.department || 'General',
                 employeeId: activeAssignment.worker.employeeCode,
                 shiftId: activeAssignment.shiftId?.toString() || '1',
                 grade: 'A',
                 attendanceToday: 'present',
                 checkInTime: new Date().toISOString()
               };
            }
            assignment = {
              id: activeAssignment.id.toString(),
              workerId: activeAssignment.workerId.toString(),
              machineId: activeAssignment.machineId.toString(),
              operationId: activeAssignment.operationId?.toString() || '1',
              operationName: 'Sewing', 
              bundleId: '',
              startedAt: activeAssignment.assignedAt,
              targetPieces: 100,
              completedPieces: 0
            };
          }

          const factoryMachine: Machine = {
            id: String(uiMachine.id),
            machineNumber: uiMachine.machineId || m.machineCode || `M-${m.id}`,
            machineType: String(uiMachine.type),
            status: worker ? 'running' : ((uiMachine.status as any) === 'active' || uiMachine.status === 'running' ? 'no_worker' : 'idle'),
            department: uiMachine.department || 'General',
            worker,
            assignment,
            bundle: null,
            healthScore: uiMachine.healthScore || 100,
            uptimePercent: 99,
            efficiency: uiMachine.efficiency || 0,
            lastMaintenance: new Date().toISOString().split('T')[0],
            nextMaintenanceDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
            temperatureC: uiMachine.temperature || 30,
            powerStatus: 'on',
            networkStatus: 'online',
            todayTimeline: [],
            position: { row: index % 2 === 0 ? 'bottom' : 'top', index }
          };
          
          return factoryMachine;
        });

        // Build lines based on machines
        const lines: ProductionLine[] = [];
        const machinesPerRow = 35;
        // Limit to exactly 4 rows as requested by the user
        const totalRows = 4;
        
        for (let i = 0; i < totalRows; i++) {
          lines.push({
            id: `line-${i+1}`,
            lineNumber: i + 1,
            lineName: `Row ${i + 1}`,
            machines: mappedMachines.slice(i * machinesPerRow, (i + 1) * machinesPerRow)
          });
        }

        const factoryRoom: FactoryRoom = {
          id: 'room-main',
          name: 'Main Production Area',
          roomType: 'stitching',
          lines,
        };

        const factoryFloor: FactoryFloorLevel = {
          id: 'floor-1',
          floorNumber: 1,
          name: 'Ground Floor',
          rooms: [factoryRoom]
        };

        const building: FactoryBuilding = {
          id: 'bldg-1',
          name: 'Main Production Facility',
          floors: [factoryFloor],
        };

        setConfig({
          id: 'factory-1',
          name: 'NFC Garment Production Facility',
          location: 'Chennai, Tamil Nadu',
          buildings: [building],
          lastUpdated: new Date().toISOString()
        });

      } catch (err) {
        console.error("Failed to load factory data", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();
    
    // Auto refresh every 10 seconds
    const intervalId = setInterval(() => {
      loadData();
    }, 10000);

    return () => { 
      mounted = false; 
      clearInterval(intervalId);
    };
  }, []);

  const allMachines = useMemo<Machine[]>(() =>
    config.buildings.flatMap((b) =>
      b.floors.flatMap((f) =>
        f.rooms.flatMap((r) =>
          r.lines.flatMap((l) => l.machines)
        )
      )
    ),
  [config]);

  const stats = useMemo<FactoryStats>(() => {
    const byStatus: Record<MachineStatus, number> = {
      running: 0, idle: 0, offline: 0, maintenance: 0, no_worker: 0,
    };
    allMachines.forEach((m) => { byStatus[m.status]++; });

    const totalFloors = config.buildings.reduce((a, b) => a + b.floors.length, 0);
    const totalRooms  = config.buildings.reduce((a, b) =>
      a + b.floors.reduce((a2, f) => a2 + f.rooms.length, 0), 0);
    const totalLines  = config.buildings.reduce((a, b) =>
      a + b.floors.reduce((a2, f) =>
        a2 + f.rooms.reduce((a3, r) => a3 + r.lines.length, 0), 0), 0);

    return {
      totalMachines: allMachines.length,
      byStatus,
      activeWorkers: allMachines.filter((m) => m.worker !== null).length,
      totalBuildings: config.buildings.length,
      totalFloors,
      totalRooms,
      totalLines,
      productionToday: 0,
      activeBundles: 0,
      qcPassRate: 0,
      alertsCount: 0,
      absentWorkers: 0,
    };
  }, [allMachines, config]);

  const getMachineById = useMemo(
    () => (id: string) => allMachines.find((m) => m.id === id),
    [allMachines]
  );

  const getMachineContext = useMemo(
    () => (id: string): MachineContext | undefined => {
      for (const building of config.buildings) {
        for (const floor of building.floors) {
          for (const room of floor.rooms) {
            for (const line of room.lines) {
              const machine = line.machines.find((m) => m.id === id);
              if (machine) return { machine, line, room, floor, building };
            }
          }
        }
      }
      return undefined;
    },
    [config]
  );

  return { config, stats, allMachines, getMachineById, getMachineContext, loading };
}
