import { Bell, Search, Settings, User, Moon,  } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";

interface Props {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
}

export function ControlCenterHeader({ searchQuery, setSearchQuery }: Props) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="flex-shrink-0 h-14 px-6 flex items-center justify-between border-b border-white/[0.05] bg-zinc-950/90 backdrop-blur-sm z-20">
      <div className="flex items-center gap-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white leading-none shadow-emerald-500/50 drop-shadow-sm">
            Factory Control Center
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
            <span className="text-xs font-medium text-white/50">
              Shift A • {format(time, "HH:mm:ss")} • {format(time, "dd MMM yyyy")}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Global Search */}
        <div className="relative group">
          <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-emerald-400 transition-colors" />
          <input
            type="text"
            placeholder="Search Factory (Ctrl+K)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-1.5 bg-zinc-900 border border-white/10 rounded-full text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 w-72 transition-all hover:border-white/20"
          />
        </div>

        <div className="h-6 w-px bg-white/10 mx-2" />

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-full hover:bg-zinc-800 text-white/60 hover:text-white transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-zinc-950" />
          </button>
          <button className="p-2 rounded-full hover:bg-zinc-800 text-white/60 hover:text-white transition-colors">
            <Moon className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-full hover:bg-zinc-800 text-white/60 hover:text-white transition-colors">
            <Settings className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 pl-2 cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors">
              <User className="w-4 h-4 text-white/60" />
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-bold text-white leading-none">Admin User</div>
              <div className="text-[10px] text-white/50 mt-0.5">Production Manager</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
