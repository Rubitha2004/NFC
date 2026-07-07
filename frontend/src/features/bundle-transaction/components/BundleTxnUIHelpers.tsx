import { cn } from "@/lib/utils";
import type { TxnStatus } from "../types/bundle-txn.types";
import { PlayCircle, CheckCircle2, ArrowRightLeft, AlertTriangle, Clock, ShieldCheck } from "lucide-react";

export function TxnStatusBadge({ status }: { status: TxnStatus }) {
  const config = {
    Started: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20", icon: PlayCircle },
    Completed: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", icon: CheckCircle2 },
    Transferred: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20", icon: ArrowRightLeft },
    Rework: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20", icon: AlertTriangle },
    Pending: { bg: "bg-zinc-500/10", text: "text-zinc-400", border: "border-zinc-500/20", icon: Clock },
    QC: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", icon: ShieldCheck },
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
