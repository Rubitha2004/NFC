import { useMemo } from "react";
import type {
  MachineData,
  MachineStatus,
  SectionName,
  WorkerInfo,
  BundleInfo,
  FactoryKPIs,
  AlertItem,
  TimelineEvent,
} from "../types/factory.types";

// ── Section layout configuration ──────────────────────────────────────────────
// Each section sits at a Z offset. Machines within a section spread on X axis.
const MACHINE_SPACING_X = 2.4;
// const MACHINE_SPACING_Z = 3.2;

interface SectionDef {
  name: SectionName;
  label: string;
  zOffset: number;
  machines: number;
  color: string;
  accentHex: string;
}

export const SECTIONS: SectionDef[] = [
  { name: "CUTTING",    label: "Cutting",    zOffset: -12, machines: 5,  color: "text-violet-400", accentHex: "#7c3aed" },
  { name: "STITCHING",  label: "Stitching",  zOffset: -6,  machines: 10, color: "text-blue-400",   accentHex: "#2563eb" },
  { name: "ASSEMBLY",   label: "Assembly",   zOffset: 0,   machines: 7,  color: "text-cyan-400",   accentHex: "#0891b2" },
  { name: "FINISHING",  label: "Finishing",  zOffset: 6,   machines: 8,  color: "text-emerald-400",accentHex: "#059669" },
  { name: "PACKING",    label: "Packing",    zOffset: 12,  machines: 5,  color: "text-amber-400",  accentHex: "#d97706" },
];

// ── Demo workers ───────────────────────────────────────────────────────────────
const DEMO_WORKERS: WorkerInfo[] = [
  { id: 1,  employeeCode: "EMP-001", name: "Aisha Noor",    initials: "AN", department: "Cutting",   grade: "Senior",   shift: "Shift A" },
  { id: 2,  employeeCode: "EMP-002", name: "Ravi Kumar",    initials: "RK", department: "Cutting",   grade: "Junior",   shift: "Shift A" },
  { id: 3,  employeeCode: "EMP-003", name: "Priya Patel",   initials: "PP", department: "Stitching", grade: "Mid",      shift: "Shift A" },
  { id: 4,  employeeCode: "EMP-004", name: "John Silva",    initials: "JS", department: "Stitching", grade: "Senior",   shift: "Shift A" },
  { id: 5,  employeeCode: "EMP-005", name: "Fatima Ali",    initials: "FA", department: "Stitching", grade: "Mid",      shift: "Shift A" },
  { id: 6,  employeeCode: "EMP-006", name: "Meera Raj",     initials: "MR", department: "Assembly",  grade: "Junior",   shift: "Shift A" },
  { id: 7,  employeeCode: "EMP-007", name: "Tom Nguyen",    initials: "TN", department: "Assembly",  grade: "Senior",   shift: "Shift A" },
  { id: 8,  employeeCode: "EMP-008", name: "Sara Begum",    initials: "SB", department: "Finishing", grade: "Mid",      shift: "Shift A" },
  { id: 9,  employeeCode: "EMP-009", name: "Carlos Diaz",   initials: "CD", department: "Finishing", grade: "Junior",   shift: "Shift A" },
  { id: 10, employeeCode: "EMP-010", name: "Lina Chen",     initials: "LC", department: "Packing",   grade: "Senior",   shift: "Shift A" },
  { id: 11, employeeCode: "EMP-011", name: "Amara Osei",    initials: "AO", department: "Stitching", grade: "Mid",      shift: "Shift B" },
  { id: 12, employeeCode: "EMP-012", name: "Sanjay Rao",    initials: "SR", department: "Assembly",  grade: "Senior",   shift: "Shift A" },
  { id: 13, employeeCode: "EMP-013", name: "Nadia Hakim",   initials: "NH", department: "Finishing", grade: "Mid",      shift: "Shift A" },
  { id: 14, employeeCode: "EMP-014", name: "Ben Okafor",    initials: "BO", department: "Cutting",   grade: "Junior",   shift: "Shift A" },
  { id: 15, employeeCode: "EMP-015", name: "Zara Malik",    initials: "ZM", department: "Packing",   grade: "Mid",      shift: "Shift A" },
];

