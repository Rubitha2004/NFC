import { useQuery } from '@tanstack/react-query';
import { workerService } from '../services/worker.service';

export function useWorkers() {
  return useQuery({
    queryKey: ['workers'],
    queryFn: () => workerService.getWorkers(),
  });
}
