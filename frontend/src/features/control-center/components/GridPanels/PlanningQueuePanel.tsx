import { useEffect, useState } from "react";
import { CalendarClock, ArrowRight } from "lucide-react";
import { controlCenterService } from "../../services/controlCenter.service";
import type { ControlCenterData } from "../../services/controlCenter.service";
import { Badge } from "@/components/ui/badge";

export function PlanningQueuePanel() {
  const [queue, setQueue] = useState<ControlCenterData["planningQueue"] | null>(null);

  useEffect(() => {
    controlCenterService.getDashboardData().then(d => setQueue(d.planningQueue));
  }, []);

  if (!queue) return <div className="bg-card border border-border rounded-xl p-5 h-full animate-pulse" />;

  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col h-full shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground flex items-center">
          <CalendarClock className="w-4 h-4 mr-2 text-blue-500" />
          Planning Queue
        </h3>
      </div>
      <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
        {queue.map(order => (
          <div key={order.id} className="p-3 bg-muted/50 rounded-lg border border-border/50 flex justify-between items-center group cursor-pointer hover:bg-muted transition-colors">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-foreground">{order.id}</span>
                <Badge variant="outline" className="text-[10px] h-4 px-1 border-border">{order.priority}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{order.style} - {order.customer}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    </div>
  );
}
