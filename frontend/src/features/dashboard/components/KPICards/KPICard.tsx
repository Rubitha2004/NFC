import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: number;          // percentage change
  color: "green" | "blue" | "amber" | "red" | "cyan" | "purple" | "emerald" | "rose";
  loading?: boolean;
  delay?: number;
}

const colorMap = {
  green:   { bg: "from-green-500/10 to-green-500/5",   border: "border-green-500/20", icon: "bg-green-500/15 text-green-400",   value: "text-green-400"   },
  blue:    { bg: "from-blue-500/10 to-blue-500/5",     border: "border-blue-500/20",  icon: "bg-blue-500/15 text-blue-400",     value: "text-blue-400"    },
  amber:   { bg: "from-amber-500/10 to-amber-500/5",   border: "border-amber-500/20", icon: "bg-amber-500/15 text-amber-400",   value: "text-amber-400"   },
  red:     { bg: "from-red-500/10 to-red-500/5",       border: "border-red-500/20",   icon: "bg-red-500/15 text-red-400",       value: "text-red-400"     },
  cyan:    { bg: "from-cyan-500/10 to-cyan-500/5",     border: "border-cyan-500/20",  icon: "bg-cyan-500/15 text-cyan-400",     value: "text-cyan-400"    },
  purple:  { bg: "from-purple-500/10 to-purple-500/5", border: "border-purple-500/20",icon: "bg-purple-500/15 text-purple-400", value: "text-purple-400"  },
  emerald: { bg: "from-emerald-500/10 to-emerald-500/5",border: "border-emerald-500/20",icon: "bg-emerald-500/15 text-emerald-400",value: "text-emerald-400"},
  rose:    { bg: "from-rose-500/10 to-rose-500/5",     border: "border-rose-500/20",  icon: "bg-rose-500/15 text-rose-400",     value: "text-rose-400"    },
};

export function KPICard({ title, value, subtitle, icon: Icon, trend, color, delay = 0 }: KPICardProps) {
  const c = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      whileHover={{ y: -2, scale: 1.01 }}
      className={cn(
        "relative flex flex-col gap-2 p-4 rounded-xl border bg-gradient-to-br overflow-hidden cursor-default",
        c.bg, c.border
      )}
    >
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-card/60 backdrop-blur-sm" />

      <div className="relative flex items-start justify-between">
        <div className={cn("p-2 rounded-lg", c.icon)}>
          <Icon className="w-4 h-4" />
        </div>
        {trend !== undefined && (
          <span className={cn(
            "text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
            trend >= 0 ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"
          )}>
            {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
        )}
      </div>

      <div className="relative">
        <motion.p
          key={String(value)}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn("text-2xl font-bold leading-none", c.value)}
        >
          {value}
        </motion.p>
        <p className="text-xs text-muted-foreground mt-1 font-medium">{title}</p>
        {subtitle && <p className="text-[10px] text-muted-foreground/60 mt-0.5">{subtitle}</p>}
      </div>
    </motion.div>
  );
}
