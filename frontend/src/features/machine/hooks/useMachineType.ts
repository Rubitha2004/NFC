import { useQuery } from '@tanstack/react-query';
import { machineTypeService } from '../services/machineType.service';

export function useMachineType(id: string | null) {
  return useQuery({
    queryKey: ['machineTypes', id],
    queryFn: () => machineTypeService.getMachineType(id!),
    enabled: !!id,
  });
}
