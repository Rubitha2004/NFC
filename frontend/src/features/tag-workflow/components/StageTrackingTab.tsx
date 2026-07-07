import { useState } from "react";
import { motion } from "framer-motion";
import { ScanLine, LogIn, LogOut, Clock, CheckCircle2, RefreshCw, ChevronRight } from "lucide-react";
import { useStageLogs, useScanIn, useScanOut } from "../hooks/useTagWorkflow";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/axios";
import type { StageLog } from "../types/tag-workflow.types";

function useBundles() {
  return useQuery({
    queryKey: ['bundles'],
    queryFn: async () => {
      const { data } = await apiClient.get<any>('/bundles');
      return Array.isArray(data.data) ? data.data : (Array.isArray(data.data?.data) ? data.data.data : []);
    }
  });
}
function useOperations() {
  return useQuery({
    queryKey: ['operations'],
    queryFn: async () => {
      const { data } = await apiClient.get<any>('/operations');
      return Array.isArray(data.data) ? data.data : (Array.isArray(data.data?.data) ? data.data.data : []);
    }
  });
}
function useWorkers() {
  return useQuery({
    queryKey: ['workers'],
    queryFn: async () => {
      const { data } = await apiClient.get<any>('/workers');
      return Array.isArray(data.data) ? data.data : (Array.isArray(data.data?.data) ? data.data.data : []);
    }
  });
}
function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data } = await apiClient.get<any>('/tags');
      return Array.isArray(data.data) ? data.data : (Array.isArray(data.data?.data) ? data.data.data : []);
    }
  });
}

