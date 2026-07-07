import { Plus, Download, Upload, Shield } from "lucide-react";
import { useUserStore } from "../store/user.store";

export function UserHeader() {
  const store = useUserStore();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-6 py-4 bg-zinc-950 border-b border-white/[0.05] flex-shrink-0">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">User Management</h1>
        <p className="text-sm text-white/50 mt-1">Manage users, access control, and permissions.</p>
      </div>

      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-white/80 text-sm font-medium rounded-md border border-white/10 transition-colors">
          <Upload className="w-4 h-4" /> Import
        </button>
        <button className="flex items-center gap-2 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-white/80 text-sm font-medium rounded-md border border-white/10 transition-colors">
          <Download className="w-4 h-4" /> Export
        </button>
        <div className="w-px h-6 bg-white/10 mx-1" />
        <button className="flex items-center gap-2 px-3 py-2 bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 text-sm font-medium rounded-md border border-purple-500/20 transition-colors">
          <Shield className="w-4 h-4" /> Assign Role
        </button>
        <button
          onClick={() => store.setCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-md shadow-lg shadow-blue-900/20 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>
    </div>
  );
}
