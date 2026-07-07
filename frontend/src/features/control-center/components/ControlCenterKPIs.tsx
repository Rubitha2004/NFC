import { useEffect, useState } from "react";
import { Users, Cpu, Package, Zap, CheckCircle, AlertTriangle } from "lucide-react";
import { controlCenterService } from "../services/controlCenter.service";
import type { ControlCenterData } from "../services/controlCenter.service";
import { KPICard } from "@/shared/components/ui/KPICard";

export function ControlCenterKPIs() {
  const [data, setData] = useState<ControlCenterData["stats"] | null>(null);

  useEffect(() => {
    controlCenterService.getDashboardData().then(d => setData(d.stats));
  }, []);

  if (!data) return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6 opacity-50 pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-card border border-border rounded-xl p-5 h-[116px] animate-pulse" />
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      <KPICard title="OEE" value="85%" icon={Zap} colorClass="bg-emerald-500/10 text-emerald-500" delay={0.0} />
      <KPICard title="Active Machines" value={data.machinesRunning} icon={Cpu} colorClass="bg-blue-500/10 text-blue-500" delay={0.05} />
      <KPICard title="Production Target" value={data.targetToday} icon={Package} colorClass="bg-purple-500/10 text-purple-500" delay={0.1} />
      <KPICard title="Worker Attendance" value={`${Math.round((data.workersPresent / (data.workersPresent + data.workersAbsent)) * 100)}%`} icon={Users} colorClass="bg-amber-500/10 text-amber-500" delay={0.15} />
      <KPICard title="Quality Pass Rate" value={`${data.efficiency}%`} icon={CheckCircle} colorClass="bg-emerald-500/10 text-emerald-500" delay={0.2} />
      <KPICard title="Pending Alerts" value={data.qcPending} icon={AlertTriangle} colorClass="bg-rose-500/10 text-rose-500" delay={0.25} />
    </div>
  );
}
