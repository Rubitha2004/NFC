import React from 'react';
import { Layers, ArrowRight, Lock, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BundleDemoCardProps {
  bundle: any;
  isLocked: boolean;
  onAdvance: () => void;
  isLoading: boolean;
}

export function BundleDemoCard({ bundle, isLocked, onAdvance, isLoading }: BundleDemoCardProps) {
  const status = bundle.status || 'CREATED';
  const completedQty = bundle.completedQuantity || 0;
  const totalQty = bundle.quantity || 10;
  const percent = Math.min(100, Math.round((completedQty / totalQty) * 100));

  const statusConfig: Record<string, { label: string; badge: string; nextLabel: string }> = {
    CREATED: {
      label: isLocked ? 'Locked' : 'Ready',
      badge: isLocked ? 'bg-zinc-800/80 text-zinc-500 border-white/5' : 'bg-blue-500/15 text-blue-400 border-blue-500/25',
      nextLabel: isLocked ? 'Locked (Complete Previous Bundle First)' : 'Click to Start Scanning → In Progress',
    },
    IN_PROGRESS: {
      label: 'In Progress',
      badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
      nextLabel: 'Click to Complete Bundle → 100%',
    },
    COMPLETED: {
      label: 'Completed',
      badge: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
      nextLabel: 'Click to Close & Transfer to QC',
    },
    QC_COMPLETED: {
      label: 'Closed',
      badge: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
      nextLabel: 'Completed & Closed',
    },
  };

  const currentConfig = statusConfig[status] || statusConfig.CREATED;

  return (
    <div
      onClick={() => !isLoading && !isLocked && onAdvance()}
      className={cn(
        'group relative p-4 rounded-2xl border transition-all duration-300 overflow-hidden select-none',
        isLocked
          ? 'bg-zinc-950/40 border-white/5 opacity-50 cursor-not-allowed'
          : status === 'IN_PROGRESS'
          ? 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/60 cursor-pointer'
          : status === 'COMPLETED' || status === 'QC_COMPLETED'
          ? 'bg-purple-950/20 border-purple-500/30 hover:border-purple-500/60 cursor-pointer'
          : 'bg-zinc-900/60 border-white/8 hover:border-blue-500/40 cursor-pointer hover:bg-zinc-900/90',
        isLoading && 'opacity-70 pointer-events-none'
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-zinc-800 border border-white/10 text-violet-400">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold font-mono text-white group-hover:text-violet-300 transition-colors">
              {bundle.bundleNumber}
            </h4>
            <p className="text-[10px] text-white/40 truncate max-w-[110px]">
              {bundle.quantity} Pcs Batch
            </p>
          </div>
        </div>

        <span
          className={cn(
            'inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider shrink-0',
            currentConfig.badge
          )}
        >
          {isLocked ? <Lock className="w-2.5 h-2.5" /> : null}
          {currentConfig.label}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="my-2.5">
        <div className="flex items-center justify-between text-[9px] text-white/40 mb-1">
          <span>Production Progress</span>
          <span className="font-bold text-white/70">
            {completedQty} / {totalQty} ({percent}%)
          </span>
        </div>
        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden border border-white/5">
          <div
            className={cn(
              'h-full transition-all duration-500 rounded-full',
              status === 'COMPLETED' || status === 'QC_COMPLETED'
                ? 'bg-gradient-to-r from-purple-500 to-violet-400'
                : 'bg-gradient-to-r from-blue-500 to-emerald-400'
            )}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[9px] text-white/40">
        <span className="truncate group-hover:text-white/80 transition-colors font-medium">
          {currentConfig.nextLabel}
        </span>
        {isLoading ? (
          <Loader2 className="w-3 h-3 text-violet-400 animate-spin shrink-0" />
        ) : isLocked ? (
          <Lock className="w-3 h-3 text-white/20 shrink-0" />
        ) : (
          <ArrowRight className="w-3 h-3 text-white/30 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all shrink-0" />
        )}
      </div>
    </div>
  );
}
