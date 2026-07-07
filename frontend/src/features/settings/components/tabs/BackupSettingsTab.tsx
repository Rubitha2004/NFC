import { CloudRain, Download, DatabaseBackup, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BackupSettingsTab() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white">Database Backups</h2>
        <p className="text-sm text-white/50 mt-1">Manage manual snapshots and automated backup schedules.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-zinc-900/50 rounded-xl border border-white/10 flex flex-col items-center text-center hover:bg-zinc-900 transition-colors">
          <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center mb-4">
            <DatabaseBackup className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white mb-2">Manual Snapshot</h3>
          <p className="text-xs text-white/40 mb-6 flex-1">Create an immediate backup of the entire ERP database schema and records.</p>
          <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10">Create Backup</Button>
        </div>

        <div className="p-6 bg-zinc-900/50 rounded-xl border border-white/10 flex flex-col items-center text-center hover:bg-zinc-900 transition-colors">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center mb-4">
            <UploadCloud className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white mb-2">Restore Backup</h3>
          <p className="text-xs text-white/40 mb-6 flex-1">Upload a previous SQL or JSON dump to restore the database to an earlier state.</p>
          <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10">Restore Database</Button>
        </div>

        <div className="p-6 bg-zinc-900/50 rounded-xl border border-white/10 flex flex-col items-center text-center hover:bg-zinc-900 transition-colors">
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mb-4">
            <CloudRain className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white mb-2">Automated Schedule</h3>
          <p className="text-xs text-white/40 mb-6 flex-1">Currently backing up to AWS S3 every 24 hours at 03:00 AM.</p>
          <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10">Configure Schedule</Button>
        </div>
      </div>

      <div className="pt-6 border-t border-white/5">
        <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Recent Snapshots</h3>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-zinc-900/30 rounded-lg border border-white/5">
              <div>
                <p className="text-sm font-bold text-white">erp_dump_2026_07_{10-i}.sql</p>
                <p className="text-xs text-white/40 mt-0.5">Automated Backup • 4.2 GB</p>
              </div>
              <button className="p-2 hover:bg-white/10 rounded-md transition-colors text-blue-400">
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
