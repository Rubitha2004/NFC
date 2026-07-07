import { cn } from "@/lib/utils";
import { 
  CheckCircle2, 
  Clock, 
  Wrench, 
  PowerOff,
  Zap,
  FileText,
  Ban
} from "lucide-react";

export type StatusType = 
  | "Running" | "Idle" | "Offline" | "Maintenance" 
  | "Completed" | "Pending" | "Rejected" | "Approved" 
  | "Draft" | "Planning" | "Assigned" | "QC" | "Cancelled" | string;

interface StatusChipProps {
  status: StatusType;
  className?: string;
  size?: "sm" | "md";
}

export function StatusChip({ status, className, size = "md" }: StatusChipProps) {
  
  const getStatusConfig = (s: string) => {
    const sLower = s.toLowerCase();
    
    // Running / Active / Approved
    if (["running", "active", "approved", "completed"].includes(sLower)) {
      return {
        icon: CheckCircle2,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20"
      };
    }
    
    // Idle / Draft / Planning
    if (["idle", "draft", "planning", "pending"].includes(sLower)) {
      return {
        icon: Clock,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20"
      };
    }

    // Maintenance / QC
    if (["maintenance", "qc"].includes(sLower)) {
      return {
        icon: Wrench,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20"
      };
    }

    // Offline
    if (["offline"].includes(sLower)) {
      return {
        icon: PowerOff,
        color: "text-zinc-500",
        bg: "bg-zinc-500/10",
        border: "border-zinc-500/20"
      };
    }

    // Error / Rejected / Cancelled
    if (["rejected", "cancelled", "error", "failed"].includes(sLower)) {
      return {
        icon: Ban,
        color: "text-red-500",
        bg: "bg-red-500/10",
        border: "border-red-500/20"
      };
    }
    
    // Assigned
    if (["assigned"].includes(sLower)) {
      return {
        icon: Zap,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
        border: "border-purple-500/20"
      };
    }

    // Fallback
    return {
      icon: FileText,
      color: "text-muted-foreground",
      bg: "bg-muted",
      border: "border-border"
    };
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span 
      className={cn(
        "inline-flex items-center font-semibold border rounded-full whitespace-nowrap",
        config.bg, 
        config.color,
        config.border,
        size === "sm" ? "px-1.5 py-0.5 text-[10px] gap-1" : "px-2.5 py-1 text-xs gap-1.5",
        className
      )}
    >
      <Icon className={cn(size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5")} />
      {status}
    </span>
  );
}
