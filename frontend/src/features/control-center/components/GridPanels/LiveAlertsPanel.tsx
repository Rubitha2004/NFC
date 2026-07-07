import { useEffect, useState } from "react";
import { AlertTriangle, Clock } from "lucide-react";
import { controlCenterService } from "../../services/controlCenter.service";
import type { ControlCenterData } from "../../services/controlCenter.service";

export function LiveAlertsPanel() {
  const [alerts, setAlerts] = useState<ControlCenterData["alerts"] | null>(null);

  useEffect(() => {
    controlCenterService.getDashboardData().then(d => setAlerts(d.alerts));
  }, []);

  if (!alerts) return <div className="bg-card border border-border rounded-xl p-5 h-full animate-pulse" />;

  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col h-full shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground flex items-center">
          <AlertTriangle className="w-4 h-4 mr-2 text-rose-500" />
          Live Alerts
        </h3>
        <span className="text-xs bg-rose-500/10 text-rose-500 px-2 py-1 rounded-full font-medium">
          {alerts.length} Active
        </span>
      </div>
      <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
        {alerts.map(alert => (
          <div key={alert.id} className="p-3 bg-muted/50 rounded-lg border border-border/50">
            <div className="flex justify-between items-start mb-1">
              <span className="text-xs font-semibold text-rose-400">{alert.type}</span>
              <span className="text-[10px] text-muted-foreground flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {alert.time}
              </span>
            </div>
            <p className="text-sm text-foreground">{alert.message}</p>
          </div>
        ))}
        {alerts.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-4">No active alerts</div>
        )}
      </div>
    </div>
  );
}
