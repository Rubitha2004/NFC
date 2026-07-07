import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  colorClass?: string;
  bgClass?: string;
  delay?: number;
}

export function KPICard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendUp = true,
  colorClass = "text-primary",
  bgClass = "bg-primary/10",
  delay = 0 
}: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="relative overflow-hidden flex flex-col bg-card border border-border/40 rounded-xl p-5 hover:border-border/80 transition-colors group"
    >
      <div className={cn("absolute -right-10 -top-10 w-32 h-32 blur-3xl rounded-full opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity", bgClass.replace('/10', ''))} />
      
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-muted-foreground">{title}</span>
        <div className={cn("p-2 rounded-lg", bgClass)}>
          <Icon className={cn("w-5 h-5", colorClass)} />
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: delay + 0.2 }}
          className="text-3xl font-bold tracking-tight text-foreground"
        >
          {value}
        </motion.div>
        
        {trend && (
          <div className={cn(
            "text-xs font-semibold px-2 py-1 rounded-md",
            trendUp ? "text-emerald-500 bg-emerald-500/10" : "text-rose-500 bg-rose-500/10"
          )}>
            {trend}
          </div>
        )}
      </div>
    </motion.div>
  );
}
