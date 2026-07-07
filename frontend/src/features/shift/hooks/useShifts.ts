import { useQuery } from '@tanstack/react-query';
import { shiftService } from '../services/shift.service';

export function useShifts() {
  return useQuery({
    queryKey: ['shifts'],
    queryFn: () => shiftService.getShifts(),
  });
}
