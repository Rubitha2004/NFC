import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { machineService } from '../services/machine.service';

export function useMachinesData() {
  const { data: machines = [], isLoading, error } = useQuery({
    queryKey: ['machines'],
    queryFn: machineService.getMachines,
    refetchInterval: 10000
  });

  const stats = useMemo(() => {
    const total = machines.length;
    const running = machines.filter((m) => m.status === "running").length;
    const idle = machines.filter((m) => m.status === "idle").length;
    const offline = machines.filter((m) => m.status === "offline").length;
    const maintenance = machines.filter((m) => m.status === "maintenance").length;
    
    const assigned = machines.filter((m) => m.currentAssignment).length;
    const unassigned = total - assigned;
    const healthy = machines.filter((m) => m.health === "healthy").length;
    
    return {
      total,
      running,
      idle,
      offline,
      maintenance,
      assigned,
      unassigned,
      healthy,
    };
  }, [machines]);

  return { machines, stats, isLoading, error };
}
