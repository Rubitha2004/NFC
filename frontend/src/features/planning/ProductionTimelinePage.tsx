import { Clock } from "lucide-react";

// Mock Timeline data as per user's request
const TIMELINE = [
  { time: "09:00", event: "Planning Created", type: "system" },
  { time: "09:10", event: "Worker Assigned (EMP002)", type: "assignment" },
  { time: "09:15", event: "Machine Assigned (M12)", type: "assignment" },
  { time: "09:20", event: "RFID Authenticated", type: "auth" },
  { time: "09:25", event: "Bundle Started", type: "production" },
  { time: "10:15", event: "Bundle Completed", type: "production" },
  { time: "10:18", event: "QC Passed", type: "qc" },
  { time: "10:20", event: "Sent to Next Operation", type: "transfer" },
];

export default function ProductionTimelinePage() {
  return (
    <div className="flex flex-col h-full bg-zinc-950 text-white overflow-y-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Production History</h1>
          <p className="text-sm text-white/50 mt-1">Auditable timeline of production events</p>
        </div>
      </div>

      <div className="max-w-2xl bg-zinc-900/50 border border-white/5 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Production Order: PO-2026-X1</h2>
        
        <div className="relative border-l border-zinc-700 ml-4 space-y-6">
          {TIMELINE.map((item, i) => (
            <div key={i} className="relative pl-6">
              <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-zinc-900" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">{item.event}</span>
                <span className="text-xs text-white/40 flex items-center mt-1">
                  <Clock className="w-3 h-3 mr-1" /> {item.time} AM
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
