import { motion, AnimatePresence } from "framer-motion";
import { X, Cpu, User, Package, Clock, Activity, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useMachineSelection } from "../../hooks/useMachineSelection";

const STATUS_STYLE: Record<string, { color: string; label: string; dotClass: string }> = {
  running:     { color: "text-green-400",  label: "Running",     dotClass: "bg-green-400 animate-pulse" },
  idle:        { color: "text-yellow-400", label: "Idle",        dotClass: "bg-yellow-400"              },
  offline:     { color: "text-red-400",    label: "Offline",     dotClass: "bg-red-400"                 },
  maintenance: { color: "text-orange-400", label: "Maintenance", dotClass: "bg-orange-400"              },
  unassigned:  { color: "text-gray-400",   label: "Unassigned",  dotClass: "bg-gray-400"                },
};

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={cn("h-full rounded-full", color)}
      />
    </div>
  );
}

function StatRow({ label, value, sub }: { label: string; value: React.ReactNode; sub?: string }) {
  return (
    <div className="flex items-start justify-between gap-2 py-2 border-b border-border/40 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="text-right">
        <span className="text-xs font-semibold text-foreground">{value}</span>
        {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );
}

export function MachineDetailPanel() {
  const { selectedMachine, selectMachine } = useMachineSelection();
  const machine = selectedMachine;

  return (
    <AnimatePresence>
      {machine && (
        <motion.aside
          initial={{ opacity: 0, x: 20, width: 0 }}
          animate={{ opacity: 1, x: 0, width: 280 }}
          exit={{ opacity: 0, x: 20, width: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="flex-shrink-0 h-full bg-card border-l border-border overflow-hidden"
          style={{ minWidth: 0 }}
        >
          <div className="w-70 h-full flex flex-col overflow-y-auto" style={{ width: 280 }}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-bold">{machine.id}</p>
                  <p className="text-[10px] text-muted-foreground">{machine.section}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => selectMachine(null)}>
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>

            {/* Status badge */}
            {(() => {
              const s = STATUS_STYLE[machine.status];
              return (
                <div className="px-4 py-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className={cn("w-2.5 h-2.5 rounded-full", s.dotClass)} />
                    <span className={cn("text-sm font-semibold", s.color)}>{s.label}</span>
                  </div>
                </div>
              );
            })()}

            {/* Worker section */}
            <div className="px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Worker</span>
              </div>
              {machine.worker ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {machine.worker.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{machine.worker.name}</p>
                    <p className="text-[10px] text-muted-foreground">{machine.worker.employeeCode}</p>
                    <p className="text-[10px] text-muted-foreground">{machine.worker.department} · {machine.worker.grade}</p>
                    <p className="text-[10px] text-muted-foreground">{machine.worker.shift}</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">No worker assigned</p>
              )}
            </div>

            {/* Bundle section */}
            <div className="px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Bundle</span>
              </div>
              {machine.bundle ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-cyan-400">{machine.bundle.bundleNumber}</span>
                    <span className="text-[10px] text-muted-foreground">{machine.bundle.productionOrder}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{machine.bundle.operation}</p>
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                      <span>Progress</span>
                      <span>{machine.bundle.completedQty}/{machine.bundle.quantity} pcs</span>
                    </div>
                    <ProgressBar value={machine.bundle.completedQty} max={machine.bundle.quantity} color="bg-cyan-500" />
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">No active bundle</p>
              )}
            </div>

            {/* Stats */}
            <div className="px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Performance</span>
              </div>

              {machine.status === "running" ? (
                <>
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                      <span>Efficiency</span>
                      <span className="text-green-400 font-semibold">{machine.efficiency}%</span>
                    </div>
                    <ProgressBar value={machine.efficiency} max={100} color="bg-green-500" />
                  </div>
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                      <span>Daily Output</span>
                      <span className="font-semibold text-foreground">{machine.todayOutput}/{machine.targetOutput}</span>
                    </div>
                    <ProgressBar value={machine.todayOutput} max={machine.targetOutput} color="bg-blue-500" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                      <span>Machine Health</span>
                      <span className="font-semibold text-foreground">{machine.health}%</span>
                    </div>
                    <ProgressBar value={machine.health} max={100} color={machine.health > 70 ? "bg-emerald-500" : "bg-amber-500"} />
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    {machine.status === "offline" ? "Machine is offline" :
                     machine.status === "maintenance" ? "Under maintenance" :
                     "No active production"}
                  </p>
                </div>
              )}
            </div>

            {/* Quick stats */}
            <div className="px-4 py-3">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Details</span>
              </div>
              <StatRow label="Section" value={machine.section} />
              {machine.status === "running" && (
                <StatRow
                  label="Uptime Today"
                  value={`${Math.floor(machine.uptime / 60)}h ${machine.uptime % 60}m`}
                />
              )}
              <StatRow
                label="Last Activity"
                value={new Date(machine.lastActivity).toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })}
              />
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
