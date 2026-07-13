import { useQuery } from '@tanstack/react-query';
import { reportsService } from '../services/reports.service';

export function useReportsData() {
  const { data: rawDashboard } = useQuery({
    queryKey: ['dashboardOverview'],
    queryFn: reportsService.getDashboard,
    refetchInterval: 30000, // Real-timeish
  });

  const { data: rawQC } = useQuery({
    queryKey: ['reportsQC'],
    queryFn: reportsService.getQC,
  });

  // Map API response to chart formats or provide fallbacks while loading
  
  // Dashboard API gives us qcAggregate: [{ status: "PASS", _count: { id: 10 } }, ...]
  const qcData = (rawDashboard?.qcAggregate || []).map((item: any) => {
    let color = "#10b981"; // Default PASS
    if (item.status === "FAIL") color = "#f43f5e";
    if (item.status === "REWORK") color = "#f59e0b";
    
    // Map status enum to human readable if needed
    const nameMap: any = { PASS: "Pass", FAIL: "Fail", REWORK: "Rework" };
    return { name: nameMap[item.status] || item.status, value: item._count.id, color };
  });

  // Since we are mocking production output, we'll keep it simple for now or read from Dashboard 
  // Let's use todaysCompletedQuantity from dashboard if available
  const productionData = [
    { time: "Today", output: rawDashboard?.todaysCompletedQuantity || 0, target: 500 }
  ];

  // We need to map other stats here. For now, to prevent UI crashes, provide defaults
  const workerData = [
    { name: "Active", efficiency: 100, defects: 0, count: rawDashboard?.presentWorkersCount || 0 }
  ];

  const machineData = [
    { day: "Today", uptime: rawDashboard?.totalMachines || 0, downtime: rawDashboard?.offlineTerminals || 0 }
  ];

  const downtimeHeatmapData: any[] = [];

  return {
    productionData,
    workerData,
    qcData,
    machineData,
    downtimeHeatmapData,
  };
}
