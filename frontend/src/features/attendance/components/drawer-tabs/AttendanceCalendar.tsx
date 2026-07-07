import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Dummy status generator for calendar
const generateCalendarData = () => {
  const data: Record<number, "present" | "absent" | "late" | "leave" | "weekend"> = {};
  for (let i = 1; i <= 31; i++) {
    const day = (i + 2) % 7; // offset for mock month
    if (day === 0 || day === 6) data[i] = "weekend";
    else if (Math.random() < 0.05) data[i] = "absent";
    else if (Math.random() < 0.1) data[i] = "leave";
    else if (Math.random() < 0.15) data[i] = "late";
    else data[i] = "present";
  }
  return data;
};

export function AttendanceCalendar() {
  const calendarData = useMemo(() => generateCalendarData(), []);
  const daysInMonth = 31;
  const startDay = 3; // Mock offset (Wednesday)

  const getDayClass = (status: string) => {
    switch (status) {
      case "present": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-bold";
      case "absent": return "bg-rose-500/20 text-rose-400 border-rose-500/30 font-bold";
      case "late": return "bg-amber-500/20 text-amber-400 border-amber-500/30 font-bold";
      case "leave": return "bg-blue-500/20 text-blue-400 border-blue-500/30 font-bold";
      case "weekend": return "bg-zinc-900/50 text-white/30 border-white/5";
      default: return "bg-zinc-900/50 text-white border-white/5";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">July 2026</h3>
        <div className="flex items-center gap-2">
          <button className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 text-white border border-white/10">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 text-white border border-white/10">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-white/40 uppercase tracking-wider mb-2">
            {d}
          </div>
        ))}
        
        {Array.from({ length: startDay }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const date = i + 1;
          const status = calendarData[date];
          return (
            <div
              key={date}
              className={cn(
                "aspect-square rounded-lg border flex flex-col items-center justify-center p-1 cursor-default transition-all hover:scale-105",
                getDayClass(status)
              )}
            >
              <span className="text-sm">{date}</span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-xs text-white/60">
          <div className="w-3 h-3 rounded-sm bg-emerald-500/20 border border-emerald-500/30" /> Present
        </div>
        <div className="flex items-center gap-2 text-xs text-white/60">
          <div className="w-3 h-3 rounded-sm bg-amber-500/20 border border-amber-500/30" /> Late
        </div>
        <div className="flex items-center gap-2 text-xs text-white/60">
          <div className="w-3 h-3 rounded-sm bg-rose-500/20 border border-rose-500/30" /> Absent
        </div>
        <div className="flex items-center gap-2 text-xs text-white/60">
          <div className="w-3 h-3 rounded-sm bg-blue-500/20 border border-blue-500/30" /> On Leave
        </div>
      </div>
    </div>
  );
}
