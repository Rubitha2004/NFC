import { 
  Computer, 
  Layers, 
  ActivitySquare, 
  Wrench, 
  Wand2, 
  Percent 
} from "lucide-react";
import { useMachineTypes } from "../hooks/useMachineTypes";

import { KPICard } from "@/shared/components/ui/KPICard";

export function MachineTypeKPIs() {
  const { data: machineTypes = [], isLoading } = useMachineTypes();

  const kpis = {
    totalTypes: machineTypes.length,
    totalMachines: machineTypes.reduce((acc, curr) => acc + (curr.totalMachines || 0), 0),
    activeTypes: machineTypes.filter(m => m.status === 'active').length,
    maintenanceDue: machineTypes.filter(m => m.status === 'maintenance').length,
    supportedOperations: [...new Set(machineTypes.flatMap(m => m.supportedOperations || []))].length,
    averageUtilization: machineTypes.length > 0
      ? Math.round(machineTypes.reduce((acc, curr) => acc + (curr.averageEfficiency || 0), 0) / machineTypes.length)
      : 0,
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
        title="Total Machine Types" 
        value={kpis.totalTypes} 
        icon={Computer} 
        colorClass="bg-blue-500/10 text-blue-500" 
        delay={0.0} 
      />
      <KPICard 
        title="Total Machines" 
        value={kpis.totalMachines} 
        icon={Layers} 
        colorClass="bg-purple-500/10 text-purple-500" 
        delay={0.05} 
      />
      <KPICard 
        title="Active Types" 
        value={kpis.activeTypes} 
        icon={ActivitySquare} 
        colorClass="bg-emerald-500/10 text-emerald-500" 
        delay={0.1} 
      />
      <KPICard 
        title="Maintenance Due" 
        value={kpis.maintenanceDue} 
        icon={Wrench} 
        colorClass="bg-amber-500/10 text-amber-500" 
        delay={0.15} 
      />
      <KPICard 
        title="Supported Ops" 
        value={kpis.supportedOperations} 
        icon={Wand2} 
        colorClass="bg-indigo-500/10 text-indigo-500" 
        delay={0.2} 
      />
      <KPICard 
        title="Avg Utilization" 
        value={`${kpis.averageUtilization}%`} 
        icon={Percent} 
        colorClass="bg-rose-500/10 text-rose-500" 
        delay={0.25} 
      />
    </div>
  );
}
