import { BundleHeader } from "./components/BundleHeader";
import { BundleKPIs } from "./components/BundleKPIs";
import { BundleFilter } from "./components/BundleFilter";
import { BundleProductionView } from "./components/BundleProductionView";
import { BundleDetailsDrawer } from "./components/BundleDetailsDrawer";
import { AddBundleDialog } from "./components/AddBundleDialog";

export default function BundlePage() {
  return (
    <div className="h-full flex flex-col bg-zinc-950 overflow-hidden relative">
      <BundleHeader />
      <BundleKPIs />
      <BundleFilter />
      <BundleProductionView />
      
      <BundleDetailsDrawer />
      <AddBundleDialog />
    </div>
  );
}
