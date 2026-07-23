import React, { useState } from 'react';
import {
  Zap,
  Users,
  Cpu,
  Layers,
  Activity,
  RotateCcw,
  Wifi,
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Wrench,
  Percent,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useIotDemoStore } from './store/iot-demo.store';
import { useIotDemo } from './hooks/useIotDemo';
import { WorkerDemoCard } from './components/WorkerDemoCard';
import { MachineDemoCard } from './components/MachineDemoCard';
import { BundleDemoCard } from './components/BundleDemoCard';
import { DemoActivityLog } from './components/DemoActivityLog';

export default function IotDemoPage() {
  const {
    hardwareMode,
    setHardwareMode,
    selectedOrderId,
    setSelectedOrderId,
    activeOperationId,
    setActiveOperationId,
  } = useIotDemoStore();

  const {
    context,
    orders,
    selectedOrder,
    tasks,
    operations,
    bundles,
    attendances,
    isLoading,
    toggleWorker,
    isTogglingWorker,
    toggleMachine,
    isTogglingMachine,
    advanceBundle,
    isAdvancingBundle,
    resetDemo,
    isResettingDemo,
  } = useIotDemo();

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Set default active operation if none selected
  const activeOpId = activeOperationId || (operations.length > 0 ? operations[0].id : null);

  // Filter tasks for current operation
  const activeTasks = activeOpId
    ? tasks.filter((t: any) => t.operationId === activeOpId)
    : tasks;

  // Extract assigned workers & machines for active operation
  const assignedWorkerMap = new Map<number, any>();
  const assignedMachineMap = new Map<number, any>();

  activeTasks.forEach((t: any) => {
    if (t.worker) assignedWorkerMap.set(t.worker.id, t.worker);
    if (t.machine) assignedMachineMap.set(t.machine.id, t.machine);
  });

  // Also include activeAssignments from context if tasks didn't have worker/machine directly attached
  const activeAssignments = (context as any)?.activeAssignments || [];
  activeAssignments.forEach((a: any) => {
    if (a.worker && (!activeOpId || a.operationId === activeOpId)) {
      assignedWorkerMap.set(a.worker.id, a.worker);
    }
    if (a.machine && (!activeOpId || a.operationId === activeOpId)) {
      assignedMachineMap.set(a.machine.id, a.machine);
    }
  });

  // Fallback to all order tasks and all active assignments if specific operation has none
  if (assignedWorkerMap.size === 0) {
    tasks.forEach((t: any) => {
      if (t.worker) assignedWorkerMap.set(t.worker.id, t.worker);
      if (t.machine) assignedMachineMap.set(t.machine.id, t.machine);
    });
    activeAssignments.forEach((a: any) => {
      if (a.worker) assignedWorkerMap.set(a.worker.id, a.worker);
      if (a.machine) assignedMachineMap.set(a.machine.id, a.machine);
    });
  }

  const assignedWorkersList = Array.from(assignedWorkerMap.values());
  const assignedMachinesList = Array.from(assignedMachineMap.values());

  // Attendance lookup: get latest attendance record per worker
  const getLatestWorkerAttendance = (workerId: number) => {
    if (!Array.isArray(attendances)) return null;
    return attendances.find((a: any) => a.workerId === workerId) || null;
  };

  // Stats calculation
  const presentWorkersCount = assignedWorkersList.filter((w) => {
    const latest = getLatestWorkerAttendance(w.id);
    return latest?.attendanceType === 'IN';
  }).length;
  const runningMachinesCount = assignedMachinesList.filter(
    (m) => m.status === 'ACTIVE' || (m.status as string) === 'running'
  ).length;

  const completedBundlesCount = bundles.filter(
    (b: any) => b.status === 'COMPLETED' || b.status === 'QC_COMPLETED'
  ).length;

  const totalCompletedPcs = bundles.reduce((acc: number, b: any) => acc + (b.completedQuantity || 0), 0);
  const totalTargetPcs = selectedOrder?.plannedQuantity || selectedOrder?.targetQuantity || 100;
  const completionPercent = Math.min(100, Math.round((totalCompletedPcs / totalTargetPcs) * 100));

  // Handlers
  const handleOrderChange = (orderId: number) => {
    setSelectedOrderId(orderId);
    setActiveOperationId(null);
  };

  const handleToggleWorker = (workerId: number) => {
    toggleWorker(workerId, {
      onSuccess: (res: any) => {
        toast.success(res.message || 'Worker presence updated');
      },
      onError: (err: any) => {
        toast.error(err.message || 'Worker toggle failed');
      },
    });
  };

  const handleToggleMachine = (machineId: number, currentStatus: string) => {
    const nextTarget = currentStatus === 'ACTIVE' || currentStatus === 'running' ? 'idle' : 'running';
    toggleMachine(
      { machineId, targetStatus: nextTarget },
      {
        onSuccess: (res: any) => {
          toast.success(res.message || 'Machine status updated');
        },
        onError: (err: any) => {
          toast.error(err.message || 'Machine status failed');
        },
      }
    );
  };

  const handleAdvanceBundle = (bundleId: number) => {
    advanceBundle(bundleId, {
      onSuccess: (res: any) => {
        toast.success(res.message || 'Bundle stage advanced');
      },
      onError: (err: any) => {
        toast.error(err.message || 'Sequential Gate: Complete previous bundle first');
      },
    });
  };

  const handleResetDemo = () => {
    resetDemo(selectedOrderId || undefined, {
      onSuccess: () => {
        setShowResetConfirm(false);
        toast.success('Production Order Demo Environment Reset');
      },
      onError: (err: any) => {
        toast.error(err.message || 'Demo reset failed');
      },
    });
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-white" style={{ height: 'calc(100vh - 56px)' }}>
      {/* ── Header Bar ── */}
      <header className="shrink-0 border-b border-white/8 bg-zinc-900/80 backdrop-blur px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2.5 rounded-xl shadow-lg shadow-emerald-950/40">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight">IoT Production Workflow Demo</h1>
              <span className="text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/25 uppercase">
                Order Driven
              </span>
            </div>
            <p className="text-[11px] text-white/40">
              Live Order Execution • Worker NFC Check-In • Machine Status • Sequential Bundles
            </p>
          </div>
        </div>

        {/* Center: Production Order Dropdown */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-zinc-950 px-3 py-1.5 rounded-xl border border-white/10">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-white/50">Order:</span>
            <select
              value={selectedOrder?.id || ''}
              onChange={(e) => handleOrderChange(Number(e.target.value))}
              className="bg-zinc-900 border border-white/10 rounded-lg px-3 py-1 text-xs text-white font-bold font-mono appearance-none cursor-pointer focus:outline-none focus:border-emerald-500 transition-all"
            >
              {orders.map((po: any) => (
                <option key={po.id} value={po.id}>
                  {po.orderNumber} — {po.styleName || po.styleNumber || 'Style'} ({po.plannedQuantity || 100} Pcs)
                </option>
              ))}
            </select>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2 bg-zinc-950 px-3 py-1.5 rounded-xl border border-white/10">
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
            <select
              value={hardwareMode}
              onChange={(e) => setHardwareMode(e.target.value as any)}
              className="bg-zinc-900 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white font-medium appearance-none cursor-pointer focus:outline-none focus:border-blue-500"
            >
              <option value="SIMULATOR">Virtual Simulator</option>
              <option value="HARDWARE_MQTT">MQTT Stream (Hardware)</option>
            </select>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
            <Wifi className="w-3 h-3 animate-pulse" />
            Live Floor Sync
          </div>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-xs font-bold transition-all active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Order
          </button>
        </div>
      </header>

      {/* ── Order Metrics Progress Bar ── */}
      <div className="bg-zinc-900/40 border-b border-white/8 px-6 py-3 grid grid-cols-2 md:grid-cols-4 gap-4 shrink-0">
        <div className="flex items-center gap-3 bg-zinc-950/60 p-2.5 rounded-xl border border-white/5">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-white/40">Workers Present</p>
            <p className="text-sm font-bold font-mono text-white">
              {presentWorkersCount} / {assignedWorkersList.length || 1}{' '}
              <span className="text-[10px] text-emerald-400 font-normal">
                ({Math.round((presentWorkersCount / (assignedWorkersList.length || 1)) * 100)}%)
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-zinc-950/60 p-2.5 rounded-xl border border-white/5">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-white/40">Machines Running</p>
            <p className="text-sm font-bold font-mono text-white">
              {runningMachinesCount} / {assignedMachinesList.length || 1}{' '}
              <span className="text-[10px] text-blue-400 font-normal">
                ({Math.round((runningMachinesCount / (assignedMachinesList.length || 1)) * 100)}%)
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-zinc-950/60 p-2.5 rounded-xl border border-white/5">
          <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-white/40">Bundles Done</p>
            <p className="text-sm font-bold font-mono text-white">
              {completedBundlesCount} / {bundles.length || 1}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-zinc-950/60 p-2.5 rounded-xl border border-white/5">
          <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400">
            <Percent className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-wider font-bold text-white/40">Order Progress</p>
              <span className="text-xs font-bold font-mono text-teal-400">{completionPercent}%</span>
            </div>
            <div className="h-1.5 bg-zinc-800 rounded-full mt-1.5 overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Workspace ── */}
      <div className="flex-1 flex overflow-hidden p-6 gap-6">
        {/* Left Column: Workflow Operations, Workers, Machines, Bundles */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden space-y-4">
          {/* Operation Step Filter Tabs */}
          {operations.length > 0 && (
            <div className="shrink-0 flex items-center gap-2 border-b border-white/8 pb-3 overflow-x-auto hide-scrollbar">
              <span className="text-xs font-bold text-white/40 uppercase tracking-wider mr-2 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-emerald-400" />
                Operations:
              </span>
              {operations.map((op: any) => (
                <button
                  key={op.id}
                  onClick={() => setActiveOperationId(op.id)}
                  className={cn(
                    'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border whitespace-nowrap',
                    activeOpId === op.id
                      ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300 shadow-md shadow-emerald-950/30'
                      : 'bg-zinc-900/60 border-white/5 text-white/40 hover:text-white hover:bg-zinc-900'
                  )}
                >
                  {op.operationName}
                </button>
              ))}
            </div>
          )}

          {/* Workflow Sections Scroll Area */}
          <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar pr-1">
            {/* 1. ASSIGNED WORKERS (Assigned → Ready → Present) */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                    Assigned Workers ({assignedWorkersList.length}) — Click to Check-IN / Check-OUT
                  </h2>
                </div>
              </div>

              {assignedWorkersList.length === 0 ? (
                <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/5 text-center text-xs text-white/30">
                  No workers assigned to this operation task in Planning.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                  {assignedWorkersList.map((w: any) => {
                    const latestAttendance = getLatestWorkerAttendance(w.id);
                    const matchingTask = activeTasks.find((t: any) => t.workerId === w.id);
                    return (
                      <WorkerDemoCard
                        key={w.id}
                        worker={w}
                        latestAttendance={latestAttendance}
                        operationName={matchingTask?.operation?.operationName}
                        machineCode={matchingTask?.machine?.machineCode}
                        onToggle={() => handleToggleWorker(w.id)}
                        isLoading={isTogglingWorker}
                      />
                    );
                  })}
                </div>
              )}
            </section>

            {/* 2. ASSIGNED MACHINES (Idle → Ready → Running) */}
            <section className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-400" />
                  <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                    Assigned Machines ({assignedMachinesList.length}) — Idle ↔ Ready ↔ Running
                  </h2>
                </div>
              </div>

              {assignedMachinesList.length === 0 ? (
                <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/5 text-center text-xs text-white/30">
                  No machines assigned to this operation task in Planning.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                  {assignedMachinesList.map((m: any) => {
                    const isRunning = m.status === 'ACTIVE' || (m.status as string) === 'running';
                    const matchingTask = activeTasks.find((t: any) => t.machineId === m.id);
                    const workerLatestAttendance = matchingTask?.workerId ? getLatestWorkerAttendance(matchingTask.workerId) : null;
                    const isWorkerPresent = workerLatestAttendance?.attendanceType === 'IN';
                    const workerName = matchingTask?.worker ? `${matchingTask.worker.firstName} ${matchingTask.worker.lastName}` : undefined;

                    return (
                      <MachineDemoCard
                        key={m.id}
                        machine={m}
                        isRunning={isRunning}
                        isWorkerPresent={isWorkerPresent}
                        assignedWorkerName={workerName}
                        onToggle={() => handleToggleMachine(m.id, m.status)}
                        isLoading={isTogglingMachine}
                      />
                    );
                  })}
                </div>
              )}
            </section>

            {/* 3. SEQUENTIAL BUNDLE QUEUE */}
            <section className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-violet-400" />
                  <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                    Sequential Bundle Queue ({bundles.length}) — Only 1 Active at a time
                  </h2>
                </div>
              </div>

              {bundles.length === 0 ? (
                <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/5 text-center text-xs text-white/30">
                  No bundles generated for this production order. Generate bundles in the Bundle module.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                  {bundles.map((b: any, idx: number) => {
                    // Sequential Gating: Bundle is locked if previous bundle is not completed
                    const isLocked =
                      idx > 0 &&
                      b.status === 'CREATED' &&
                      bundles[idx - 1].status !== 'COMPLETED' &&
                      bundles[idx - 1].status !== 'QC_COMPLETED';

                    return (
                      <BundleDemoCard
                        key={b.id}
                        bundle={b}
                        isLocked={isLocked}
                        onAdvance={() => handleAdvanceBundle(b.id)}
                        isLoading={isAdvancingBundle}
                      />
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Right Column: Live Event Activity Log Stream */}
        <div className="w-80 sm:w-96 shrink-0 h-full overflow-hidden">
          <DemoActivityLog />
        </div>
      </div>

      {/* ── Reset Confirmation Modal ── */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-white">Reset Production Order Demo?</h3>
            </div>

            <p className="text-xs text-white/60 leading-relaxed">
              This will set all workers assigned to this order to <span className="text-white font-semibold">Absent</span>, machines to{' '}
              <span className="text-white font-semibold">Idle</span>, bundles to <span className="text-white font-semibold">Allocated</span>, and clear activity logs.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white/50 hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={isResettingDemo}
                onClick={handleResetDemo}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-950/30 transition-all flex items-center gap-2"
              >
                {isResettingDemo ? 'Resetting…' : 'Yes, Reset Order Demo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
