import { BundleTxnHeader } from "./components/BundleTxnHeader";
import { BundleTxnKPIs } from "./components/BundleTxnKPIs";
import { BundleTxnTable } from "./components/BundleTxnTable";
import { BundleTxnDetailsDrawer } from "./components/BundleTxnDetailsDrawer";

export default function BundleTransactionPage() {
  return (
    <div className="h-full flex flex-col bg-zinc-950 overflow-hidden relative">
      <BundleTxnHeader />
      <BundleTxnKPIs />
      <BundleTxnTable />
      
      <BundleTxnDetailsDrawer />
    </div>
  );
}
