import React from 'react';
import { CheckCircle2, XCircle, Loader2, Clock, UserCheck, UserX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkerDemoCardProps {
  worker: any;
  latestAttendance?: {
    attendanceType: string;
    tapTime?: string | Date;
  } | null;
  isPresent?: boolean;
  operationName?: string;
  machineCode?: string;
  onToggle: () => void;
  isLoading: boolean;
}

export function WorkerDemoCard({
  worker,
  latestAttendance,
  isPresent: legacyIsPresent,
  operationName,
  machineCode,
  onToggle,
  isLoading,
}: WorkerDemoCardProps) {
  const name = `${worker.firstName || ''} ${worker.lastName || ''}`.trim() || worker.employeeCode;

  // Determine tap state: 'IN' (Checked-IN / Green), 'OUT' (Checked-OUT / Red), or 'NONE' (Assigned / Ready)
  const attendanceType = latestAttendance?.attendanceType || (legacyIsPresent ? 'IN' : 'NONE');
  const isCheckedIn = attendanceType === 'IN';
  const isCheckedOut = attendanceType === 'OUT';

  const formatTime = (timeVal?: string | Date) => {
    if (!timeVal) return '';
    try {
      const date = new Date(timeVal);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    } catch {
      return '';
    }
  };

  const tapTimeStr = formatTime(latestAttendance?.tapTime);

  return (
    <div
      onClick={() => !isLoading && onToggle()}
      className={cn(
        'group relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden select-none',
        isCheckedIn && 'bg-emerald-950/70 border-emerald-500 hover:border-emerald-400 shadow-xl shadow-emerald-950/50',
        isCheckedOut && 'bg-rose-950/70 border-rose-500 hover:border-rose-400 shadow-xl shadow-rose-950/50',
        !isCheckedIn && !isCheckedOut && 'bg-zinc-900/60 border-white/10 hover:border-blue-500/40 hover:bg-zinc-900/90',
        isLoading && 'opacity-70 pointer-events-none'
      )}
    >
      {/* Top state bar */}
      <div
        className={cn(
          'absolute top-0 left-0 right-0 h-1.5 transition-colors',
          isCheckedIn && 'bg-emerald-500',
          isCheckedOut && 'bg-rose-500',
          !isCheckedIn && !isCheckedOut && 'bg-blue-500/60'
        )}
      />

      <div className="flex items-start justify-between gap-3 mb-3 pt-1">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              'w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs transition-colors',
              isCheckedIn && 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
              isCheckedOut && 'bg-rose-500/20 text-rose-300 border border-rose-500/40',
              !isCheckedIn && !isCheckedOut && 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
            )}
          >
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4
              className={cn(
                'text-xs font-bold transition-colors truncate max-w-[130px]',
                isCheckedIn && 'text-emerald-200 group-hover:text-emerald-100',
                isCheckedOut && 'text-rose-200 group-hover:text-rose-100',
                !isCheckedIn && !isCheckedOut && 'text-white group-hover:text-blue-300'
              )}
            >
              {name}
            </h4>
            <p className="text-[10px] font-mono text-white/40">{worker.employeeCode}</p>
          </div>
        </div>

        {/* State Badge: Green for Checked-IN, Red for Checked-OUT, Blue for Ready */}
        <span
          className={cn(
            'inline-flex items-center gap-1 text-[9px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider shrink-0 shadow-sm',
            isCheckedIn && 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-950/40',
            isCheckedOut && 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-rose-950/40',
            !isCheckedIn && !isCheckedOut && 'bg-blue-500/15 text-blue-300 border-blue-500/25'
          )}
        >
          {isCheckedIn && <UserCheck className="w-3 h-3 text-emerald-400" />}
          {isCheckedOut && <UserX className="w-3 h-3 text-rose-400" />}
          {!isCheckedIn && !isCheckedOut && <XCircle className="w-3 h-3 text-blue-400" />}
          {isCheckedIn ? 'Checked-IN' : isCheckedOut ? 'Checked-OUT' : 'Ready'}
        </span>
      </div>

      {/* Tap Time Indicator */}
      {tapTimeStr && (
        <div className="mb-2 px-2.5 py-1 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between text-[10px]">
          <span className="text-white/40 flex items-center gap-1 font-sans">
            <Clock className="w-3 h-3 text-white/30" />
            {isCheckedIn ? 'Check-IN:' : 'Check-OUT:'}
          </span>
          <span
            className={cn(
              'font-mono font-bold',
              isCheckedIn ? 'text-emerald-400' : 'text-rose-400'
            )}
          >
            {tapTimeStr}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between text-[10px] text-white/40 pt-2 border-t border-white/5">
        <span className="truncate">{operationName || 'Operation'}</span>
        {machineCode && (
          <span className="font-mono text-blue-400/80 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20 shrink-0">
            {machineCode}
          </span>
        )}
      </div>

      <div className="mt-2.5 text-[9px] text-center font-mono transition-colors text-white/40 group-hover:text-white">
        {isLoading ? (
          <span className="flex items-center justify-center gap-1 text-amber-400 font-bold">
            <Loader2 className="w-3 h-3 animate-spin" /> Tapping NFC…
          </span>
        ) : (
          <span
            className={cn(
              'px-2.5 py-1 rounded-lg border font-semibold inline-block transition-all',
              isCheckedIn && 'bg-rose-500/20 border-rose-500/40 text-rose-300 group-hover:bg-rose-500/40',
              !isCheckedIn && 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 group-hover:bg-emerald-500/40'
            )}
          >
            Simulate NFC {isCheckedIn ? 'Check-OUT' : 'Check-IN'}
          </span>
        )}
      </div>
    </div>
  );
}
