import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { workerService } from '../services/worker.service';

export function useWorkersData() {
  const { data: workers = [], isLoading, error } = useQuery({
    queryKey: ['workers'],
    queryFn: workerService.getWorkers,
    refetchInterval: 10000 // Refetch every 10s to see live updates
  });

  const stats = useMemo(() => {
    const total = workers.length;
    // Map status accurately based on assignments.
    const present = workers.filter(w => w.status === 'active').length; 
    const absent = workers.filter(w => w.status === 'on_leave' || w.status === 'inactive').length;
    const inactive = workers.filter(w => w.status === 'inactive').length;
    
    // In our DB mapping, we aren't tracking 'currentAssignment' in the WorkerData output from mapWorkerAPIToUI yet
    // If we want accurate assigned numbers we need to either expand the backend response or query assignments
    // For now, let's just base it off status if we don't have currentAssignment
    const assigned = workers.filter(w => (w as any).currentAssignment).length;
    const unassigned = total - assigned - inactive;

    const byGrade = {
      A: workers.filter(w => w.grade === 'A').length,
      B: workers.filter(w => w.grade === 'B').length,
      C: workers.filter(w => w.grade === 'C').length,
    };

    return { total, present, absent, inactive, assigned, unassigned, byGrade };
  }, [workers]);

  return { workers, stats, isLoading, error };
}
