import { motion, AnimatePresence } from "framer-motion";
import { Radio, Scan, Clock, LogIn, LogOut, Settings } from "lucide-react";
import { useLiveAttendanceFeed } from "../hooks/useAttendanceData";
import { EventTypeBadge } from "./AttendanceUIHelpers";
import { cn } from "@/lib/utils";
import type { NFCEvent } from "../types/attendance.types";

export function LiveAttendancePanel() {
  const { liveEvents, isLoading } = useLiveAttendanceFeed();

  function getIcon(type: NFCEvent["type"]) {
    switch (type) {
      case "check_in": return <LogIn className="w-4 h-4 text-emerald-400" />;
      case "check_out": return <LogOut className="w-4 h-4 text-amber-400" />;
      case "machine_login": return <Settings className="w-4 h-4 text-blue-400" />;
      case "machine_logout": return <Settings className="w-4 h-4 text-purple-400" />;
    }
  }

  return (
    <div className="w-80 border-l border-white/10 bg-zinc-950 flex flex-col h-full flex-shrink-0">
      <div className="px-5 py-4 border-b border-white/10 bg-zinc-900/40 flex items-center justify-between shadow-md z-10">
        <div className="flex items-center gap-2 text-white">
          <div className="relative">
            <Radio className="w-5 h-5 text-emerald-400" />
            {!isLoading && <span className="absolute inset-0 rounded-full animate-ping bg-emerald-500/40 opacity-75" />}
          </div>
          <h3 className="font-bold text-sm tracking-wide">Live NFC Feed</h3>
        </div>
        <div className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-white/50 border border-white/10 font-mono">
          {isLoading ? "..." : `${liveEvents.length} events`}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3 relative">
        {/* Glow effect at top */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-zinc-950 to-transparent z-10 pointer-events-none" />

        {isLoading ? (
          <div className="space-y-3 mt-4 opacity-50">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-zinc-900 rounded-xl border border-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {liveEvents.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                layout
                className="p-3 bg-zinc-900/60 border border-white/5 rounded-xl shadow-lg relative overflow-hidden group"
              >
                {/* Event type colored border accent */}
                <div className={cn(
                  "absolute left-0 top-0 bottom-0 w-1",
                  event.type === "check_in" ? "bg-emerald-500" :
                  event.type === "check_out" ? "bg-amber-500" :
                  event.type === "machine_login" ? "bg-blue-500" : "bg-purple-500"
                )} />
                
                <div className="pl-2 flex items-start gap-3">
                  <div className="p-2 bg-zinc-950 rounded-lg shadow-inner border border-white/5 mt-0.5">
                    {getIcon(event.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-white font-bold text-sm truncate pr-2">{event.workerName}</p>
                      <span className="text-[9px] text-white/40 font-mono flex items-center gap-1 flex-shrink-0">
                        <Clock className="w-3 h-3" />
                        {new Date(event.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-1.5">
                      <EventTypeBadge type={event.type} />
                      <span className="text-[10px] text-white/50 flex items-center gap-1">
                        <Scan className="w-3 h-3" />
                        {event.terminalId}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {!isLoading && liveEvents.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-50 pt-20">
            <Radio className="w-12 h-12 text-white/20 mb-3" />
            <p className="text-white/60 text-sm">Listening for NFC taps...</p>
          </div>
        )}
      </div>
    </div>
  );
}