const DEMO_BUNDLES: BundleInfo[] = [
  { id: "1",  bundleNumber: "B-0891", productionOrder: "PO-2024-041", quantity: 50, completedQty: 32, operation: "Flat Lock" },
  { id: "2",  bundleNumber: "B-0892", productionOrder: "PO-2024-041", quantity: 50, completedQty: 12, operation: "Over Lock" },
  { id: "3",  bundleNumber: "B-0893", productionOrder: "PO-2024-042", quantity: 40, completedQty: 40, operation: "Single Needle" },
  { id: "4",  bundleNumber: "B-0894", productionOrder: "PO-2024-042", quantity: 60, completedQty: 18, operation: "Assembly" },
  { id: "5",  bundleNumber: "B-0895", productionOrder: "PO-2024-043", quantity: 45, completedQty: 45, operation: "Finishing" },
  { id: "6",  bundleNumber: "B-0896", productionOrder: "PO-2024-043", quantity: 30, completedQty: 7,  operation: "Packing" },
  { id: "7",  bundleNumber: "B-0897", productionOrder: "PO-2024-044", quantity: 55, completedQty: 29, operation: "Stitching" },
  { id: "8",  bundleNumber: "B-0898", productionOrder: "PO-2024-044", quantity: 50, completedQty: 0,  operation: "Cutting" },
];

// ── Generate 35 machines with realistic demo data ──────────────────────────────
function generateMachines(): MachineData[] {
  const statusPool: MachineStatus[] = [
    "running","running","running","running","running","running",
    "idle","idle","idle",
    "offline",
    "maintenance",
    "unassigned",
  ];
  const machines: MachineData[] = [];
  let machineIndex = 1;
  let workerIndex = 0;
  let bundleIndex = 0;

  SECTIONS.forEach((section) => {
    const sectionMachineCount = section.machines;
    const totalWidth = (sectionMachineCount - 1) * MACHINE_SPACING_X;
    const startX = -totalWidth / 2;

    for (let i = 0; i < sectionMachineCount; i++) {
      const id = `M${String(machineIndex).padStart(2, "0")}`;
      const status = statusPool[machineIndex % statusPool.length] as MachineStatus;
      const hasWorker = status === "running" || status === "idle";
      const hasBundle = status === "running";

      const worker = hasWorker ? DEMO_WORKERS[workerIndex % DEMO_WORKERS.length] : undefined;
      const bundle = hasBundle ? DEMO_BUNDLES[bundleIndex % DEMO_BUNDLES.length] : undefined;

      if (hasWorker) workerIndex++;
      if (hasBundle) bundleIndex++;

      const x = startX + i * MACHINE_SPACING_X;

      machines.push({
        id,
        numericId: machineIndex,
        section: section.name,
        sectionIndex: i,
        status,
        worker,
        bundle,
        efficiency: status === "running" ? 65 + Math.floor(Math.random() * 30) : 0,
        todayOutput: status === "running" ? 120 + Math.floor(Math.random() * 180) : 0,
        targetOutput: 280,
        uptime: status === "running" ? 200 + Math.floor(Math.random() * 200) : 0,
        lastActivity: new Date(Date.now() - Math.random() * 3600000),
        health: 70 + Math.floor(Math.random() * 30),
        position: [x, 0, section.zOffset],
      });

      machineIndex++;
    }
  });

  return machines;
}

