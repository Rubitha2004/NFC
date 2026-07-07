import { 
  Wrench, 
  Activity, 
  Clock, 
  Users, 
  Computer, 
  TrendingUp 
} from "lucide-react";
import { useOperations } from "../hooks/useOperations";

import { KPICard } from "@/shared/components/ui/KPICard";

export function OperationKPIs() {
  const { data: operations = [], isLoading } = useOperations();

  const kpis = {
    totalOperations: operations.length,
    activeOperations: operations.filter(o => o.status === 'active').length,
    averageSMV: operations.length > 0 
      ? Number((operations.reduce((acc, curr) => acc + curr.smv, 0) / operations.length).toFixed(1)) 
      : 0,
    assignedWorkers: operations.reduce((acc, curr) => acc + (curr.assignedWorkers || 0), 0),
    assignedMachines: operations.reduce((acc, curr) => acc + (curr.assignedMachines || 0), 0),
    dailyProduction: 0, // Mock metric
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6 opacity-50 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-5 h-[116px] animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      <KPICard 
        title="Total Operations" 
        value={kpis.totalOperations} 
        icon={Wrench} 
        colorClass="bg-blue-500/10 text-blue-500" 
        delay={0.0} 
      />
      <KPICard 
        title="Active Operations" 
        value={kpis.activeOperations} 
        icon={Activity} 
        colorClass="bg-emerald-500/10 text-emerald-500" 
        delay={0.05} 
      />
      <KPICard 
        title="Average SMV" 
        value={`${kpis.averageSMV}m`} 
        icon={Clock} 
        colorClass="bg-amber-500/10 text-amber-500" 
        delay={0.1} 
      />
      <KPICard 
        title="Assigned Workers" 
        value={kpis.assignedWorkers} 
        icon={Users} 
        colorClass="bg-purple-500/10 text-purple-500" 
        delay={0.15} 
      />
      <KPICard 
        title="Assigned Machines" 
        value={kpis.assignedMachines} 
        icon={Computer} 
        colorClass="bg-indigo-500/10 text-indigo-500" 
        delay={0.2} 
      />
      <KPICard 
        title="Daily Production" 
        value={kpis.dailyProduction.toLocaleString()} 
        icon={TrendingUp} 
        colorClass="bg-rose-500/10 text-rose-500" 
        delay={0.25} 
      />
    </div>
  );
}
