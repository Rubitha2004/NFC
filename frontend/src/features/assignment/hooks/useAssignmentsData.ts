import { useMemo } from "react";
import { useAssignments } from "./useAssignments";
import type { AssignmentData } from "../types/assignment.types";

export function useAssignmentsData() {
  const { data, isLoading, refetch, isRefetching } = useAssignments();
  
  const assignments: AssignmentData[] = data?.data || [];

  const stats = useMemo(() => {
    const total = data?.total || assignments.length;
    const active = assignments.filter(a => a.status === "active").length;
    const completed = assignments.filter(a => a.status === "completed").length;
    const pending = assignments.filter(a => a.status === "pending").length;
    
    const uniqueWorkers = new Set(assignments.map(a => a.worker.id)).size;
    const uniqueMachines = new Set(assignments.map(a => a.machine.id)).size;
    
    const todayStr = new Date().toISOString().split('T')[0];
    const todaysAssignments = assignments.filter(a => a.assignedTime.startsWith(todayStr)).length;
    
    // Fake utilization %
    const shiftUtilization = Math.round((active / (total || 1)) * 100);

    return {
      total,
      active,
      completed,
      pending,
      uniqueWorkers,
      uniqueMachines,
      todaysAssignments,
      shiftUtilization,
    };
  }, [assignments, data]);

  return { assignments, stats, isLoading, refetch, isRefetching };
}
