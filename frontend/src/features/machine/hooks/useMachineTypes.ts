import { useQuery } from '@tanstack/react-query';
import { machineTypeService } from '../services/machineType.service';

export function useMachineTypes() {
  return useQuery({
    queryKey: ['machineTypes'],
    queryFn: () => machineTypeService.getMachineTypes(),
  });
}
