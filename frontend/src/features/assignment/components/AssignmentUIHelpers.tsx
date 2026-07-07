import { cn } from "@/lib/utils";
import type { AssignmentStatus, AssignmentPriority } from "../types/assignment.types";

export function AssignmentStatusBadge({ status }: { status: AssignmentStatus }) {
  const config = {
    active: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
    pending: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
    completed: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
    cancelled: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20" },
  };
  const c = config[status];

  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded text-xs font-medium border uppercase tracking-wider",
        c.bg,
        c.text,
        c.border
      )}
    >
      {status}
    </span>
  );
}

export function AssignmentPriorityBadge({ priority }: { priority: AssignmentPriority }) {
  const config = {
    high: "text-rose-400",
    medium: "text-amber-400",
    low: "text-blue-400",
  };

  return (
    <div className="flex items-center gap-1.5">
      <span className={cn("w-1.5 h-1.5 rounded-full", config[priority].replace("text-", "bg-"))} />
      <span className={cn("text-xs font-medium uppercase tracking-wider", config[priority])}>
        {priority}
      </span>
    </div>
  );
}

export function WorkerAvatarCell({ name, employeeCode }: { name: string; employeeCode: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400 text-xs flex-shrink-0">
        {initials}
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-white text-sm leading-tight truncate">{name}</p>
        <p className="text-[10px] text-white/40 font-mono truncate">{employeeCode}</p>
      </div>
    </div>
  );
}
