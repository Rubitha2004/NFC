import { Plus, Download, Upload, History, Copy } from "lucide-react";
import { useAssignmentStore } from "../store/assignment.store";

export function AssignmentHeader() {
  const store = useAssignmentStore();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-6 py-4 bg-zinc-950 border-b border-white/[0.05] flex-shrink-0">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Assignment Management
        </h1>
        <p className="text-sm text-white/50 mt-1">
          Manage worker allocations across production lines.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium rounded-md border border-white/10 transition-colors">
          <History className="w-4 h-4 text-white/60" />
          Assignment History
        </button>
        <button className="flex items-center gap-2 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium rounded-md border border-white/10 transition-colors">
          <Download className="w-4 h-4 text-white/60" />
          Export
        </button>
        <button className="flex items-center gap-2 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium rounded-md border border-white/10 transition-colors">
          <Upload className="w-4 h-4 text-white/60" />
          Import
        </button>
        <button className="flex items-center gap-2 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium rounded-md border border-white/10 transition-colors">
          <Copy className="w-4 h-4 text-white/60" />
          Bulk Assignment
        </button>
        <button 
          onClick={() => store.setAddDialogOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold rounded-md shadow-lg shadow-rose-900/20 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Assignment
        </button>
      </div>
    </div>
  );
}
