import { cn } from "@/lib/utils";
import type { AttendanceStatus, NFCEvent } from "../types/attendance.types";

export function AttendanceStatusBadge({ status, isLate }: { status: AttendanceStatus, isLate?: boolean }) {
  if (isLate && status === "present") {
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
        Late
      </span>
    );
  }

  const config = {
    present: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", label: "Present" },
    absent: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20", label: "Absent" },
    late: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", label: "Late" },
    on_leave: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20", label: "On Leave" },
    half_day: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20", label: "Half Day" },
  };
  const c = config[status as keyof typeof config] || { bg: "bg-zinc-500/10", text: "text-zinc-400", border: "border-zinc-500/20", label: status || "Unknown" };

  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
        c.bg,
        c.text,
        c.border
      )}
    >
      {c.label}
    </span>
  );
}

export function EventTypeBadge({ type }: { type: NFCEvent["type"] }) {
  const config = {
    check_in: { color: "text-emerald-400", bg: "bg-emerald-500/10", label: "Check In" },
    check_out: { color: "text-amber-400", bg: "bg-amber-500/10", label: "Check Out" },
    machine_login: { color: "text-blue-400", bg: "bg-blue-500/10", label: "Mch Login" },
    machine_logout: { color: "text-purple-400", bg: "bg-purple-500/10", label: "Mch Logout" },
  };
  const c = config[type as keyof typeof config] || 
    ((type as any) === 'IN' ? config.check_in : 
     (type as any) === 'OUT' ? config.check_out : 
     { color: "text-zinc-400", bg: "bg-zinc-500/10", label: type || "Event" });

  return (
    <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider", c.bg, c.color)}>
      {c.label}
    </span>
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
