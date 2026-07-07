import { useMemo } from "react";
import type { BundleTxn, TxnStatus } from "../types/bundle-txn.types";

function seeded(seed: number, max: number) {
  const x = Math.sin(seed + 1) * 10000;
  return Math.floor((x - Math.floor(x)) * max);
}

const STATUSES: TxnStatus[] = ["Started", "Completed", "Transferred", "Rework", "Pending", "QC"];
const OPERATIONS = ["Cutting", "Stitching", "Overlock", "Quality Check", "Packing"];
const WORKERS = ["W-1042 (John Doe)", "W-1043 (Jane Smith)", "W-1044 (Alice Fox)", "W-1045 (Bob Ross)"];
const MACHINES = ["MCH-1001", "MCH-1002", "MCH-1003", "MCH-2001"];

function generateMockTxns(count: number): BundleTxn[] {
  const now = new Date().getTime();
  
  return Array.from({ length: count }).map((_, i) => {
    const seed = i * 29;
    
    const timeOffset = seeded(seed, 48) * 3600000 + seeded(seed + 1, 60) * 60000;
    const timestamp = new Date(now - timeOffset).toISOString();
    
    const status = STATUSES[seeded(seed + 2, STATUSES.length)];
    const isTransfer = status === "Transferred";

    return {
      id: `txn_${i + 1}`,
      transactionId: `TXN-${20000 + i + 1}`,
      bundleNumber: `BND-${10000 + seeded(seed + 3, 50)}`,
      
      fromMachine: isTransfer ? MACHINES[seeded(seed + 4, MACHINES.length)] : undefined,
      toMachine: isTransfer ? MACHINES[seeded(seed + 5, MACHINES.length)] : MACHINES[seeded(seed + 6, MACHINES.length)],
      
      worker: WORKERS[seeded(seed + 7, WORKERS.length)],
      operation: OPERATIONS[seeded(seed + 8, OPERATIONS.length)],
      
      timestamp,
      status,
      
      remarks: status === "Rework" ? "Defect spotted in seam." : undefined,
    };
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

const mockTxns = generateMockTxns(250);

export function useBundleTxnRecords() {
  const stats = useMemo(() => {
    const started = mockTxns.filter(t => t.status === "Started").length;
    const completed = mockTxns.filter(t => t.status === "Completed").length;
    const transfers = mockTxns.filter(t => t.status === "Transferred").length;
    const rework = mockTxns.filter(t => t.status === "Rework").length;
    const pending = mockTxns.filter(t => t.status === "Pending").length;

    return { started, completed, transfers, rework, pending };
  }, []);

  return {
    transactions: mockTxns,
    stats,
  };
}
