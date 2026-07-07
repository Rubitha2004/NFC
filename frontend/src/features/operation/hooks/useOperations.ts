import { useQuery } from '@tanstack/react-query';
import { operationService } from '../services/operation.service';

export function useOperations() {
  return useQuery({
    queryKey: ['operations'],
    queryFn: () => operationService.getOperations(),
  });
}
