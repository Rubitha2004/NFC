import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useMachineTypeStore } from "./store/machineType.store";
import { MachineTypeKPIs } from "./components/MachineTypeKPIs";
import { MachineTypeTable } from "./components/MachineTypeTable";
import { MachineTypeForm } from "./components/MachineTypeForm";
import { MachineTypeDetailsDrawer } from "./components/MachineTypeDetailsDrawer";

export default function MachineTypesPage() {
  const { setFormOpen, setSelectedMachineType } = useMachineTypeStore();

  const handleAddClick = () => {
    setSelectedMachineType(null);
    setFormOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-white overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Machine Types</h1>
          <p className="text-sm text-white/50 mt-1">Manage machine categories, capabilities, and rules.</p>
        </div>
        <Button onClick={handleAddClick} className="bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/20">
          <Plus className="w-4 h-4 mr-2" />
          Add Machine Type
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        <MachineTypeKPIs />
        <MachineTypeTable />
      </div>

      <MachineTypeForm />
      <MachineTypeDetailsDrawer />
    </div>
  );
}

