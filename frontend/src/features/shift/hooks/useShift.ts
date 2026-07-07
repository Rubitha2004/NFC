import { useQuery } from '@tanstack/react-query';
import { shiftService } from '../services/shift.service';

export function useShift(id: string | null) {
  return useQuery({
    queryKey: ['shifts', id],
    queryFn: () => shiftService.getShift(id!),
    enabled: !!id,
  });
}
