import { BundleHeader } from "./components/BundleHeader";
import { BundleKPIs } from "./components/BundleKPIs";
import { BundleFilter } from "./components/BundleFilter";
import { BundleTable } from "./components/BundleTable";
import { BundleDetailsDrawer } from "./components/BundleDetailsDrawer";
import { AddBundleDialog } from "./components/AddBundleDialog";

export default function BundlePage() {
  return (
    <div className="h-full flex flex-col bg-zinc-950 overflow-hidden relative">
      <BundleHeader />
      <BundleKPIs />
      <BundleFilter />
      <BundleTable />
      
      <BundleDetailsDrawer />
      <AddBundleDialog />
    </div>
  );
}
