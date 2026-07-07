import { Plus, Download, GitBranch, GitMerge } from "lucide-react";
import { useBundleStore } from "../store/bundle.store";

export function BundleHeader() {
  const store = useBundleStore();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-6 py-4 bg-zinc-950 border-b border-white/[0.05] flex-shrink-0">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Bundles</h1>
        <p className="text-sm text-white/50 mt-1">Manage, split, and track production bundles.</p>
      </div>

      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium rounded-md border border-white/10 transition-colors">
          <GitBranch className="w-4 h-4 text-white/60" /> Split Bundle
        </button>
        <button className="flex items-center gap-2 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium rounded-md border border-white/10 transition-colors">
          <GitMerge className="w-4 h-4 text-white/60" /> Merge Bundle
        </button>
        <button className="flex items-center gap-2 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium rounded-md border border-white/10 transition-colors">
          <Download className="w-4 h-4 text-white/60" /> Export
        </button>
        <div className="w-px h-6 bg-white/10 mx-1" />
        <button
          onClick={() => store.setCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-md shadow-lg shadow-blue-900/20 transition-colors"
        >
          <Plus className="w-4 h-4" /> Create Bundle
        </button>
      </div>
    </div>
  );
}
