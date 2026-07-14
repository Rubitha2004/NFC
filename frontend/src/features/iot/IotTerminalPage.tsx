import { useState } from "react";
import { ScanLine, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/services/axios";

export default function IotTerminalPage() {
  const [terminalCode, setTerminalCode] = useState("TERM-001");
  const [workerCardId, setWorkerCardId] = useState("");
  const [tagCode, setTagCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagCode || !workerCardId) {
      toast.error("Please enter both Worker ID and Tag Code");
      return;
    }

    setLoading(true);
    setLastResult(null);

    try {
      const res = await api.post("/iot/scan", {
        tagCode,
        workerCardId,
        terminalCode
      });
      setLastResult({ success: true, data: res.data.data });
      toast.success(res.data.data.message);
      setTagCode(""); // Reset tag code for next scan
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message;
      setLastResult({ success: false, error: errorMsg });
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-zinc-900 border border-white/10 p-8 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
          <div className="bg-blue-500/20 p-4 rounded-xl text-blue-500">
            <ScanLine className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">IoT Terminal</h1>
            <p className="text-zinc-400">Terminal: {terminalCode}</p>
          </div>
        </div>

        <form onSubmit={handleScan} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Worker NFC Card ID</label>
            <input 
              type="text" 
              autoFocus
              value={workerCardId}
              onChange={e => setWorkerCardId(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="e.g., CARD-001"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Bundle Tag Code</label>
            <input 
              type="text" 
              value={tagCode}
              onChange={e => setTagCode(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="e.g., TAG-001"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-lg py-4 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Process Scan"}
          </button>
        </form>

        {lastResult && (
          <div className={`mt-8 p-6 rounded-xl border ${lastResult.success ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
            <div className="flex items-start gap-3">
              {lastResult.success ? <CheckCircle2 className="w-6 h-6 shrink-0 mt-1" /> : <XCircle className="w-6 h-6 shrink-0 mt-1" />}
              <div>
                <h3 className="font-bold text-lg mb-1">{lastResult.success ? lastResult.data.action : 'Scan Failed'}</h3>
                <p className="opacity-90">{lastResult.success ? lastResult.data.message : lastResult.error}</p>
                
                {lastResult.success && (
                  <div className="mt-4 space-y-1 text-sm opacity-80">
                    <div>Bundle: <span className="font-mono text-white">{lastResult.data.bundle}</span></div>
                    <div>Operation: <span className="text-white">{lastResult.data.operation}</span></div>
                    <div>Worker: <span className="text-white">{lastResult.data.worker}</span></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
