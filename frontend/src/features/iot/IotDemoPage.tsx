import { useState, useEffect, useRef } from "react";
import { ScanLine, CheckCircle2, XCircle, Loader2, Zap, RefreshCw, Package, User, Clock, Activity, AlertTriangle, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow, format } from "date-fns";
import api from "@/services/axios";
import { useTerminals } from "@/features/planning/hooks/useOperationBundles";
import { socketService } from "@/services/socket";

// ── Live bundle tracker panel ────────────────────────────────────────────────
function LiveBundlePanel() {
  const [openLogs, setOpenLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [tick, setTick] = useState(0);

  const fetchAll = async () => {
    setLoading(true);
    try {
      // Fetch open bundles across all operations via recent history
      const { data } = await api.get("/planning/history");
      // Show recent 20 stage logs (both open & closed for demo richness)
      setOpenLogs(Array.isArray(data) ? data.slice(0, 20) : []);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  // Tick to update "live duration" every minute
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  // Live socket updates
  useEffect(() => {
    const socket = socketService.connect();
    socket.on("bundle.updated", () => { fetchAll(); });
    return () => { socket.off("bundle.updated"); };
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <h2 className="text-base font-bold text-white">Live Activity Feed</h2>
        </div>
        <button
          onClick={fetchAll}
          disabled={loading}
          className="text-white/30 hover:text-white/70 transition-colors p-1 rounded"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {openLogs.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-white/30 border-2 border-dashed border-white/10 rounded-xl">
          <Package className="w-10 h-10 mb-3 opacity-30" />
          <p className="text-sm">No activity yet.</p>
          <p className="text-xs mt-1 opacity-60">Perform a scan to see live updates here.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {openLogs.map((log: any, i: number) => {
            const isOpen = !log.outTime;
            const duration = log.inTime
              ? formatDistanceToNow(new Date(log.inTime), { addSuffix: false })
              : "-";
            return (
              <div
                key={log.id || i}
                className={`p-3 rounded-xl border transition-all ${
                  isOpen
                    ? "bg-emerald-500/10 border-emerald-500/30 shadow-md shadow-emerald-900/20"
                    : "bg-zinc-900/60 border-white/5"
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isOpen ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-700 text-zinc-400"}`}>
                    {isOpen ? "IN-PROGRESS" : "COMPLETE"}
                  </span>
                  <span className="text-xs font-mono text-emerald-300 font-medium">{log.bundle?.bundleNumber || "N/A"}</span>
                  <span className="text-white/30 text-xs">•</span>
                  <span className="text-xs text-white/50">{log.operation?.operationName || "N/A"}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-white/40">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {log.operator ? `${log.operator.firstName} ${log.operator.lastName}` : "—"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {log.inTime ? format(new Date(log.inTime), "HH:mm:ss") : "—"}
                  </span>
                  {isOpen && (
                    <span className="text-emerald-400/70 font-medium ml-auto">
                      {duration} ago
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Main Demo Page ───────────────────────────────────────────────────────────
export default function IotDemoPage() {
  const { data: terminals = [] } = useTerminals();
  const [terminalCode, setTerminalCode] = useState("");
  const [workerCardId, setWorkerCardId] = useState("");
  const [tagCode, setTagCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);
  const [scanCount, setScanCount] = useState(0);
  const tagInputRef = useRef<HTMLInputElement>(null);

  // Auto-select first terminal
  useEffect(() => {
    if (terminals.length > 0 && !terminalCode) {
      setTerminalCode(terminals[0].terminalCode);
    }
  }, [terminals]);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagCode || !workerCardId || !terminalCode) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    setLastResult(null);
    try {
      const res = await api.post("/iot/scan", { tagCode, workerCardId, terminalCode });
      const data = res.data.data;
      setLastResult({ success: true, data });
      setScanCount(c => c + 1);
      toast.success(data.message || "Scan processed");
      setTagCode("");
      setTimeout(() => tagInputRef.current?.focus(), 100);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message;
      setLastResult({ success: false, error: errorMsg });
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Top bar */}
      <header className="border-b border-white/5 bg-zinc-900/80 backdrop-blur-md px-6 py-4 flex items-center gap-4 shrink-0">
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2.5 rounded-xl">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight">IoT Live Demo</h1>
          <p className="text-xs text-white/40">Simulate NFC taps and see real-time factory responses</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400 font-medium">Live Socket Connected</span>
          </div>
          {scanCount > 0 && (
            <div className="bg-zinc-800 border border-white/10 px-3 py-1.5 rounded-lg">
              <span className="text-xs text-white/60">{scanCount} scan{scanCount !== 1 ? 's' : ''} this session</span>
            </div>
          )}
        </div>
      </header>

      {/* Main: two-column layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-0 gap-0">
        
        {/* ── Left: Simulator ──────────────────────────────────────────── */}
        <div className="border-r border-white/5 p-6 flex flex-col gap-6 overflow-y-auto">
          <div className="text-xs text-white/30 uppercase tracking-widest font-semibold flex items-center gap-2">
            <ScanLine className="w-4 h-4" /> NFC Terminal Simulator
          </div>

          <form onSubmit={handleScan} className="space-y-5">
            {/* Terminal */}
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Terminal</label>
              <select
                value={terminalCode}
                onChange={e => setTerminalCode(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              >
                {terminals.length === 0 && (
                  <option value="TERM-001">TERM-001 (default)</option>
                )}
                {terminals.map(t => (
                  <option key={t.id} value={t.terminalCode}>
                    {t.terminalCode}{t.terminalName ? ` — ${t.terminalName}` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Worker Card */}
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Worker NFC Card ID</label>
              <input
                type="text"
                autoFocus
                value={workerCardId}
                onChange={e => setWorkerCardId(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                placeholder="e.g. CARD-001"
              />
            </div>

            {/* Bundle Tag */}
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Bundle Tag Code</label>
              <input
                ref={tagInputRef}
                type="text"
                value={tagCode}
                onChange={e => setTagCode(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                placeholder="e.g. TAG-001"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-lg py-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-900/30"
            >
              {loading
                ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing…</>
                : <><ScanLine className="w-5 h-5" /> Simulate Tap &amp; Process</>
              }
            </button>
          </form>

          {/* Result card */}
          {lastResult && (
            <div className={`p-5 rounded-2xl border transition-all ${
              lastResult.success
                ? "bg-emerald-500/10 border-emerald-500/30"
                : "bg-red-500/10 border-red-500/30"
            }`}>
              <div className="flex items-start gap-3">
                {lastResult.success
                  ? <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                  : <XCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
                }
                <div className="flex-1">
                  {lastResult.success ? (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-sm font-bold px-2 py-0.5 rounded-md ${lastResult.data.action === 'SCAN_IN' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'}`}>
                          {lastResult.data.action}
                        </span>
                      </div>
                      <p className="text-emerald-300 font-medium mb-3">{lastResult.data.message}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-black/20 rounded-lg p-2">
                          <div className="text-white/40 text-xs mb-0.5">Bundle</div>
                          <div className="font-mono font-medium">{lastResult.data.bundle}</div>
                        </div>
                        <div className="bg-black/20 rounded-lg p-2">
                          <div className="text-white/40 text-xs mb-0.5">Operation</div>
                          <div className="font-medium">{lastResult.data.operation}</div>
                        </div>
                        <div className="bg-black/20 rounded-lg p-2 col-span-2">
                          <div className="text-white/40 text-xs mb-0.5">Worker</div>
                          <div className="font-medium">{lastResult.data.worker}</div>
                        </div>
                        {lastResult.data.movedToQC && (
                          <div className="col-span-2 bg-purple-500/10 border border-purple-500/20 rounded-lg p-2 text-purple-400 text-xs font-medium flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> Final operation complete — bundle moved to QC queue!
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="font-bold text-red-400 mb-1.5">Scan Failed</h3>
                      <p className="text-red-300/80 text-sm">{lastResult.error}</p>
                      {lastResult.error?.includes("Sequential gate") && (
                        <div className="mt-3 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 flex items-start gap-2 text-amber-400 text-xs">
                          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>This bundle must complete the previous step before scanning into this operation.</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Live bundle feed ───────────────────────────────────── */}
        <div className="p-6 flex flex-col overflow-hidden">
          <div className="text-xs text-white/30 uppercase tracking-widest font-semibold flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4" /> Live Production Feed
          </div>
          <div className="flex-1 overflow-hidden">
            <LiveBundlePanel />
          </div>
        </div>
      </div>
    </div>
  );
}
