import { AnimatePresence, motion } from 'framer-motion';
import {
  X, Cpu, User, Package, Activity, Heart, Clock, Zap,
  Thermometer, Wifi, Power, ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  MACHINE_STATUS_META, GRADE_META, ATTENDANCE_META,
} from '../types/factory.types';
import type { TimelineEvent } from '../types/factory.types';
import { WorkerIndicator } from './WorkerIndicator';
import { useFactoryStore } from '../store/factory.store';
import { useFactoryData } from '../hooks/useFactoryData';

// ─── Smart Inspector Panel ────────────────────────────────────────────────────

export function MachineDetailsPanel() {
  const { selectedMachineId, selectMachine } = useFactoryStore();
  const { getMachineContext } = useFactoryData();

  const ctx = selectedMachineId ? getMachineContext(selectedMachineId) : undefined;

  return (
    <AnimatePresence>
      {ctx && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1.5px]"
            onClick={() => selectMachine(null)}
          />
          <motion.aside
            key="inspector"
            initial={{ x: '100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-[420px] flex flex-col bg-[#0d0d0f] border-l border-white/[0.08] shadow-2xl overflow-hidden"
          >
            <InspectorContent ctx={ctx} onClose={() => selectMachine(null)} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Inspector Content ────────────────────────────────────────────────────────

function InspectorContent({
  ctx: { machine, line, room, floor, building },
  onClose,
}: {
  ctx: NonNullable<ReturnType<ReturnType<typeof useFactoryData>['getMachineContext']>>;
  onClose: () => void;
}) {
  const meta = MACHINE_STATUS_META[machine.status];

  return (
    <>
      {/* ── Header ── */}
      <div className={cn('flex-shrink-0 px-5 pt-5 pb-4 border-b border-white/[0.08]', meta.bg)}>
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-[10px] text-white/30 mb-3 flex-wrap">
          <span>{building.name}</span>
          <ChevronRight className="w-2.5 h-2.5" />
          <span>{floor.name.split('—')[0].trim()}</span>
          <ChevronRight className="w-2.5 h-2.5" />
          <span>{room.name}</span>
          <ChevronRight className="w-2.5 h-2.5" />
          <span className="text-white/50 font-medium">{line.lineName.split('—')[0].trim()}</span>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', meta.bg, `border ${meta.border}`)}>
                <Cpu className={cn('w-4 h-4', meta.color)} />
              </div>
              <div>
                <p className="text-xl font-bold text-white leading-tight">{machine.machineNumber}</p>
                <p className="text-xs text-white/40">{machine.machineType} · {machine.department}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={cn('text-[11px] font-semibold px-2.5 py-1 rounded-full border', meta.bg, meta.color, meta.border)}>
              {meta.label}
            </span>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto divide-y divide-white/[0.05] scrollbar-thin">

        {/* §1 — Worker Profile */}
        <Section icon={User} title="Worker Profile">
          {machine.worker ? (
            <div className="flex items-start gap-4">
              <WorkerIndicator worker={machine.worker} size="lg" showName={false} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-white">{machine.worker.name}</p>
                  {/* Grade badge */}
                  <span className={cn(
                    'text-[10px] font-bold px-1.5 py-0.5 rounded border',
                    GRADE_META[machine.worker.grade].color,
                    GRADE_META[machine.worker.grade].bg,
                    GRADE_META[machine.worker.grade].border,
                  )}>
                    {machine.worker.grade}
                  </span>
                </div>
                <p className="text-xs text-white/40 mt-0.5">{machine.worker.role}</p>
                <p className="text-xs text-white/30">{machine.worker.employeeId} · {machine.worker.department}</p>

                {/* Attendance */}
                <div className="flex items-center gap-1.5 mt-2">
                  <span className={cn('w-1.5 h-1.5 rounded-full', ATTENDANCE_META[machine.worker.attendanceToday].dot)} />
                  <span className={cn('text-xs font-medium', ATTENDANCE_META[machine.worker.attendanceToday].color)}>
                    {ATTENDANCE_META[machine.worker.attendanceToday].label}
                  </span>
                  <span className="text-xs text-white/25">·</span>
                  <span className="text-xs text-white/30">
                    Check-in {new Date(machine.worker.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-white/30 italic">No worker assigned to this machine</p>
          )}
        </Section>

        {/* §2 — Current Bundle */}
        <Section icon={Package} title="Current Bundle">
          {machine.assignment && machine.bundle ? (
            <div className="space-y-2">
              <InfoRow label="Bundle #"    value={machine.bundle.bundleNumber} />
              <InfoRow label="Style Code"  value={machine.bundle.styleCode} />
              <InfoRow label="Operation"   value={machine.assignment.operationName} />
              <InfoRow label="Started At"  value={new Date(machine.assignment.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
            </div>
          ) : (
            <p className="text-sm text-white/30 italic">No active bundle assignment</p>
          )}
        </Section>

        {/* §3 — Efficiency & Production */}
        {machine.bundle && machine.assignment && (
          <Section icon={Activity} title="Efficiency & Production">
            <div className="space-y-4">
              {/* Efficiency meter */}
              <div>
                <div className="flex items-end justify-between mb-1.5">
                  <span className={cn(
                    'text-3xl font-black',
                    machine.efficiency >= 80 ? 'text-emerald-400'
                    : machine.efficiency >= 50 ? 'text-amber-400'
                    : 'text-red-400'
                  )}>
                    {machine.efficiency}%
                  </span>
                  <span className="text-xs text-white/30 mb-1">efficiency</span>
                </div>
                <div className="h-2.5 rounded-full bg-white/[0.07] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${machine.efficiency}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={cn(
                      'h-full rounded-full',
                      machine.efficiency >= 80 ? 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                      : machine.efficiency >= 50 ? 'bg-gradient-to-r from-amber-600 to-amber-400'
                      : 'bg-gradient-to-r from-red-600 to-red-400'
                    )}
                  />
                </div>
              </div>

              {/* Piece stats grid */}
              <div className="grid grid-cols-3 gap-2">
                <MiniStat label="Target"    value={machine.assignment.targetPieces.toString()}    />
                <MiniStat label="Completed" value={machine.assignment.completedPieces.toString()}  accent="emerald" />
                <MiniStat label="Remaining" value={(machine.assignment.targetPieces - machine.assignment.completedPieces).toString()} accent="amber" />
              </div>

              {/* Progress */}
              <div>
                <div className="flex justify-between text-[11px] text-white/40 mb-1">
                  <span>Bundle progress</span>
                  <span>{machine.bundle.progress}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.07] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${machine.bundle.progress}%` }}
                    transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan-600 to-cyan-400"
                  />
                </div>
              </div>
            </div>
          </Section>
        )}

        {/* §4 — Machine Health */}
        <Section icon={Heart} title="Machine Health">
          <div className="grid grid-cols-2 gap-2.5">
            <HealthCard label="Health Score"     value={`${machine.healthScore}%`}    accent="emerald" />
            <HealthCard label="Uptime Today"     value={`${machine.uptimePercent}%`}  accent="cyan" />
            <HealthCard label="Last Maintenance" value={machine.lastMaintenance}       accent="violet" />
            <HealthCard label="Next Maintenance" value={machine.nextMaintenanceDate}   accent="amber" />
          </div>
        </Section>

        {/* §5 — IoT Status (future-ready) */}
        <Section icon={Thermometer} title="IoT Status">
          <div className="grid grid-cols-3 gap-2.5">
            {/* Temperature */}
            <IotCard
              icon={Thermometer}
              label="Temperature"
              value={machine.temperatureC !== null ? `${machine.temperatureC}°C` : '—'}
              status={
                machine.temperatureC === null ? 'none'
                : machine.temperatureC > 55 ? 'warn'
                : 'ok'
              }
            />
            {/* Power */}
            <IotCard
              icon={Power}
              label="Power"
              value={machine.powerStatus === 'on' ? 'On' : machine.powerStatus === 'standby' ? 'Standby' : 'Off'}
              status={machine.powerStatus === 'on' ? 'ok' : machine.powerStatus === 'standby' ? 'warn' : 'error'}
            />
            {/* Network */}
            <IotCard
              icon={Wifi}
              label="Network"
              value={machine.networkStatus === 'online' ? 'Online' : machine.networkStatus === 'weak' ? 'Weak' : 'Offline'}
              status={machine.networkStatus === 'online' ? 'ok' : machine.networkStatus === 'weak' ? 'warn' : 'error'}
            />
          </div>
        </Section>

        {/* §6 — Today's Timeline */}
        <Section icon={Clock} title="Today's Timeline">
          <div className="relative ml-2.5">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-white/[0.08]" />
            <div className="space-y-4 pl-5">
              {machine.todayTimeline.map((event) => (
                <TimelineItem key={event.id} event={event} />
              ))}
            </div>
          </div>
        </Section>

        {/* §7 — Machine Info */}
        <Section icon={Zap} title="Machine Info">
          <div className="space-y-2">
            <InfoRow label="Machine ID"   value={machine.id} />
            <InfoRow label="Type"         value={machine.machineType} />
            <InfoRow label="Department"   value={machine.department} />
            <InfoRow label="Building"     value={building.name} />
            <InfoRow label="Floor"        value={floor.name} />
            <InfoRow label="Room"         value={room.name} />
            <InfoRow label="Line"         value={line.lineName} />
          </div>
        </Section>
      </div>
    </>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

function Section({
  icon: Icon, title, children,
}: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode }) {
  return (
    <div className="px-5 py-4">
      <div className="flex items-center gap-2 mb-3.5">
        <Icon className="w-3.5 h-3.5 text-white/25" />
        <h3 className="text-[10.5px] font-semibold text-white/35 uppercase tracking-[0.12em]">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// ─── Info Row ─────────────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs text-white/35">{label}</span>
      <span className="text-xs font-medium text-white/75">{value}</span>
    </div>
  );
}

// ─── Mini Stat ────────────────────────────────────────────────────────────────

function MiniStat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  const colorMap: Record<string, string> = {
    emerald: 'text-emerald-400', amber: 'text-amber-400', red: 'text-red-400',
  };
  return (
    <div className="rounded-lg bg-white/[0.04] border border-white/[0.07] p-2.5 text-center">
      <p className="text-[10px] text-white/30 mb-1">{label}</p>
      <p className={cn('text-base font-bold', accent ? colorMap[accent] : 'text-white')}>{value}</p>
    </div>
  );
}

// ─── Health Card ─────────────────────────────────────────────────────────────

function HealthCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  const styles: Record<string, string> = {
    emerald: 'text-emerald-300 bg-emerald-500/8 border-emerald-500/20',
    cyan:    'text-cyan-300    bg-cyan-500/8    border-cyan-500/20',
    violet:  'text-violet-300  bg-violet-500/8  border-violet-500/20',
    amber:   'text-amber-300   bg-amber-500/8   border-amber-500/20',
  };
  return (
    <div className={cn('rounded-lg border p-2.5', styles[accent])}>
      <p className="text-[10px] text-white/30 mb-1">{label}</p>
      <p className="text-sm font-bold">{value}</p>
    </div>
  );
}

// ─── IoT Card ────────────────────────────────────────────────────────────────

function IotCard({
  icon: Icon, label, value, status,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  status: 'ok' | 'warn' | 'error' | 'none';
}) {
  const statusStyles = {
    ok:    'text-emerald-300 bg-emerald-500/8  border-emerald-500/20',
    warn:  'text-amber-300   bg-amber-500/8    border-amber-500/20',
    error: 'text-red-300     bg-red-500/8      border-red-500/20',
    none:  'text-zinc-400    bg-zinc-800/50    border-zinc-700/30',
  };
  return (
    <div className={cn('rounded-lg border p-2.5 flex flex-col items-center gap-1.5', statusStyles[status])}>
      <Icon className="w-3.5 h-3.5 opacity-70" />
      <p className="text-[8.5px] text-white/30 text-center">{label}</p>
      <p className="text-xs font-bold text-center">{value}</p>
    </div>
  );
}

// ─── Timeline Item ────────────────────────────────────────────────────────────

function TimelineItem({ event }: { event: TimelineEvent }) {
  const typeColors: Record<TimelineEvent['type'], string> = {
    start: 'bg-emerald-400', bundle: 'bg-cyan-400',
    maintenance: 'bg-violet-400', idle: 'bg-amber-400',
    offline: 'bg-red-400', info: 'bg-zinc-500',
  };
  return (
    <div className="relative">
      <div className={cn('absolute -left-5 top-1 w-2 h-2 rounded-full ring-2 ring-[#0d0d0f]', typeColors[event.type])} />
      <p className="text-xs text-white/65 leading-tight">{event.label}</p>
      <p className="text-[10px] text-white/25 mt-0.5">{event.time}</p>
    </div>
  );
}
