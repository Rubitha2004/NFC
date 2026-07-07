import { 
  Clock, 
  PlayCircle, 
  Users, 
  Computer, 
  Percent, 
  TrendingUp 
} from "lucide-react";
import { useShifts } from "../hooks/useShifts";

import { KPICard } from "@/shared/components/ui/KPICard";

export function ShiftKPIs() {
  const { data: shifts = [], isLoading } = useShifts();

  const activeShiftObj = shifts.find(s => s.status === 'active');

  const kpis = {
    totalShifts: shifts.length,
    activeShift: activeShiftObj ? activeShiftObj.shiftName : 'None',
    workersPresent: shifts.reduce((acc, curr) => acc + (curr.attendanceCount || 0), 0),
    runningMachines: shifts.reduce((acc, curr) => acc + (curr.assignedMachines || 0), 0),
    attendancePercentage: shifts.length > 0
      ? Math.round(
          shifts.reduce((acc, curr) => acc + ((curr.attendanceCount || 0) / (curr.assignedWorkers || 1)), 0) / shifts.length * 100
        )
      : 0,
    productionToday: shifts.reduce((acc, curr) => acc + (curr.productionCompleted || 0), 0),
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
        title="Total Shifts" 
        value={kpis.totalShifts} 
        icon={Clock} 
        colorClass="bg-blue-500/10 text-blue-500" 
        delay={0.0} 
      />
      <KPICard 
        title="Active Shift" 
        value={kpis.activeShift} 
        icon={PlayCircle} 
        colorClass="bg-emerald-500/10 text-emerald-500" 
        delay={0.05} 
      />
      <KPICard 
        title="Workers Present" 
        value={kpis.workersPresent} 
        icon={Users} 
        colorClass="bg-amber-500/10 text-amber-500" 
        delay={0.1} 
      />
      <KPICard 
        title="Running Machines" 
        value={kpis.runningMachines} 
        icon={Computer} 
        colorClass="bg-purple-500/10 text-purple-500" 
        delay={0.15} 
      />
      <KPICard 
        title="Attendance %" 
        value={`${kpis.attendancePercentage}%`} 
        icon={Percent} 
        colorClass="bg-indigo-500/10 text-indigo-500" 
        delay={0.2} 
      />
      <KPICard 
        title="Production Today" 
        value={kpis.productionToday.toLocaleString()} 
        icon={TrendingUp} 
        colorClass="bg-rose-500/10 text-rose-500" 
        delay={0.25} 
      />
    </div>
  );
}
