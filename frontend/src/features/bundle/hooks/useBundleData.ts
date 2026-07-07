import { useMemo } from "react";
import { create } from "zustand";
import type { Bundle, BundleStatus, BundlePriority, BundleFormValues } from "../types/bundle.types";

function seeded(seed: number, max: number) {
  const x = Math.sin(seed + 1) * 10000;
  return Math.floor((x - Math.floor(x)) * max);
}

function seededBool(seed: number, probability: number) {
  const x = Math.sin(seed + 1) * 10000;
  return (x - Math.floor(x)) < probability;
}

const OPERATIONS = ["Cutting", "Stitching - Side Seam", "Stitching - Collar", "Overlock", "Quality Check", "Packing"];
const DEPARTMENTS = ["Cutting", "Stitching", "Finishing", "Packing"];
const STATUSES: BundleStatus[] = ["in_progress", "in_progress", "completed", "rejected", "delayed"];
const PRIORITIES: BundlePriority[] = ["low", "medium", "high", "urgent"];
const WORKERS = ["W-1042 (John Doe)", "W-1043 (Jane Smith)", "W-1044 (Alice Fox)", "W-1045 (Bob Ross)"];
const MACHINES = ["MCH-1001", "MCH-1002", "MCH-1003", "MCH-2001"];
const POS = ["PO-2026001", "PO-2026002", "PO-2026003", "PO-2026004"];

function generateMockBundles(count: number): Bundle[] {
  const today = new Date();
  
  return Array.from({ length: count }).map((_, i) => {
    const seed = i * 23;
    const targetPieces = 50 + seeded(seed, 50); // 50 to 100
    const status = STATUSES[seeded(seed + 1, STATUSES.length)];
    
    let completedPieces = 0;
    if (status === "completed") completedPieces = targetPieces;
    else if (status === "in_progress" || status === "delayed") {
      completedPieces = Math.floor(targetPieces * (0.1 + (seeded(seed + 2, 80) / 100)));
    } else if (status === "rejected") {
      completedPieces = Math.floor(targetPieces * 0.3);
    }

    const defectivePieces = Math.floor(completedPieces * (seeded(seed + 3, 5) / 100));

    const startedTime = new Date(today);
    startedTime.setHours(today.getHours() - seeded(seed + 4, 48));
    
    const completedTime = status === "completed" ? new Date(startedTime.getTime() + seeded(seed + 5, 24) * 3600000) : undefined;

    return {
      id: `bndl_${i + 1}`,
      bundleNumber: `BND-${10000 + i + 1}`,
      productionOrder: POS[seeded(seed + 6, POS.length)],
      operation: OPERATIONS[seeded(seed + 7, OPERATIONS.length)],
      department: DEPARTMENTS[seeded(seed + 8, DEPARTMENTS.length)],
      
      targetPieces,
      completedPieces,
      defectivePieces,

      currentWorker: status !== "completed" && seededBool(seed + 9, 0.8) ? WORKERS[seeded(seed + 10, WORKERS.length)] : undefined,
      currentMachine: status !== "completed" && seededBool(seed + 11, 0.7) ? MACHINES[seeded(seed + 12, MACHINES.length)] : undefined,
      
      priority: PRIORITIES[seeded(seed + 13, PRIORITIES.length)],
      status,
      
      startedTime: startedTime.toISOString(),
      completedTime: completedTime?.toISOString(),
      remarks: seededBool(seed + 14, 0.2) ? "Requires extra attention on seams." : undefined,
      
      qcResult: status === "completed" ? "Pass" : status === "rejected" ? "Fail" : "Pending",
      
      timeline: [
        { id: `t1`, timestamp: startedTime.toISOString(), action: "Bundle Generated from PO", user: "System" },
        { id: `t2`, timestamp: new Date(startedTime.getTime() + 60000).toISOString(), action: "Scanned at Station", user: "Operator" },
      ]
    };
  });
}

interface BundleDataStore {
  bundles: Bundle[];
  addBundle: (data: BundleFormValues) => void;
}

const useInternalBundleStore = create<BundleDataStore>((set) => ({
  bundles: generateMockBundles(150),
  addBundle: (data) => set((state) => {
    const newBundle: Bundle = {
      id: `bndl_new_${Date.now()}`,
      bundleNumber: `BND-${10000 + state.bundles.length + 1}`,
      productionOrder: data.productionOrder,
      operation: data.operation,
      department: "Stitching",
      targetPieces: data.targetPieces,
      completedPieces: 0,
      defectivePieces: 0,
      priority: data.priority,
      status: "in_progress",
      startedTime: new Date().toISOString(),
      remarks: data.remarks,
      qcResult: "Pending",
      timeline: [{ id: `t1`, timestamp: new Date().toISOString(), action: "Bundle Created Manually", user: "Admin" }],
    };
    return { bundles: [newBundle, ...state.bundles] };
  })
}));

export function useBundleRecords() {
  const { bundles, addBundle } = useInternalBundleStore();

  const stats = useMemo(() => {
    const total = bundles.length;
    const inProgress = bundles.filter(b => b.status === "in_progress").length;
    const completed = bundles.filter(b => b.status === "completed").length;
    const rejected = bundles.filter(b => b.status === "rejected").length;
    const delayed = bundles.filter(b => b.status === "delayed").length;

    return { total, inProgress, completed, rejected, delayed };
  }, [bundles]);

  return {
    bundles,
    stats,
    addBundle,
    POS,
    OPERATIONS,
    DEPARTMENTS,
  };
}
