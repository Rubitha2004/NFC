import { ProductionOrderHeader } from "./components/ProductionOrderHeader";
import { ProductionOrderKPIs } from "./components/ProductionOrderKPIs";
import { ProductionOrderFilter } from "./components/ProductionOrderFilter";
import { ProductionOrderTable } from "./components/ProductionOrderTable";
import { ProductionOrderDetailsDrawer } from "./components/ProductionOrderDetailsDrawer";
import { AddProductionOrderDialog } from "./components/AddProductionOrderDialog";

export default function ProductionOrderPage() {
  return (
    <div className="h-full flex flex-col bg-zinc-950 overflow-hidden relative">
      <ProductionOrderHeader />
      <ProductionOrderKPIs />
      <ProductionOrderFilter />
      <ProductionOrderTable />
      
      <ProductionOrderDetailsDrawer />
      <AddProductionOrderDialog />
    </div>
  );
}
