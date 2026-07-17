import { useQuery } from '@tanstack/react-query';
import { operationService } from '../services/operation.service';

export function useOperations(params?: { status?: string, search?: string }) {
  return useQuery({
    queryKey: ['operations', params],
    queryFn: () => operationService.getOperations(params),
  });
}
