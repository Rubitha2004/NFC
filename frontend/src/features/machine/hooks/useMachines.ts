import { useQuery } from '@tanstack/react-query';
import { machineService } from '../services/machine.service';

export function useMachines() {
  return useQuery({
    queryKey: ['machines'],
    queryFn: () => machineService.getMachines(),
  });
}
