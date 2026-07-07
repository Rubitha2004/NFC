import { useQuery } from '@tanstack/react-query';
import { operationService } from '../services/operation.service';

export function useOperation(id: string | null) {
  return useQuery({
    queryKey: ['operations', id],
    queryFn: () => operationService.getOperation(id!),
    enabled: !!id,
  });
}
