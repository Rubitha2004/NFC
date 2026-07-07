import { Download, FileText, Printer, FileSpreadsheet } from "lucide-react";

export function ReportsHeader() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-6 py-4 bg-zinc-950 border-b border-white/[0.05] flex-shrink-0">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Reports & Analytics</h1>
        <p className="text-sm text-white/50 mt-1">Enterprise dashboard for actionable factory insights.</p>
      </div>

      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 px-3 py-2 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 text-sm font-medium rounded-md border border-emerald-500/20 transition-colors">
          <FileSpreadsheet className="w-4 h-4" /> Excel
        </button>
        <button className="flex items-center gap-2 px-3 py-2 bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 text-sm font-medium rounded-md border border-rose-500/20 transition-colors">
          <FileText className="w-4 h-4" /> PDF
        </button>
        <button className="flex items-center gap-2 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-white/80 text-sm font-medium rounded-md border border-white/10 transition-colors">
          <Download className="w-4 h-4" /> CSV
        </button>
        <button className="flex items-center gap-2 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-white/80 text-sm font-medium rounded-md border border-white/10 transition-colors">
          <Printer className="w-4 h-4" /> Print
        </button>
      </div>
    </div>
  );
}
