import { useMemo } from "react";

function seeded(seed: number, max: number) {
  const x = Math.sin(seed + 1) * 10000;
  return Math.floor((x - Math.floor(x)) * max);
}

export function useReportsData() {
  const productionData = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      time: `${i + 8}:00`,
      output: 50 + seeded(i, 80),
      target: 100,
    }));
  }, []);

  const workerData = useMemo(() => {
    return [
      { name: "John Doe", efficiency: 92, defects: 2 },
      { name: "Jane Smith", efficiency: 88, defects: 4 },
      { name: "Alice Fox", efficiency: 95, defects: 1 },
      { name: "Bob Ross", efficiency: 78, defects: 8 },
      { name: "Charlie Day", efficiency: 85, defects: 3 },
    ];
  }, []);

  const qcData = useMemo(() => {
    return [
      { name: "Pass", value: 850, color: "#10b981" },
      { name: "Fail", value: 45, color: "#f43f5e" },
      { name: "Rework", value: 105, color: "#f59e0b" },
    ];
  }, []);

  const machineData = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => ({
      day: `Day ${i + 1}`,
      uptime: 80 + seeded(i * 2, 20),
      downtime: seeded(i * 2 + 1, 15),
    }));
  }, []);

  const downtimeHeatmapData = useMemo(() => {
    const machines = ["MCH-1", "MCH-2", "MCH-3", "MCH-4", "MCH-5"];
    const shifts = ["Morning", "Afternoon", "Night"];
    
    const data = [];
    for (const m of machines) {
      for (const s of shifts) {
        data.push({
          machine: m,
          shift: s,
          severity: seeded(m.charCodeAt(0) * s.charCodeAt(0), 100) // 0-100 severity
        });
      }
    }
    return data;
  }, []);

  return {
    productionData,
    workerData,
    qcData,
    machineData,
    downtimeHeatmapData,
  };
}
