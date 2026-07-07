import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Factory, User, ShieldX, Wifi, Package, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/shared/utils/date.utils";
import type { AlertItem } from "../../types/factory.types";

const ALERT_CONFIG: Record<AlertItem["type"], {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
}> = {
  machine_offline:    { icon: Factory,        color: "text-red-400",    bg: "bg-red-500/10"    },
  worker_absent:      { icon: User,           color: "text-amber-400",  bg: "bg-amber-500/10"  },
  qc_reject:          { icon: ShieldX,        color: "text-rose-400",   bg: "bg-rose-500/10"   },
  terminal_offline:   { icon: Wifi,           color: "text-orange-400", bg: "bg-orange-500/10" },
  bundle_completed:   { icon: Package,        color: "text-green-400",  bg: "bg-green-500/10"  },
  production_target:  { icon: CheckCircle,    color: "text-cyan-400",   bg: "bg-cyan-500/10"   },
};

const PRIORITY_DOT: Record<AlertItem["priority"], string> = {
  high:   "bg-red-400",
  medium: "bg-amber-400",
  low:    "bg-green-400",
};

interface AlertsFeedProps {
  alerts: AlertItem[];
  onAlertClick?: (alert: AlertItem) => void;
  className?: string;
}

export function AlertsFeed({ alerts, onAlertClick, className }: AlertsFeedProps) {
  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-semibold">Live Alerts</span>
        </div>
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-400">
          {alerts.filter(a => a.priority === "high").length} critical
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {alerts.map((alert, index) => {
            const cfg = ALERT_CONFIG[alert.type];
            const Icon = cfg.icon;

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onAlertClick?.(alert)}
                className="flex items-start gap-2.5 px-3 py-2.5 border-b border-border/30 hover:bg-muted/30 cursor-pointer transition-colors"
              >
                {/* Icon */}
                <div className={cn("flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center mt-0.5", cfg.bg)}>
                  <Icon className={cn("w-3.5 h-3.5", cfg.color)} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", PRIORITY_DOT[alert.priority])} />
                    <p className="text-[11px] font-semibold text-foreground truncate">{alert.title}</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight line-clamp-2">{alert.description}</p>
                  <p className="text-[9px] text-muted-foreground/50 mt-1">{formatRelativeTime(alert.timestamp)}</p>
                </div>

                {alert.machineId && (
                  <span className="flex-shrink-0 text-[9px] font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded mt-0.5">
                    {alert.machineId}
                  </span>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
