import React from 'react';
import { Cpu, Zap, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MachineDemoCardProps {
  machine: any;
  isRunning: boolean;
  isWorkerPresent: boolean;
  assignedWorkerName?: string;
  onToggle: () => void;
  isLoading: boolean;
}

export function MachineDemoCard({
  machine,
  isRunning,
  isWorkerPresent,
  assignedWorkerName,
  onToggle,
  isLoading,
}: MachineDemoCardProps) {
  const code = machine.machineCode || `MCH-${machine.id}`;
  const name = machine.machineName || machine.name || 'Workstation';

  // Machine States: Idle (Gray) -> Ready (Blue when worker present) -> Running (Green)
  const isReady = isWorkerPresent && !isRunning;
  const statusLabel = isRunning ? 'Running' : isReady ? 'Ready' : 'Idle';

  return (
    <div
      onClick={() => !isLoading && onToggle()}
      className={cn(
        'group relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden select-none',
        isRunning
          ? 'bg-emerald-950/30 border-emerald-500/40 hover:border-emerald-500/70 shadow-lg shadow-emerald-950/20'
          : isReady
            ? 'bg-blue-950/30 border-blue-500/30 hover:border-blue-500/60'
            : 'bg-zinc-900/60 border-white/8 hover:border-white/20 hover:bg-zinc-900/90',
        isLoading && 'opacity-70 pointer-events-none'
      )}
    >
      {/* Top state bar */}
      <div
        className={cn(
          'absolute top-0 left-0 right-0 h-1 transition-colors',
          isRunning ? 'bg-emerald-500' : isReady ? 'bg-blue-500' : 'bg-zinc-700'
        )}
      />

      <div className="flex items-start justify-between gap-3 mb-3 pt-1">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              'w-9 h-9 rounded-xl flex items-center justify-center font-mono font-black text-xs transition-colors',
              isRunning
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : isReady
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : 'bg-zinc-800 text-zinc-400 border border-white/10'
            )}
          >
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors font-mono">
              {code}
            </h4>
            <p className="text-[10px] text-white/40 truncate max-w-[110px]">{name}</p>
          </div>
        </div>

        {/* State Badge: Idle (Gray) -> Ready (Blue) -> Running (Green) */}
        <span
          className={cn(
            'inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider shrink-0',
            isRunning
              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
              : isReady
                ? 'bg-blue-500/15 text-blue-400 border-blue-500/25'
                : 'bg-zinc-800 text-zinc-400 border-white/10'
          )}
        >
          <Zap className={cn('w-2.5 h-2.5', isRunning && 'animate-pulse text-emerald-400')} />
          {statusLabel}
        </span>
      </div>

      <div className="flex items-center justify-between text-[10px] text-white/40 pt-2 border-t border-white/5">
        <span className={cn('truncate font-medium', isWorkerPresent ? 'text-emerald-400/80' : 'text-white/30')}>
          {isWorkerPresent ? `● ${assignedWorkerName || 'Operator Present'}` : 'Worker Absent'}
        </span>
        <span className="text-[9px] font-mono text-white/30 bg-zinc-800 px-1.5 py-0.5 rounded shrink-0">
          {machine.department?.name || 'Sewing'}
        </span>
      </div>

      <div className="mt-2 text-[9px] text-center text-white/20 group-hover:text-blue-400 font-mono transition-colors">
        {isLoading ? (
          <span className="flex items-center justify-center gap-1 text-blue-400">
            <Loader2 className="w-3 h-3 animate-spin" /> Toggling Machine…
          </span>
        ) : (
          `Click to Toggle ${isRunning ? 'IDLE' : 'RUNNING'}`
        )}
      </div>
    </div>
  );
}
