import { useQuery } from '@tanstack/react-query';
import { attendanceService } from '../services/attendance.service';

export function useAttendances(params?: any) {
  return useQuery({
    queryKey: ['attendances', params],
    queryFn: () => attendanceService.getAttendances(params),
    refetchInterval: 10000, // Background refresh every 10s for live data
  });
}

export function useTodayAttendances() {
  return useQuery({
    queryKey: ['attendances', 'today'],
    queryFn: () => attendanceService.getTodayAttendances(),
    refetchInterval: 10000,
  });
}
