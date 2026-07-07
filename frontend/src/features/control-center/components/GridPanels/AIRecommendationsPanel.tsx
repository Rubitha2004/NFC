import { BrainCircuit, Sparkles, UserCheck, Settings2, PlayCircle } from "lucide-react";
import { useControlCenterStore } from "../../store/controlCenter.store";

export function AIRecommendationsPanel() {
  const { selectedOrderId, setValidationModalOpen } = useControlCenterStore();

  if (!selectedOrderId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-emerald-950/10 relative overflow-hidden">
        <BrainCircuit className="w-10 h-10 text-emerald-500/20 mb-3" />
        <p className="text-sm text-emerald-400/50 font-medium">Select a Production Order</p>
        <p className="text-[10px] text-emerald-400/30 mt-1">AI will generate optimal resource mapping</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-zinc-900/40 relative overflow-hidden">
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />
      
      <div className="px-4 py-3 border-b border-emerald-500/10 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-emerald-50">AI Scheduler</h3>
        </div>
        <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">
          {selectedOrderId}
        </span>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4 z-10 custom-scrollbar">
        <div className="space-y-3">
          <div className="bg-zinc-950/50 rounded-lg p-3 border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <UserCheck className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-semibold text-white">Recommended Worker</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-white">Jane Doe (Senior)</div>
                <div className="text-[10px] text-white/50">Skill match: 98% • Available in 10m</div>
              </div>
              <div className="text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded">
                +15% Eff.
              </div>
            </div>
          </div>

          <div className="bg-zinc-950/50 rounded-lg p-3 border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <Settings2 className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-semibold text-white">Optimal Machine</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-white">Stitching M-04</div>
                <div className="text-[10px] text-white/50">Maintenance OK • Setup Ready</div>
              </div>
              <div className="text-amber-400 text-xs font-bold bg-amber-500/10 px-2 py-1 rounded">
                Zero Delay
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-2">
          <button 
            onClick={() => setValidationModalOpen(true)}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold"
          >
            <PlayCircle className="w-4 h-4" />
            Validate & Release
          </button>
        </div>
      </div>
    </div>
  );
}
