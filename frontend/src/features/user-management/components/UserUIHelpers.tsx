import { cn } from "@/lib/utils";
import type { UserStatus, UserRole } from "../types/user.types";
import { ShieldCheck, UserCheck, UserX, Lock, Users, Settings, Eye, Package } from "lucide-react";

export function UserStatusBadge({ status }: { status: UserStatus }) {
  const config = {
    Active: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", icon: UserCheck },
    Inactive: { bg: "bg-zinc-500/10", text: "text-zinc-400", border: "border-zinc-500/20", icon: UserX },
    Locked: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20", icon: Lock },
  };
  const c = config[status];
  const Icon = c.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border",
        c.bg,
        c.text,
        c.border
      )}
    >
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
}

export function UserRolePill({ role }: { role: UserRole }) {
  const config: Record<UserRole, { bg: string, text: string, icon: any }> = {
    "Administrator": { bg: "bg-purple-500/20", text: "text-purple-400", icon: ShieldCheck },
    "Production Manager": { bg: "bg-blue-500/20", text: "text-blue-400", icon: Settings },
    "Supervisor": { bg: "bg-amber-500/20", text: "text-amber-400", icon: Users },
    "HR": { bg: "bg-pink-500/20", text: "text-pink-400", icon: Users },
    "Quality Inspector": { bg: "bg-emerald-500/20", text: "text-emerald-400", icon: ShieldCheck },
    "Machine Operator": { bg: "bg-cyan-500/20", text: "text-cyan-400", icon: Package },
    "Viewer": { bg: "bg-zinc-500/20", text: "text-zinc-400", icon: Eye },
  };
  
  const c = config[role] || config["Viewer"];
  const Icon = c.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold whitespace-nowrap",
        c.bg,
        c.text
      )}
    >
      <Icon className="w-3 h-3" />
      {role}
    </span>
  );
}
