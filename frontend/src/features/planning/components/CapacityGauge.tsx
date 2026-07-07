import { cn } from "@/lib/utils";

interface CapacityGaugeProps {
  requiredMinutes: number;
  assignedWorkersCount: number;
  shiftMinutes?: number; // default to 480 (8 hours)
}

export function CapacityGauge({ requiredMinutes, assignedWorkersCount, shiftMinutes = 480 }: CapacityGaugeProps) {
  const providedMinutes = assignedWorkersCount * shiftMinutes;
  
  let percentage = 0;
  if (requiredMinutes > 0) {
    percentage = (providedMinutes / requiredMinutes) * 100;
  }
  
  const isBottleneck = percentage < 100;
  const isOverstaffed = percentage > 150;
  const isOptimal = percentage >= 100 && percentage <= 150;

  let statusColor = "bg-zinc-500";
  let textColor = "text-zinc-400";
  let label = "No Allocation";

  if (assignedWorkersCount > 0) {
    if (isBottleneck) {
      statusColor = "bg-rose-500";
      textColor = "text-rose-400";
      label = "Bottleneck (Under-resourced)";
    } else if (isOverstaffed) {
      statusColor = "bg-amber-500";
      textColor = "text-amber-400";
      label = "Over-resourced";
    } else if (isOptimal) {
      statusColor = "bg-emerald-500";
      textColor = "text-emerald-400";
      label = "Capacity Met";
    }
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-1">
        <span className={cn("text-xs font-semibold", textColor)}>{label}</span>
        <span className="text-xs text-white/50 font-mono">
          {Math.round(providedMinutes / 60)}h / {Math.ceil(requiredMinutes / 60)}h
        </span>
      </div>
      <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden flex">
        <div 
          className={cn("h-full transition-all duration-500", statusColor)}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
        {percentage > 100 && (
          <div 
            className="h-full bg-amber-500/50 transition-all duration-500 border-l border-black/20"
            style={{ width: `${Math.min(percentage - 100, 50)}%` }}
          />
        )}
      </div>
    </div>
  );
}
