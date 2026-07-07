import { useMemo } from "react";
import { useTodayAttendances } from "./useAttendances";
import type { AttendanceRecord, NFCEvent, AttendanceStats } from "../types/attendance.types";

export function useAttendanceRecords() {
  const { data: queryData, isLoading, refetch, isRefetching } = useTodayAttendances();
  
  const records = queryData?.data || [];

  const stats = useMemo<AttendanceStats>(() => {
    const total = records.length;
    const present = records.filter(a => a.status === "present" || a.status === "late").length;
    const absent = records.filter(a => a.status === "absent").length;
    const late = records.filter(a => a.isLate).length;
    const onLeave = records.filter(a => a.status === "on_leave").length;
    const checkedOut = records.filter(a => !!a.checkOut).length;
    const overtime = records.filter(a => (a.overtimeHours || 0) > 0).length;
    
    const attendancePercentage = total > 0 ? Math.round((present / (total - onLeave || 1)) * 100) : 0;

    return {
      total,
      present,
      absent,
      late,
      onLeave,
      checkedOut,
      overtime,
      attendancePercentage
    };
  }, [records]);

  return {
    records,
    stats,
    isLoading,
    refetch,
    isRefetching
  };
}

export function useLiveAttendanceFeed() {
  const { data: queryData, isLoading } = useTodayAttendances();
  const liveEvents: NFCEvent[] = queryData?.raw || [];

  return { liveEvents, isLoading };
}
