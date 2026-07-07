import { useMemo } from "react";
import { create } from "zustand";
import type { QCInspection, QCResult, QCFormValues } from "../types/qc.types";

function seeded(seed: number, max: number) {
  const x = Math.sin(seed + 1) * 10000;
  return Math.floor((x - Math.floor(x)) * max);
}

const RESULTS: QCResult[] = ["Pass", "Pass", "Pass", "Fail", "Rework", "Pending"];
const DEPARTMENTS = ["Stitching", "Finishing", "Packing"];
const OPERATIONS = ["Collar Stitching", "Side Seam", "Hemming", "Button Attach"];
const WORKERS = ["W-1042 (John Doe)", "W-1043 (Jane Smith)", "W-1044 (Alice Fox)"];
const MACHINES = ["MCH-1001", "MCH-1002", "MCH-2001"];
const POS = ["PO-2026001", "PO-2026002"];
const INSPECTORS = ["Insp-01 (Sarah)", "Insp-02 (Mike)"];
const BUNDLES = ["BND-10041", "BND-10042", "BND-10043"];

function generateMockQCRecords(count: number): QCInspection[] {
  const now = new Date().getTime();
  
  return Array.from({ length: count }).map((_, i) => {
    const seed = i * 31;
    const result = RESULTS[seeded(seed, RESULTS.length)];
    
    let defectCount = 0;
    if (result === "Fail") defectCount = 3 + seeded(seed + 1, 5);
    if (result === "Rework") defectCount = 1 + seeded(seed + 2, 3);

    const timeOffset = seeded(seed + 3, 100) * 3600000;
    const date = new Date(now - timeOffset).toISOString();

    return {
      id: `qc_${i + 1}`,
      inspectionId: `QC-${30000 + i + 1}`,
      bundleNumber: BUNDLES[seeded(seed + 4, BUNDLES.length)],
      productionOrder: POS[seeded(seed + 5, POS.length)],
      worker: WORKERS[seeded(seed + 6, WORKERS.length)],
      machine: MACHINES[seeded(seed + 7, MACHINES.length)],
      department: DEPARTMENTS[seeded(seed + 8, DEPARTMENTS.length)],
      operation: OPERATIONS[seeded(seed + 9, OPERATIONS.length)],
      inspector: INSPECTORS[seeded(seed + 10, INSPECTORS.length)],
      
      result,
      defectCount,
      remarks: defectCount > 0 ? "Irregular stitching detected." : undefined,
      
      images: [],
      date,

      timeline: [
        { id: 't1', timestamp: new Date(now - timeOffset - 1800000).toISOString(), action: "Bundle Arrived at QC", actor: "System" },
        { id: 't2', timestamp: date, action: `Inspection ${result}`, actor: INSPECTORS[seeded(seed + 10, INSPECTORS.length)] }
      ]
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

interface QCDataStore {
  inspections: QCInspection[];
  addInspection: (data: QCFormValues) => void;
}

const useInternalQCStore = create<QCDataStore>((set) => ({
  inspections: generateMockQCRecords(120),
  addInspection: (data) => set((state) => {
    const newInspection: QCInspection = {
      id: `qc_new_${Date.now()}`,
      inspectionId: `QC-${30000 + state.inspections.length + 1}`,
      bundleNumber: data.bundleNumber,
      productionOrder: POS[0], 
      worker: WORKERS[0],
      machine: MACHINES[0],
      department: "Finishing",
      operation: data.operation,
      inspector: data.inspector,
      result: data.result,
      defectCount: data.defectCount,
      remarks: data.remarks,
      images: [],
      date: new Date().toISOString(),
      timeline: [{ id: 't1', timestamp: new Date().toISOString(), action: `Manual Inspection logged as ${data.result}`, actor: data.inspector }]
    };
    return { inspections: [newInspection, ...state.inspections] };
  })
}));

export function useQCRecords() {
  const { inspections, addInspection } = useInternalQCStore();

  const stats = useMemo(() => {
    const passed = inspections.filter(i => i.result === "Pass").length;
    const failed = inspections.filter(i => i.result === "Fail").length;
    const rework = inspections.filter(i => i.result === "Rework").length;
    const pending = inspections.filter(i => i.result === "Pending").length;
    const total = passed + failed + rework; // excludes pending from percentage

    const passPercentage = total > 0 ? (passed / total) * 100 : 0;

    return { passed, failed, rework, pending, passPercentage: passPercentage.toFixed(1) };
  }, [inspections]);

  return {
    inspections,
    stats,
    addInspection,
    DEPARTMENTS,
    OPERATIONS,
    WORKERS,
    MACHINES,
    POS,
    INSPECTORS,
    BUNDLES,
  };
}
