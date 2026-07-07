import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { MachineStatus, MachineHealth } from "../types/machine.types";

// ─── Status Badge ─────────────────────────────────────────────────────────────

const STATUS_MAP: Record<
  MachineStatus,
  { label: string; cls: string; dot: string }
> = {
  running: {
    label: "Running",
    cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    dot: "bg-emerald-500 animate-pulse",
  },
  idle: {
    label: "Idle",
    cls: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    dot: "bg-amber-400",
  },
  offline: {
    label: "Offline",
    cls: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    dot: "bg-zinc-500",
  },
  maintenance: {
    label: "Maintenance",
    cls: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    dot: "bg-rose-400",
  },
  error: {
    label: "Error",
    cls: "bg-red-500/10 text-red-400 border-red-500/20",
    dot: "bg-red-500 animate-pulse",
  },
};

export function StatusBadge({ status }: { status: MachineStatus }) {
  const cfg = STATUS_MAP[status] ?? STATUS_MAP.offline;
  return (
    <Badge
      variant="outline"
      className={cn("flex items-center gap-1.5 font-semibold px-2 py-0.5", cfg.cls)}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", cfg.dot)} />
      {cfg.label}
    </Badge>
  );
}

// ─── Health Badge ─────────────────────────────────────────────────────────────

const HEALTH_MAP: Record<
  MachineHealth,
  { label: string; cls: string; bar: string }
> = {
  healthy: {
    label: "Healthy",
    cls: "bg-green-500/10 text-green-400 border-green-500/20",
    bar: "bg-green-500",
  },
  warning: {
    label: "Warning",
    cls: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    bar: "bg-amber-400",
  },
  critical: {
    label: "Critical",
    cls: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    bar: "bg-rose-500",
  },
  unknown: {
    label: "Unknown",
    cls: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    bar: "bg-zinc-500",
  },
};

export function HealthBadge({
  health,
  score,
}: {
  health: MachineHealth;
  score: number;
}) {
  const cfg = HEALTH_MAP[health] ?? HEALTH_MAP.unknown;
  return (
    <div className="flex items-center gap-2">
      <Badge
        variant="outline"
        className={cn("font-semibold px-2 py-0.5 text-xs", cfg.cls)}
      >
        {cfg.label}
      </Badge>
      <div className="w-14 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", cfg.bar)}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

// ─── Heartbeat Cell ───────────────────────────────────────────────────────────

export function HeartbeatCell({ timestamp }: { timestamp: string }) {
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 2) {
    return (
      <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Live
      </span>
    );
  }
  if (diffMin < 60) {
    return (
      <span className="text-amber-400 text-xs">{diffMin}m ago</span>
    );
  }
  const diffHr = Math.floor(diffMin / 60);
  return <span className="text-zinc-500 text-xs">{diffHr}h ago</span>;
}

// ─── Machine Icon ─────────────────────────────────────────────────────────────

export function MachineAvatar({
  machineId,
  type,
}: {
  machineId: string;
  type: string;
}) {
  const colors = [
    { bg: "bg-orange-500/15 border-orange-500/30", text: "text-orange-400" },
    { bg: "bg-cyan-500/15 border-cyan-500/30", text: "text-cyan-400" },
    { bg: "bg-violet-500/15 border-violet-500/30", text: "text-violet-400" },
    { bg: "bg-emerald-500/15 border-emerald-500/30", text: "text-emerald-400" },
    { bg: "bg-rose-500/15 border-rose-500/30", text: "text-rose-400" },
  ];
  const colorIdx =
    machineId.charCodeAt(machineId.length - 1) % colors.length;
  const c = colors[colorIdx];
  const abbr = type
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={cn(
        "w-9 h-9 rounded-lg border flex items-center justify-center font-bold text-xs flex-shrink-0",
        c.bg,
        c.text
      )}
    >
      {abbr}
    </div>
  );
}
