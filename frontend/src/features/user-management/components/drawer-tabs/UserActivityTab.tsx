import { motion } from "framer-motion";
import type { AppUser } from "../../types/user.types";
import { Clock } from "lucide-react";

export function UserActivityTab({ user }: { user: AppUser }) {
  return (
    <div className="p-6">
      <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-8">System Activity Log</h3>
      
      <div className="relative pl-6 border-l border-white/10 space-y-6">
        {user.activityLog.map((event, idx) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative"
          >
            {/* Timeline dot */}
            <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-zinc-900 border-2 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
            
            <div>
              <p className="text-white font-medium text-sm">{event.action}</p>
              <div className="flex items-center gap-2 mt-1 text-xs text-white/40 font-mono">
                <Clock className="w-3 h-3" />
                {new Date(event.timestamp).toLocaleString()}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {user.activityLog.length === 0 && (
        <div className="text-center p-8 text-white/40 text-sm">
          No activity logs found.
        </div>
      )}
    </div>
  );
}
