import type { QCInspection } from "../../types/qc.types";
import { Link2, LayoutGrid, User, Settings, Image as ImageIcon } from "lucide-react";
import { QCStatusBadge } from "../QCUIHelpers";

export function QCOverview({ inspection }: { inspection: QCInspection }) {
  return (
    <div className="p-6 space-y-8">
      {/* Quick Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-white/50 mb-2">
            <Link2 className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Bundle & PO</span>
          </div>
          <p className="text-lg font-bold text-white">{inspection.bundleNumber}</p>
          <p className="text-sm font-medium text-blue-400 cursor-pointer hover:underline">{inspection.productionOrder}</p>
        </div>
        
        <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-white/50 mb-2">
            <LayoutGrid className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Operation</span>
          </div>
          <p className="text-lg font-bold text-white">{inspection.operation}</p>
          <p className="text-sm text-white/40">{inspection.department}</p>
        </div>
        
        <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-white/50 mb-2">
            <User className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Worker</span>
          </div>
          <p className="text-base font-medium text-white">{inspection.worker}</p>
        </div>
        
        <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-white/50 mb-2">
            <Settings className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Machine</span>
          </div>
          <p className="text-base font-medium text-emerald-400">{inspection.machine}</p>
        </div>
      </div>

      {/* QC Result Section */}
      <div>
        <h3 className="text-sm font-bold text-white/80 uppercase tracking-wider mb-4">Inspection Details</h3>
        <div className="bg-zinc-900/50 border border-white/5 p-5 rounded-xl space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <span className="text-sm text-white/50">Result</span>
            <QCStatusBadge result={inspection.result} />
          </div>
          
          <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <span className="text-sm text-white/50">Defect Count</span>
            <span className={`text-xl font-bold ${inspection.defectCount > 0 ? "text-rose-400" : "text-emerald-400"}`}>
              {inspection.defectCount}
            </span>
          </div>
          
          <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <span className="text-sm text-white/50">Inspector</span>
            <span className="text-sm font-medium text-white">{inspection.inspector}</span>
          </div>
          
          {inspection.remarks && (
            <div className="pt-2">
              <span className="text-sm text-white/50 block mb-2">Remarks</span>
              <p className="text-sm text-white/80 bg-black/20 p-3 rounded-md border border-white/5">
                {inspection.remarks}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Image Gallery Placeholder */}
      <div>
        <h3 className="text-sm font-bold text-white/80 uppercase tracking-wider mb-4 flex items-center gap-2">
          <ImageIcon className="w-4 h-4" /> Evidence / Images
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="aspect-square bg-zinc-900/80 border border-white/5 rounded-xl flex items-center justify-center group cursor-pointer hover:bg-zinc-800 transition-colors">
              <ImageIcon className="w-8 h-8 text-white/20 group-hover:text-white/40 transition-colors" />
            </div>
          ))}
        </div>
        <p className="text-xs text-white/30 mt-3 text-center">Camera integration would appear here</p>
      </div>
    </div>
  );
}
