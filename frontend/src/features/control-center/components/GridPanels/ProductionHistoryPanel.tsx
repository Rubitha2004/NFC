import { History, ArrowRight } from "lucide-react";


export function ProductionHistoryPanel() {
  const historyEvents = [
    { time: "09:00", event: "Planning Created", order: "PO-1044" },
    { time: "09:05", event: "Worker Assigned", order: "PO-1044", detail: "Jane Doe" },
    { time: "09:10", event: "Machine Assigned", order: "PO-1044", detail: "Stitching M-04" },
    { time: "09:15", event: "Released to Factory", order: "PO-1044" },
    { time: "09:22", event: "RFID Authenticated", order: "PO-1044", detail: "Term: TRM-04" },
    { time: "09:25", event: "Production Started", order: "PO-1044" },
  ];

  return (
    <div className="flex flex-col h-full bg-zinc-900/50 rounded-xl overflow-hidden relative">
      <div className="flex-shrink-0 px-4 py-2 border-b border-white/5 bg-zinc-900/80 flex items-center gap-2 z-10">
        <History className="w-4 h-4 text-zinc-400" />
        <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Production Audit Trail</h3>
      </div>
      
      <div className="flex-1 overflow-x-auto overflow-y-hidden relative p-3 custom-scrollbar flex items-center">
        <div className="flex items-center min-w-max px-2">
          {historyEvents.map((ev, i) => (
            <div key={i} className="flex items-center group">
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mb-2 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <div className="text-[10px] font-mono text-emerald-400">{ev.time}</div>
                <div className="text-xs font-semibold text-white mt-1 whitespace-nowrap">{ev.event}</div>
                <div className="text-[10px] text-white/50">{ev.order} {ev.detail && `• ${ev.detail}`}</div>
              </div>
              
              {i < historyEvents.length - 1 && (
                <div className="w-16 h-px bg-white/10 mx-4 relative flex items-center justify-center">
                  <ArrowRight className="w-3 h-3 text-white/20" />
                </div>
              )}
            </div>
          ))}
          
          <div className="flex items-center ml-4 opacity-50">
            <div className="w-16 h-px bg-white/10 border-t border-dashed relative flex items-center justify-center">
               <ArrowRight className="w-3 h-3 text-white/20" />
            </div>
            <div className="ml-4 flex flex-col items-center">
              <div className="w-2 h-2 rounded-full bg-zinc-700 mb-2" />
              <div className="text-[10px] font-mono text-zinc-500">Pending</div>
              <div className="text-xs font-semibold text-zinc-400 mt-1 whitespace-nowrap">Bundle Completed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
