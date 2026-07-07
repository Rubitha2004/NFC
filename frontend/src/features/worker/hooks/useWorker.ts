import { useQuery } from '@tanstack/react-query';
import { workerService } from '../services/worker.service';

export function useWorker(id: string | null) {
  return useQuery({
    queryKey: ['workers', id],
    queryFn: () => workerService.getWorker(id!),
    enabled: !!id,
  });
}
