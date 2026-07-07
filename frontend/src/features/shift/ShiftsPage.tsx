import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useShiftStore } from "./store/shift.store";
import { ShiftKPIs } from "./components/ShiftKPIs";
import { ShiftTable } from "./components/ShiftTable";
import { ShiftForm } from "./components/ShiftForm";
import { ShiftDetailsDrawer } from "./components/ShiftDetailsDrawer";

export default function ShiftsPage() {
  const { setFormOpen, setSelectedShift } = useShiftStore();

  const handleAddClick = () => {
    setSelectedShift(null);
    setFormOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-white overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Shifts</h1>
          <p className="text-sm text-white/50 mt-1">Manage production shifts, worker attendance, and scheduling.</p>
        </div>
        <Button onClick={handleAddClick} className="bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/20">
          <Plus className="w-4 h-4 mr-2" />
          Add Shift
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        <ShiftKPIs />
        <ShiftTable />
      </div>

      <ShiftForm />
      <ShiftDetailsDrawer />
    </div>
  );
}