// ── KPIs ────────────────────────────────────────────────────────────────────
export function computeKPIs(machines: MachineData[]): FactoryKPIs {
  const running = machines.filter((m) => m.status === "running").length;
//   const idle    = machines.filter((m) => m.status === "idle").length;
  const offline = machines.filter((m) => m.status === "offline").length;
  const maintenance = machines.filter((m) => m.status === "maintenance").length;
  const workersPresent = machines.filter((m) => m.worker).length;
  const activeBundles  = machines.filter((m) => m.bundle).length;
  const totalOutput    = machines.reduce((a, m) => a + m.todayOutput, 0);
  const totalTarget    = machines.reduce((a, m) => a + m.targetOutput, 0);
  const avgEff         = running > 0
    ? Math.round(machines.filter((m) => m.status === "running").reduce((a, m) => a + m.efficiency, 0) / running)
    : 0;

  return {
    workersPresent,
    totalWorkers: 32,
    runningMachines: running,
    totalMachines: machines.length,
    productionToday: totalOutput,
    productionTarget: totalTarget,
    efficiency: avgEff,
    activeBundles,
    alerts: offline + maintenance,
    activeOrders: 4,
    qcPassRate: 94,
  };
}

// ── Demo Alerts ───────────────────────────────────────────────────────────────
export const DEMO_ALERTS: AlertItem[] = [
  { id: "a1", type: "machine_offline",    title: "Machine Offline",       description: "M10 went offline – check power supply",        timestamp: new Date(Date.now() - 5 * 60000),   priority: "high",   machineId: "M10" },
  { id: "a2", type: "worker_absent",      title: "Worker Absent",         description: "EMP-003 Priya Patel hasn't clocked in",        timestamp: new Date(Date.now() - 12 * 60000),  priority: "medium" },
  { id: "a3", type: "qc_reject",          title: "QC Rejection",          description: "Bundle B-0891 – 6 defects at Stitching M07",   timestamp: new Date(Date.now() - 28 * 60000),  priority: "high",   machineId: "M07" },
  { id: "a4", type: "terminal_offline",   title: "Terminal Offline",      description: "NFC terminal T-14 is not responding",          timestamp: new Date(Date.now() - 45 * 60000),  priority: "medium" },
  { id: "a5", type: "bundle_completed",   title: "Bundle Completed",      description: "Bundle B-0893 completed at Assembly M16",      timestamp: new Date(Date.now() - 60 * 60000),  priority: "low",    machineId: "M16" },
  { id: "a6", type: "production_target",  title: "Target Achieved",       description: "Section PACKING hit 100% of daily target",     timestamp: new Date(Date.now() - 90 * 60000),  priority: "low" },
];

// ── Timeline Events ─────────────────────────────────────────────────────────
export const DEMO_TIMELINE: TimelineEvent[] = [
  { id: "t1", time: "08:02", type: "attendance_in",    description: "Aisha Noor clocked IN at M01",         machineId: "M01", workerName: "Aisha Noor" },
  { id: "t2", time: "08:15", type: "bundle_start",     description: "Bundle B-0891 started at M07",         machineId: "M07" },
  { id: "t3", time: "08:47", type: "attendance_in",    description: "John Silva clocked IN at M06",          machineId: "M06", workerName: "John Silva" },
  { id: "t4", time: "09:10", type: "bundle_complete",  description: "Bundle B-0893 completed at M16",       machineId: "M16" },
  { id: "t5", time: "09:12", type: "qc_pass",          description: "Bundle B-0893 passed QC (48/50 pass)", machineId: "M16" },
  { id: "t6", time: "09:31", type: "machine_offline",  description: "Machine M10 went offline",              machineId: "M10" },
  { id: "t7", time: "09:45", type: "bundle_start",     description: "Bundle B-0894 started at M18",         machineId: "M18" },
  { id: "t8", time: "10:03", type: "qc_fail",          description: "Bundle B-0891 QC failed – 6 defects",  machineId: "M07" },
  { id: "t9", time: "10:22", type: "machine_online",   description: "Machine M04 back online",               machineId: "M04" },
  { id: "t10",time: "10:45", type: "bundle_complete",  description: "Bundle B-0895 completed at M28",       machineId: "M28" },
];

// ── Hook ────────────────────────────────────────────────────────────────────
export function useFactoryData() {
  const machines = useMemo(() => generateMachines(), []);
  const kpis     = useMemo(() => computeKPIs(machines), [machines]);

  return {
    machines,
    kpis,
    alerts: DEMO_ALERTS,
    timeline: DEMO_TIMELINE,
    sections: SECTIONS,
  };
}
