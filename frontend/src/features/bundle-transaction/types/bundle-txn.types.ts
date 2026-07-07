export type TxnStatus = "Started" | "Completed" | "Transferred" | "Rework" | "Pending" | "QC";

export interface BundleTxn {
  id: string;
  transactionId: string;
  bundleNumber: string;
  
  fromMachine?: string;
  toMachine?: string;
  
  worker: string;
  operation: string;
  
  timestamp: string;
  status: TxnStatus;
  
  remarks?: string;
}
