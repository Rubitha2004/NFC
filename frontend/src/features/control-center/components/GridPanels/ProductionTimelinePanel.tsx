import { CalendarDays } from "lucide-react";
import { useControlCenterStore } from "../../store/controlCenter.store";

export function ProductionTimelinePanel() {
  const { selectedOrderId } = useControlCenterStore();

  return (
    <div className="flex flex-col h-full bg-zinc-900/50 rounded-xl overflow-hidden relative">
      <div className="flex-shrink-0 px-4 py-3 border-b border-white/5 bg-zinc-900/80 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-semibold text-white">Production Calendar & Timeline</h3>
        </div>
        <div className="flex gap-1">
          <button className="px-2 py-1 text-[10px] font-semibold bg-white/10 hover:bg-white/20 rounded text-white transition-colors">Daily</button>
          <button className="px-2 py-1 text-[10px] font-semibold bg-zinc-800 text-white/50 hover:text-white transition-colors">Weekly</button>
        </div>
      </div>
      
      <div className="flex-1 overflow-x-auto overflow-y-hidden relative custom-scrollbar">
        {/* Placeholder for the Gantt Chart / Timeline */}
        <div className="min-w-[800px] h-full p-4 flex flex-col gap-2 relative">
          
          {/* Time scale header */}
          <div className="flex border-b border-white/5 pb-2 mb-2 text-[10px] text-white/40 font-mono">
            <div className="w-32 flex-shrink-0">Resource</div>
            <div className="flex-1 flex justify-between px-2">
              <span>08:00</span>
              <span>10:00</span>
              <span>12:00</span>
              <span>14:00</span>
              <span>16:00</span>
              <span>18:00</span>
            </div>
          </div>

          {/* Timeline rows */}
          <div className="flex items-center group">
            <div className="w-32 flex-shrink-0 text-xs font-semibold text-white/80 group-hover:text-white truncate">Line A (Cutting)</div>
            <div className="flex-1 h-8 bg-zinc-950/50 rounded-md relative overflow-hidden border border-white/5">
              <div className="absolute left-[10%] w-[30%] h-full bg-emerald-500/20 border-l-2 border-emerald-500 flex items-center px-2">
                <span className="text-[10px] font-bold text-emerald-400 truncate">PO-1044</span>
              </div>
              <div className="absolute left-[45%] w-[40%] h-full bg-blue-500/20 border-l-2 border-blue-500 flex items-center px-2">
                <span className="text-[10px] font-bold text-blue-400 truncate">PO-1045</span>
              </div>
            </div>
          </div>

          <div className="flex items-center group">
            <div className="w-32 flex-shrink-0 text-xs font-semibold text-white/80 group-hover:text-white truncate">Line B (Stitching)</div>
            <div className="flex-1 h-8 bg-zinc-950/50 rounded-md relative overflow-hidden border border-white/5">
              <div className="absolute left-[0%] w-[20%] h-full bg-emerald-500/20 border-l-2 border-emerald-500 flex items-center px-2">
                <span className="text-[10px] font-bold text-emerald-400 truncate">PO-1042</span>
              </div>
              <div className="absolute left-[25%] w-[60%] h-full bg-purple-500/20 border-l-2 border-purple-500 flex items-center px-2">
                <span className="text-[10px] font-bold text-purple-400 truncate">PO-1044</span>
              </div>
            </div>
          </div>

          {selectedOrderId && (
            <div className="absolute top-0 bottom-0 left-[60%] w-px bg-red-500/50 border-l border-dashed border-red-500 z-10">
              <div className="absolute -top-1 -translate-x-1/2 bg-red-500 text-white text-[9px] font-bold px-1 rounded">
                SIMULATION
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