export function StageTrackingTab() {
  const { data: logs = [], isLoading, refetch, isRefetching } = useStageLogs();
  const { data: bundles = [] } = useBundles();
  const { data: operations = [] } = useOperations();
  const { data: workers = [] } = useWorkers();
  const { data: tags = [] } = useTags();
  const scanIn = useScanIn();
  const scanOut = useScanOut();

  const [form, setForm] = useState({ bundleId: '', tagId: '', operationId: '', operatorId: '', remarks: '' });
  const [error, setError] = useState('');

  const handleScanIn = () => {
    setError('');
    if (!form.bundleId || !form.tagId || !form.operationId || !form.operatorId) {
      setError('Please fill all required fields.');
      return;
    }
    scanIn.mutate({
      bundleId: Number(form.bundleId),
      tagId: Number(form.tagId),
      operationId: Number(form.operationId),
      operatorId: Number(form.operatorId),
      remarks: form.remarks || undefined,
    }, {
      onSuccess: () => setForm({ bundleId: '', tagId: '', operationId: '', operatorId: '', remarks: '' }),
      onError: (e: any) => setError(e?.response?.data?.error || e.message || 'Scan in failed'),
    });
  };

  const handleScanOut = (logId: number) => {
    scanOut.mutate({ logId });
  };

  const openLogs = logs.filter(l => !l.outTime);
  const closedLogs = logs.filter(l => l.outTime);

  return (
    <div className="h-full flex overflow-hidden">
      {/* Left: Scan Form */}
      <div className="w-80 xl:w-96 flex-shrink-0 border-r border-white/[0.05] flex flex-col bg-zinc-900/20 overflow-auto custom-scrollbar">
        <div className="p-5">
          <h3 className="text-sm font-bold text-white/80 uppercase tracking-widest mb-4">Stage Scan</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-white/40 font-semibold uppercase tracking-wider block mb-1">Bundle *</label>
              <select value={form.bundleId} onChange={e => setForm(f => ({ ...f, bundleId: e.target.value }))}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500">
                <option value="">Select bundle...</option>
                {bundles.map(b => <option key={b.id} value={b.id}>{b.bundleNumber}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-white/40 font-semibold uppercase tracking-wider block mb-1">NFC Tag *</label>
              <select value={form.tagId} onChange={e => setForm(f => ({ ...f, tagId: e.target.value }))}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500">
                <option value="">Select tag...</option>
                {tags.filter(t => t.status === 'AVAILABLE' || t.id === Number(form.tagId)).map(t => (
                  <option key={t.id} value={t.id}>{t.tagCode} ({t.status})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-white/40 font-semibold uppercase tracking-wider block mb-1">Stage / Operation *</label>
              <select value={form.operationId} onChange={e => setForm(f => ({ ...f, operationId: e.target.value }))}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500">
                <option value="">Select operation...</option>
                {operations.map(o => <option key={o.id} value={o.id}>{o.operationName}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-white/40 font-semibold uppercase tracking-wider block mb-1">Operator (Worker) *</label>
              <select value={form.operatorId} onChange={e => setForm(f => ({ ...f, operatorId: e.target.value }))}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500">
                <option value="">Select worker...</option>
                {workers.map(w => <option key={w.id} value={w.id}>{w.firstName} {w.lastName} ({w.employeeCode})</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-white/40 font-semibold uppercase tracking-wider block mb-1">Remarks</label>
              <input value={form.remarks} onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))}
                placeholder="Optional..."
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500" />
            </div>
            {error && <p className="text-rose-400 text-xs">{error}</p>}
            <button
              onClick={handleScanIn}
              disabled={scanIn.isPending}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              {scanIn.isPending ? 'Scanning...' : 'Scan In'}
            </button>
          </div>
        </div>

        {/* Open Scans (can scan out) */}
        {openLogs.length > 0 && (
          <div className="px-5 pb-5">
            <h4 className="text-xs font-bold text-amber-400/70 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Clock className="w-3 h-3" /> Open Scans ({openLogs.length})
            </h4>
            <div className="space-y-2">
              {openLogs.map(log => (
                <div key={log.id} className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3">
                  <p className="text-white text-xs font-bold">{log.bundle.bundleNumber} → {log.operation.operationName}</p>
                  <p className="text-white/40 text-[10px] mt-0.5">{log.operator.firstName} {log.operator.lastName}</p>
                  <p className="text-white/25 text-[10px]">In: {new Date(log.inTime).toLocaleTimeString()}</p>
                  <button
                    onClick={() => handleScanOut(log.id)}
                    disabled={scanOut.isPending}
                    className="mt-2 flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300"
                  >
                    <LogOut className="w-3 h-3" /> Scan Out
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right: Stage Log Table */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.05]">
          <h3 className="text-sm font-semibold text-white/60">Stage Transaction Log</h3>
          <button onClick={() => refetch()} disabled={isRefetching} className="text-white/40 hover:text-white transition-colors">
            <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="flex-1 overflow-auto custom-scrollbar">
          {isLoading ? (
            <div className="p-5 space-y-2">{[...Array(6)].map((_, i) => <div key={i} className="h-14 rounded-lg bg-zinc-900 animate-pulse" />)}</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-zinc-900/90 backdrop-blur-md">
                <tr>
                  {['Bundle', 'Tag', 'Operation', 'Operator', 'Scan In', 'Scan Out', 'Status'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-[10px] font-semibold text-white/30 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-white/[0.015] transition-colors">
                    <td className="px-4 py-3 text-xs font-bold text-white font-mono">{log.bundle.bundleNumber}</td>
                    <td className="px-4 py-3 text-xs text-white/60 font-mono">{log.tag.tagCode}</td>
                    <td className="px-4 py-3 text-xs text-white/70">{log.operation.operationName}</td>
                    <td className="px-4 py-3 text-xs text-white/60">{log.operator.firstName} {log.operator.lastName}</td>
                    <td className="px-4 py-3 text-xs text-white/50 font-mono">{new Date(log.inTime).toLocaleTimeString()}</td>
                    <td className="px-4 py-3 text-xs text-white/50 font-mono">{log.outTime ? new Date(log.outTime).toLocaleTimeString() : '—'}</td>
                    <td className="px-4 py-3">
                      {log.outTime ? (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">Closed</span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">Open</span>
                      )}
                    </td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-12 text-center text-white/20 text-sm">No stage scans yet. Use Scan In to begin.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
