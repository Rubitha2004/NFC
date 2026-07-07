import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useOperationStore } from "./store/operation.store";
import { OperationKPIs } from "./components/OperationKPIs";
import { OperationTable } from "./components/OperationTable";
import { OperationForm } from "./components/OperationForm";
import { OperationDetailsDrawer } from "./components/OperationDetailsDrawer";

export default function OperationsPage() {
  const { setFormOpen, setSelectedOperation } = useOperationStore();

  const handleAddClick = () => {
    setSelectedOperation(null);
    setFormOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-white overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Operations</h1>
          <p className="text-sm text-white/50 mt-1">Define production steps, SMV values, and machine/skill mappings.</p>
        </div>
        <Button onClick={handleAddClick} className="bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/20">
          <Plus className="w-4 h-4 mr-2" />
          Add Operation
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        <OperationKPIs />
        <OperationTable />
      </div>

      <OperationForm />
      <OperationDetailsDrawer />
    </div>
  );
}
