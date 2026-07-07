import type { BundleTxn } from "../../types/bundle-txn.types";
import { User, Settings, Package, LayoutGrid, Clock } from "lucide-react";

export function TxnHistory({ txn }: { txn: BundleTxn }) {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-white/50 mb-2">
            <Package className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Bundle</span>
          </div>
          <p className="text-lg font-bold text-white">{txn.bundleNumber}</p>
        </div>
        
        <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-white/50 mb-2">
            <LayoutGrid className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Operation</span>
          </div>
          <p className="text-lg font-bold text-white">{txn.operation}</p>
        </div>
        
        <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-white/50 mb-2">
            <User className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Worker</span>
          </div>
          <p className="text-sm font-medium text-white">{txn.worker}</p>
        </div>
        
        <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-white/50 mb-2">
            <Settings className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Machine Routing</span>
          </div>
          <p className="text-sm font-medium text-emerald-400">
            {txn.fromMachine ? `${txn.fromMachine} → ${txn.toMachine}` : txn.toMachine || "Unassigned"}
          </p>
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-5">
        <h3 className="text-xs font-bold text-white/80 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-400" /> Transaction Meta
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-white/50">Transaction ID</span>
            <span className="text-white font-mono">{txn.transactionId}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-white/50">Timestamp</span>
            <span className="text-white/80">{new Date(txn.timestamp).toLocaleString()}</span>
          </div>
          {txn.remarks && (
            <div className="pt-2 border-t border-white/5">
              <span className="text-xs text-white/50 block mb-1">Remarks</span>
              <p className="text-sm text-rose-400/80 bg-rose-500/10 p-2 rounded border border-rose-500/20">{txn.remarks}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
