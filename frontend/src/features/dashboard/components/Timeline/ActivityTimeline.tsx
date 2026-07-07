import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Activity, CheckCircle, Package, ShieldCheck, User, Wifi } from "lucide-react";
import type { TimelineEvent } from "../../types/factory.types";

const EVENT_CONFIG: Record<TimelineEvent["type"], {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
}> = {
  attendance_in:    { icon: User,        color: "text-green-400",  bg: "bg-green-500/15"  },
  attendance_out:   { icon: User,        color: "text-amber-400",  bg: "bg-amber-500/15"  },
  bundle_start:     { icon: Package,     color: "text-blue-400",   bg: "bg-blue-500/15"   },
  bundle_complete:  { icon: CheckCircle, color: "text-cyan-400",   bg: "bg-cyan-500/15"   },
  qc_pass:          { icon: ShieldCheck, color: "text-emerald-400",bg: "bg-emerald-500/15"},
  qc_fail:          { icon: ShieldCheck, color: "text-red-400",    bg: "bg-red-500/15"    },
  machine_online:   { icon: Wifi,        color: "text-green-400",  bg: "bg-green-500/15"  },
  machine_offline:  { icon: Wifi,        color: "text-red-400",    bg: "bg-red-500/15"    },
};

interface ActivityTimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export function ActivityTimeline({ events, className }: ActivityTimelineProps) {
  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border/50">
        <Activity className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs font-semibold">Activity Timeline</span>
        <span className="ml-auto text-[10px] text-muted-foreground">Today</span>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex items-center gap-0 h-full px-2 min-w-max">
          {events.map((event, index) => {
            const cfg = EVENT_CONFIG[event.type];
            const Icon = cfg.icon;

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="flex flex-col items-center gap-1.5 px-3 py-2 cursor-default group"
              >
                {/* Time */}
                <span className="text-[9px] text-muted-foreground font-mono">{event.time}</span>

                {/* Icon node */}
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center border border-border group-hover:scale-110 transition-transform",
                  cfg.bg
                )}>
                  <Icon className={cn("w-3 h-3", cfg.color)} />
                </div>

                {/* Connector line */}
                {index < events.length - 1 && (
                  <div className="absolute left-full top-1/2 w-4 h-px bg-border/50" style={{ marginTop: "2px" }} />
                )}

                {/* Description */}
                <p className="text-[9px] text-muted-foreground text-center max-w-20 leading-tight group-hover:text-foreground transition-colors">
                  {event.description.length > 40
                    ? event.description.slice(0, 38) + "…"
                    : event.description}
                </p>

                {event.machineId && (
                  <span className="text-[8px] font-bold text-blue-400 bg-blue-500/10 px-1 py-0.5 rounded">
                    {event.machineId}
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
