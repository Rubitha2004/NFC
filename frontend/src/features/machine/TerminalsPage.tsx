import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTerminalStore } from "../terminal/store/terminal.store";
import { TerminalKPIs } from "../terminal/components/TerminalKPIs";
import { TerminalTable } from "../terminal/components/TerminalTable";
import { TerminalForm } from "../terminal/components/TerminalForm";
import { TerminalDetailsDrawer } from "../terminal/components/TerminalDetailsDrawer";

export default function TerminalsPage() {
  const { setFormOpen, setSelectedTerminal } = useTerminalStore();

  const handleAddClick = () => {
    setSelectedTerminal(null);
    setFormOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-white overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Terminals</h1>
          <p className="text-sm text-white/50 mt-1">Live monitoring and management of NFC hardware terminals.</p>
        </div>
        <Button onClick={handleAddClick} className="bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/20">
          <Plus className="w-4 h-4 mr-2" />
          Add Terminal
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        <TerminalKPIs />
        <TerminalTable />
      </div>

      <TerminalForm />
      <TerminalDetailsDrawer />
    </div>
  );
}
