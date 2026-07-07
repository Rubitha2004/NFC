import { useMemo } from 'react';
import { FACTORY_CONFIG } from '../data/factory.mock';
import type {
  FactoryConfig, FactoryStats, Machine, MachineStatus,
  MachineContext,
} from '../types/factory.types';
import { useDashboardOverview, useLiveFloor } from '../../dashboard/hooks/useDashboardQueries';
import { buildFactoryHierarchy } from '../utils/autoLayoutEngine';

/**
 * Single data-access hook for the entire factory.
 * Swap the FACTORY_CONFIG import here for a React Query call — no component changes needed.
 */
export function useFactoryData(): {
  config: FactoryConfig;
  stats: FactoryStats;
  allMachines: Machine[];
  getMachineById: (id: string) => Machine | undefined;
  getMachineContext: (id: string) => MachineContext | undefined;
} {
  const { data: overviewData } = useDashboardOverview();
  const { data: liveFloorData } = useLiveFloor();

  const config = useMemo(() => {
    if (liveFloorData) {
      return buildFactoryHierarchy(liveFloorData);
    }
    return FACTORY_CONFIG; // Fallback while loading
  }, [liveFloorData]);

  /** Flat list of every machine — traverses the full v2 hierarchy */
  const allMachines = useMemo<Machine[]>(() =>
    config.buildings.flatMap((b) =>
      b.floors.flatMap((f) =>
        f.rooms.flatMap((r) =>
          r.lines.flatMap((l) => l.machines)
        )
      )
    ),
    [config]
  );

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
      productionToday: overviewData?.production.completed || 0,
      activeBundles: overviewData?.bundles.inProgress || 0,
      qcPassRate: overviewData?.production.completed ? Number(((overviewData.qc.pass / overviewData.production.completed) * 100).toFixed(1)) : 0,
      alertsCount: 3, // Dummy, needs alert endpoint
      absentWorkers: overviewData?.workers.absent || 0,
    };
  }, [allMachines, config, overviewData]);

  const getMachineById = useMemo(
    () => (id: string) => allMachines.find((m) => m.id === id),
    [allMachines]
  );

  /** Returns full hierarchy context for a machine — used by Smart Inspector Panel */
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

  return { config, stats, allMachines, getMachineById, getMachineContext };
}
