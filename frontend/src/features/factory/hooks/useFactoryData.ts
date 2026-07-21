import { useState, useEffect, useMemo } from 'react';
import { FACTORY_CONFIG } from '../data/factory.mock';
import type {
  FactoryConfig, FactoryStats, Machine, MachineStatus,
  MachineContext,
  FactoryBuilding, FactoryFloorLevel, FactoryRoom, ProductionLine, RoomType
} from '../types/factory.types';
import api from '@/services/axios';
import { mapMachineAPIToUI } from '@/features/machine/services/machine.service';
import { useMachineStore } from '@/features/machine/store/machine.store';

import { socketService } from '@/services/socket';

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
  const refreshTrigger = useMachineStore(state => state.refreshTrigger);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const [machinesRes, floorsRes] = await Promise.all([
          api.get('/machines?limit=2000'), // increased limit to support 420+ machines
          api.get('/floors') // get actual layout hierarchy
        ]);

        if (!mounted) return;

        const rawMachines = machinesRes.data.data?.data || machinesRes.data.data || [];
        const rawFloors = floorsRes.data.data || [];

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
            const activeTask = m.productionTasks?.[0];
            assignment = {
              id: activeAssignment.id.toString(),
              workerId: activeAssignment.workerId.toString(),
              machineId: activeAssignment.machineId.toString(),
              operationId: activeAssignment.operationId?.toString() || '1',
              operationName: activeTask?.operation?.name || activeAssignment.operation?.name || 'Sewing', 
              projectName: activeTask?.productionOrder?.styleName || 'N/A',
              productionOrder: activeTask?.productionOrder?.orderNumber || 'N/A',
              departmentName: activeTask?.department?.name || 'Sewing Line',
              bundleId: activeTask?.bundleId?.toString() || '',
              startedAt: activeAssignment.assignedAt || new Date().toISOString(),
              targetPieces: activeTask?.targetQuantity || 100,
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
            isWorking: (m.bundles && m.bundles.length > 0),
            // Set original indices for reference, row is overridden in rendering but position matches DB
            position: { row: m.rowIndex % 2 === 0 ? 'top' : 'bottom', index: m.positionIndex != null ? m.positionIndex : index },
            roomId: m.roomId ? String(m.roomId) : undefined,
            rowIndex: m.rowIndex != null ? Number(m.rowIndex) : undefined,
            positionIndex: m.positionIndex != null ? Number(m.positionIndex) : undefined
          };
          
          return factoryMachine;
        });

        const factoryFloors: FactoryFloorLevel[] = rawFloors.map((floor: any) => {
          const rooms: FactoryRoom[] = floor.rooms.map((room: any) => {
            const roomMachines = rawMachines.filter((m: any) => m.roomId === room.id);
            
            // Group machines in this room by rowIndex
            const rowMap = new Map<number, any[]>();
            roomMachines.forEach((m: any) => {
              const rowIndex = m.rowIndex || 0;
              if (!rowMap.has(rowIndex)) rowMap.set(rowIndex, []);
              rowMap.get(rowIndex)!.push(m);
            });

            const lines: ProductionLine[] = Array.from(rowMap.entries())
              .sort((a, b) => a[0] - b[0])
              .map(([rowIndex, rowMachinesList]) => {
                const machineIds = rowMachinesList.map(m => String(m.machineCode));
                const mappedRowMachines = mappedMachines.filter((m: Machine) => machineIds.includes(m.id));
                
                // Sort machines within the row by positionIndex
                mappedRowMachines.sort((a: Machine, b: Machine) => {
                  const m1 = rawMachines.find((rm: any) => String(rm.machineCode) === a.id);
                  const m2 = rawMachines.find((rm: any) => String(rm.machineCode) === b.id);
                  return (m1?.positionIndex || 0) - (m2?.positionIndex || 0);
                });

                return {
                  id: `room-${room.id}-row-${rowIndex}`,
                  lineNumber: rowIndex + 1,
                  lineName: `Row ${rowIndex + 1}`,
                  machines: mappedRowMachines
                };
              });

            return {
              id: `room-${room.id}`,
              name: room.roomName,
              roomType: 'stitching',
              lines: lines,
              machinesPerRow: room.machinesPerRow,
              rowsCount: room.rowsCount,
            };
          });

          return {
            id: `floor-${floor.id}`,
            floorNumber: floor.floorNumber,
            name: floor.name || `Floor ${floor.floorNumber}`,
            rooms: rooms
          };
        });

        const building: FactoryBuilding = {
          id: 'bldg-1',
          name: 'Main Production Facility',
          floors: factoryFloors,
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
    
    // Auto refresh every 30 seconds as fallback reconciliation
    const intervalId = setInterval(() => {
      loadData();
    }, 30000);

    // Live WebSockets Updates
    socketService.connect();
    
    const handleBundleUpdated = (payload: any) => {
      // payload contains the bundle update information. We can trigger a localized update
      // But for simplicity of react state, if a BUNDLE_UPDATED event comes, we can safely just fetch the machines
      // or optionally do a fast patch if we have the specific data.
      // Easiest reliable way is to just call loadData() quickly in background when a specific scan happens,
      // because 400 machines load is very fast natively in this app.
      loadData();
    };

    socketService.on('bundle.updated', handleBundleUpdated);

    return () => { 
      mounted = false; 
      clearInterval(intervalId);
      socketService.off('bundle.updated', handleBundleUpdated);
    };
  }, [refreshTrigger]);

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
