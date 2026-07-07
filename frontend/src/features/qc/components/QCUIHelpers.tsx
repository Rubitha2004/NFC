import { cn } from "@/lib/utils";
import type { QCResult } from "../types/qc.types";
import { CheckCircle2, XCircle, AlertTriangle, Clock } from "lucide-react";

export function QCStatusBadge({ result }: { result: QCResult }) {
  const config = {
    Pass: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", icon: CheckCircle2 },
    Fail: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20", icon: XCircle },
    Rework: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", icon: AlertTriangle },
    Pending: { bg: "bg-zinc-500/10", text: "text-zinc-400", border: "border-zinc-500/20", icon: Clock },
  };
  const c = config[result];
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
      {result}
    </span>
  );
}
