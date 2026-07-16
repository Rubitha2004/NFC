import { format } from "date-fns";
import { History, Activity } from "lucide-react";
import { usePlanningHistory } from "../hooks/usePlanning";

export function PlanningHistoryTab() {
  const { data: history = [], isLoading } = usePlanningHistory();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-white/50">
        <Activity className="w-5 h-5 animate-spin mr-2" />
        Loading history...
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-white/30 border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
        <History className="w-10 h-10 mb-3 opacity-30" />
        <p className="text-sm font-medium">No activity yet.</p>
        <p className="text-xs mt-1 text-white/20">Activity will appear here once bundles start moving.</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/50 rounded-xl border border-white/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-white/70">
          <thead className="bg-zinc-800/50 text-white/50 text-xs uppercase font-medium">
            <tr>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Bundle</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Operation</th>
              <th className="px-4 py-3">Operator</th>
              <th className="px-4 py-3">Tag ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {history.map((h: any, i: number) => (
              <tr key={h.id || i} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3 font-mono text-xs">{format(new Date(h.createdAt), "MMM d, HH:mm")}</td>
                <td className="px-4 py-3 font-medium text-emerald-400">{h.bundle?.bundleNumber || "N/A"}</td>
                <td className="px-4 py-3">{h.bundle?.productionOrder?.orderNumber || "N/A"}</td>
                <td className="px-4 py-3">{h.operation?.name || h.operation?.operationName || "N/A"}</td>
                <td className="px-4 py-3">
                  {h.operator ? `${h.operator.firstName} ${h.operator.lastName}` : "System"}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-white/50">{h.tag?.tagCode || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
