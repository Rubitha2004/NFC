import { useState, useEffect } from "react";
import { motion,  } from "framer-motion";
import { X, CheckCircle2, PlayCircle, HardDrive, Wifi, Save, FileText } from "lucide-react";
import { useControlCenterStore } from "../../store/controlCenter.store";

interface ValidationReleaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ValidationReleaseModal({ isOpen, onClose }: ValidationReleaseModalProps) {
  const { selectedOrderId } = useControlCenterStore();
  const [isValidating, setIsValidating] = useState(true);
  const [isReleased, setIsReleased] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsValidating(true);
      setIsReleased(false);
      const timer = setTimeout(() => setIsValidating(false), 2000); // simulate validation
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleRelease = () => {
    setIsReleased(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-zinc-950 border border-white/10 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-zinc-900/50">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-emerald-500" />
              Release to Factory Floor
            </h2>
            <p className="text-xs text-white/50 mt-1">Order: <span className="text-emerald-400 font-mono font-bold">{selectedOrderId}</span></p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-white/50 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-zinc-950 grid grid-cols-2 gap-6">
          {/* Validation Checklist */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400" /> Validation Checklist
            </h3>
            
            <div className="space-y-3">
              {[
                { label: "Worker Assigned", val: "Jane Doe (Senior)" },
                { label: "Machine Assigned", val: "Stitching M-04" },
                { label: "Terminal Connected", val: "TRM-04 (Online)", icon: <Wifi className="w-3 h-3 text-emerald-500 ml-1 inline" /> },
                { label: "Shift Active", val: "Shift A (08:00 - 16:00)" },
                { label: "Material Available", val: "In Stock (100%)" },
                { label: "QC Ready", val: "Inspector assigned" }
              ].map((check, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-white/5">
                  <div className="text-xs text-white/70">{check.label}</div>
                  <div className="text-xs font-semibold text-white flex items-center gap-1">
                    {isValidating ? (
                      <span className="w-3 h-3 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin mr-1" />
                    ) : (
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 mr-1" />
                    )}
                    {check.val}
                    {check.icon}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Generated IoT Payload Preview */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" /> IoT Assignment Payload
            </h3>
            
            <div className="bg-zinc-900 p-4 rounded-lg border border-white/5 h-full max-h-[300px] overflow-y-auto custom-scrollbar font-mono text-[10px] text-emerald-400 relative">
              {isValidating ? (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/80 backdrop-blur-sm z-10">
                  <span className="text-emerald-500 font-semibold animate-pulse">Generating Payload...</span>
                </div>
              ) : null}
              <pre>
{`{
  "command": "ASSIGN_PRODUCTION",
  "timestamp": "${new Date().toISOString()}",
  "payload": {
    "terminal_id": "TRM-04",
    "machine_code": "M-04",
    "worker": {
      "rfid": "04:88:B2:9A:1A",
      "id": "W-902",
      "name": "Jane Doe"
    },
    "order": {
      "id": "${selectedOrderId}",
      "operation": "Collar Stitch",
      "target_qty": 500
    },
    "shift_id": "SHF-A"
  }
}`}
              </pre>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-white/10 bg-zinc-900/50 flex justify-between items-center">
          <div className="text-xs text-white/50">
            {isValidating ? "Validating dependencies..." : isReleased ? "Assignment sent to Terminal." : "Ready to release."}
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white/70 hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button 
              disabled={isValidating || isReleased}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-zinc-800 hover:bg-zinc-700 text-white transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" /> Save Draft
            </button>
            <button 
              onClick={handleRelease}
              disabled={isValidating || isReleased}
              className="px-6 py-2 rounded-lg text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isReleased ? <CheckCircle2 className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
              {isReleased ? "Released" : "Release to Factory"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
