import { cn } from "@/lib/utils";

interface LogoProps {
  collapsed?: boolean;
  className?: string;
}

export function Logo({ collapsed = false, className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Icon mark */}
      <div className="relative flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" strokeWidth={2}>
          <rect x="2" y="7" width="5" height="10" rx="1" fill="currentColor" opacity="0.7" />
          <rect x="9.5" y="3" width="5" height="18" rx="1" fill="currentColor" />
          <rect x="17" y="9" width="5" height="8" rx="1" fill="currentColor" opacity="0.7" />
        </svg>
        {/* Live dot */}
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full ring-2 ring-background animate-pulse" />
      </div>
      {/* Wordmark */}
      {!collapsed && (
        <div className="flex flex-col leading-none">
          <span className="text-[15px] font-bold tracking-tight text-foreground">FactoryOS</span>
          <span className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase">ERP Platform</span>
        </div>
      )}
    </div>
  );
}
