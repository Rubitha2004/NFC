import {
  Cpu,
  Play,
  Pause,
  WifiOff,
  Wrench,
  UserCheck,
  UserX,
  HeartPulse,
} from "lucide-react";
import { useMachines } from "../hooks/useMachines";
import { KPICard } from "@/shared/components/ui/KPICard";

export function MachinesKPIs() {
  const { data: machines = [] } = useMachines();

  const stats = {
    total: machines.length,
    running: machines.filter((m) => m.status === "running").length,
    idle: machines.filter((m) => m.status === "idle").length,
    offline: machines.filter((m) => m.status === "offline").length,
    maintenance: machines.filter((m) => m.status === "maintenance").length,
    assigned: machines.filter((m) => m.currentAssignment).length,
    unassigned: machines.filter((m) => !m.currentAssignment).length,
    healthy: machines.filter((m) => m.health === "healthy").length,
  };

  const kpis = [
    {
      id: "total",
      label: "Total Machines",
      value: stats.total,
      icon: Cpu,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      id: "running",
      label: "Running",
      value: stats.running,
      icon: Play,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      trend: "+2",
      trendUp: true,
    },
    {
      id: "idle",
      label: "Idle",
      value: stats.idle,
      icon: Pause,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      id: "offline",
      label: "Offline",
      value: stats.offline,
      icon: WifiOff,
      color: "text-zinc-500",
      bg: "bg-zinc-500/10",
    },
    {
      id: "maintenance",
      label: "Maintenance",
      value: stats.maintenance,
      icon: Wrench,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
    },
    {
      id: "assigned",
      label: "Assigned",
      value: stats.assigned,
      icon: UserCheck,
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
    },
    {
      id: "unassigned",
      label: "Unassigned",
      value: stats.unassigned,
      icon: UserX,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      id: "healthy",
      label: "Healthy",
      value: stats.healthy,
      icon: HeartPulse,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4 mb-6">
      {kpis.map((kpi, idx) => (
        <KPICard
          key={kpi.id}
          title={kpi.label}
          value={kpi.value}
          icon={kpi.icon}
          colorClass={kpi.color}
          bgClass={kpi.bg}
          trend={kpi.trend}
          trendUp={kpi.trendUp}
          delay={idx * 0.05}
        />
      ))}
    </div>
  );
}
