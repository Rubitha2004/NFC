import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
  accentColor?: string;
}

export function PlaceholderPage({
  title,
  description,
  icon: Icon,
  accentColor = "from-blue-600 to-cyan-500",
}: PlaceholderPageProps) {
  return (
    <div className="flex flex-col gap-6 p-6 max-w-screen-2xl mx-auto w-full">
      {/* Header card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-2xl border bg-card overflow-hidden"
      >
        {/* Gradient strip */}
        <div className={cn("h-1.5 w-full bg-gradient-to-r", accentColor)} />

        <div className="p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Icon */}
          <div className={cn("w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg flex-shrink-0", accentColor)}>
            <Icon className="w-8 h-8 text-white" />
          </div>

          {/* Text */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <p className="text-muted-foreground mt-1 max-w-xl">{description}</p>

            <div className="mt-4 inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Module under development — coming in Sprint 3
            </div>
          </div>
        </div>
      </motion.div>

      {/* Preview skeleton */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-muted/50 border animate-pulse" />
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
        className="h-64 rounded-xl bg-muted/30 border animate-pulse"
      />
    </div>
  );
}
