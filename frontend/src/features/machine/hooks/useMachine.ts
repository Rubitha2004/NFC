import { useQuery } from '@tanstack/react-query';
import { machineService } from '../services/machine.service';

export function useMachine(id: string | null) {
  return useQuery({
    queryKey: ['machines', id],
    queryFn: () => machineService.getMachine(id!),
    enabled: !!id,
  });
}
