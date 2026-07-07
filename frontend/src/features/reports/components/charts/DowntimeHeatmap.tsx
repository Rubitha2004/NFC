import { useMemo } from "react";

export function DowntimeHeatmap({ data }: { data: { machine: string, shift: string, severity: number }[] }) {
  const machines = useMemo(() => Array.from(new Set(data.map(d => d.machine))), [data]);
  const shifts = useMemo(() => Array.from(new Set(data.map(d => d.shift))), [data]);

  const getColor = (severity: number) => {
    if (severity < 20) return "bg-emerald-500/20";
    if (severity < 40) return "bg-emerald-500/50";
    if (severity < 60) return "bg-amber-500/50";
    if (severity < 80) return "bg-rose-500/50";
    return "bg-rose-500/80";
  };

  return (
    <div className="w-full overflow-x-auto min-h-[300px] flex flex-col items-center justify-center">
      <div className="grid gap-1" style={{ gridTemplateColumns: `auto repeat(${shifts.length}, minmax(40px, 1fr))` }}>
        <div className="p-2"></div>
        {shifts.map(s => (
          <div key={s} className="p-2 text-xs text-white/50 text-center font-medium">{s}</div>
        ))}
        
        {machines.map(m => (
          <div key={m} className="contents">
            <div className="p-2 text-xs text-white/50 text-right pr-4 font-mono flex items-center justify-end">{m}</div>
            {shifts.map(s => {
              const cellData = data.find(d => d.machine === m && d.shift === s);
              const severity = cellData?.severity || 0;
              return (
                <div 
                  key={`${m}-${s}`} 
                  className={`h-8 sm:h-12 rounded-md ${getColor(severity)} transition-colors hover:ring-2 hover:ring-white/30 cursor-pointer`}
                  title={`${m} - ${s}: ${severity}% Severity`}
                />
              );
            })}
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex items-center gap-4 text-xs text-white/40">
        <span>Low Severity</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 rounded bg-emerald-500/20"></div>
          <div className="w-4 h-4 rounded bg-emerald-500/50"></div>
          <div className="w-4 h-4 rounded bg-amber-500/50"></div>
          <div className="w-4 h-4 rounded bg-rose-500/50"></div>
          <div className="w-4 h-4 rounded bg-rose-500/80"></div>
        </div>
        <span>High Severity</span>
      </div>
    </div>
  );
}
