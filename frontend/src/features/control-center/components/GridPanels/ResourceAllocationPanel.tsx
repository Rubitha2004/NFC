import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { controlCenterService } from "../../services/controlCenter.service";
import type { ControlCenterData } from "../../services/controlCenter.service";

export function ResourceAllocationPanel() {
  const [stats, setStats] = useState<ControlCenterData["stats"] | null>(null);

  useEffect(() => {
    controlCenterService.getDashboardData().then(d => setStats(d.stats));
  }, []);

  if (!stats) return <div className="bg-card border border-border rounded-xl p-5 h-full animate-pulse" />;

  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col h-full shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground flex items-center">
          <Users className="w-4 h-4 mr-2 text-amber-500" />
          Resource Allocation
        </h3>
      </div>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Worker Utilization</span>
            <span className="text-foreground font-medium">{stats.workerUtilization}%</span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${stats.workerUtilization}%` }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Machine Utilization</span>
            <span className="text-foreground font-medium">{stats.utilization}%</span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${stats.utilization}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
