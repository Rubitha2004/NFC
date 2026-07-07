import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, RefreshCw, AlertTriangle, CheckCircle2, RotateCcw } from "lucide-react";
import { useQCChecks, useCreateQCCheck } from "../hooks/useTagWorkflow";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/axios";
import type { QCTier, QCCheckStatus } from "../types/tag-workflow.types";

function useBundles() {
  return useQuery({ queryKey: ['bundles'], queryFn: async () => {
    const { data } = await apiClient.get<any>('/bundles');
    return Array.isArray(data.data) ? data.data : (Array.isArray(data.data?.data) ? data.data.data : []);
  }});
}
function useWorkers() {
  return useQuery({ queryKey: ['workers'], queryFn: async () => {
    const { data } = await apiClient.get<any>('/workers');
    return Array.isArray(data.data) ? data.data : (Array.isArray(data.data?.data) ? data.data.data : []);
  }});
}
function useOperations() {
  return useQuery({ queryKey: ['operations'], queryFn: async () => {
    const { data } = await apiClient.get<any>('/operations');
    return Array.isArray(data.data) ? data.data : (Array.isArray(data.data?.data) ? data.data.data : []);
  }});
}
function useTags() {
  return useQuery({ queryKey: ['tags'], queryFn: async () => {
    const { data } = await apiClient.get<any>('/tags');
    return Array.isArray(data.data) ? data.data : (Array.isArray(data.data?.data) ? data.data.data : []);
  }});
}

const STATUS_CONFIG = {
  PASS: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', icon: CheckCircle2, label: 'Pass' },
  FAIL: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', icon: ShieldAlert, label: 'Fail' },
  REWORK: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', icon: RotateCcw, label: 'Rework' },
};

const TIER_CONFIG = {
  LINE_QC: { label: 'Tier 1 — Line QC', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  FINAL_QC: { label: 'Tier 2 — Final QC', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
};

export function QCChecksTab() {
  const { data: checks = [], isLoading, refetch, isRefetching } = useQCChecks();
  const createCheck = useCreateQCCheck();
  const { data: bundles = [] } = useBundles();
  const { data: workers = [] } = useWorkers();
  const { data: operations = [] } = useOperations();
  const { data: tags = [] } = useTags();

  const [form, setForm] = useState({
    bundleId: '', tagId: '', qcPersonId: '', qcTier: 'LINE_QC' as QCTier,
    operationId: '', workerId: '', status: 'PASS' as QCCheckStatus, defectNotes: '',
  });
  const [error, setError] = useState('');

  const handleCreate = () => {
    setError('');
    if (!form.bundleId || !form.qcPersonId) { setError('Bundle and QC Person are required.'); return; }
    createCheck.mutate({
      bundleId: Number(form.bundleId),
      tagId: form.tagId ? Number(form.tagId) : undefined,
      qcPersonId: Number(form.qcPersonId),
      qcTier: form.qcTier,
      operationId: form.operationId ? Number(form.operationId) : undefined,
      workerId: form.workerId ? Number(form.workerId) : undefined,
      status: form.status,
      defectNotes: form.defectNotes || undefined,
    }, {
      onSuccess: () => setForm({ bundleId: '', tagId: '', qcPersonId: '', qcTier: 'LINE_QC', operationId: '', workerId: '', status: 'PASS', defectNotes: '' }),
      onError: (e: any) => setError(e?.response?.data?.error || e.message || 'Failed to log QC check'),
    });
  };

  const passed = checks.filter(c => c.status === 'PASS').length;
  const failed = checks.filter(c => c.status === 'FAIL').length;
  const rework = checks.filter(c => c.status === 'REWORK').length;
  const passRate = checks.length > 0 ? ((passed / checks.length) * 100).toFixed(1) : '—';

  return (
    <div className="h-full flex overflow-hidden">
      {/* Left: Log Form */}
      <div className="w-80 xl:w-96 flex-shrink-0 border-r border-white/[0.05] flex flex-col overflow-auto custom-scrollbar bg-zinc-900/20">
        <div className="p-5 space-y-3">
          <h3 className="text-sm font-bold text-white/80 uppercase tracking-widest">Log QC Check</h3>

          {/* Tier toggle */}
          <div className="flex gap-2">
            {(['LINE_QC', 'FINAL_QC'] as QCTier[]).map(tier => (
              <button
                key={tier}
                onClick={() => setForm(f => ({ ...f, qcTier: tier }))}
                className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-colors ${
                  form.qcTier === tier
                    ? tier === 'LINE_QC' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-purple-600 border-purple-500 text-white'
                    : 'border-white/10 text-white/40 hover:text-white/70'
                }`}
              >
                {tier === 'LINE_QC' ? 'Tier 1 Line QC' : 'Tier 2 Final QC'}
              </button>
            ))}
          </div>

          {[
            { label: 'Bundle *', key: 'bundleId', options: bundles.map((b: any) => ({ value: b.id, label: b.bundleNumber })) },
            { label: 'QC Person *', key: 'qcPersonId', options: workers.map((w: any) => ({ value: w.id, label: `${w.firstName} ${w.lastName} (${w.employeeCode})` })) },
            { label: 'Tag (Optional)', key: 'tagId', options: tags.map((t: any) => ({ value: t.id, label: t.tagCode })) },
            ...(form.qcTier === 'LINE_QC' ? [
              { label: 'Operation / Stage', key: 'operationId', options: operations.map((o: any) => ({ value: o.id, label: o.operationName })) },
              { label: 'Worker Being Audited', key: 'workerId', options: workers.map((w: any) => ({ value: w.id, label: `${w.firstName} ${w.lastName}` })) },
            ] : []),
          ].map(({ label, key, options }) => (
            <div key={key}>
              <label className="text-xs text-white/40 font-semibold uppercase tracking-wider block mb-1">{label}</label>
              <select
                value={(form as any)[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="">Select...</option>
                {options.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          ))}

          {/* Status */}
          <div>
            <label className="text-xs text-white/40 font-semibold uppercase tracking-wider block mb-1">Result *</label>
            <div className="grid grid-cols-3 gap-2">
              {(['PASS', 'FAIL', 'REWORK'] as QCCheckStatus[]).map(s => {
                const cfg = STATUS_CONFIG[s];
                return (
                  <button key={s} onClick={() => setForm(f => ({ ...f, status: s }))}
                    className={`py-2 rounded-lg text-xs font-bold border transition-colors ${
                      form.status === s ? `${cfg.bg} ${cfg.text} ${cfg.border}` : 'border-white/10 text-white/30 hover:text-white/60'
                    }`}
                  >{cfg.label}</button>
                );
              })}
            </div>
          </div>

          {(form.status === 'FAIL' || form.status === 'REWORK') && (
            <div>
              <label className="text-xs text-white/40 font-semibold uppercase tracking-wider block mb-1">Defect Notes</label>
              <textarea value={form.defectNotes} onChange={e => setForm(f => ({ ...f, defectNotes: e.target.value }))}
                placeholder="Describe the defect..."
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-rose-500 resize-none min-h-[80px]" />
            </div>
          )}

          {error && <p className="text-rose-400 text-xs">{error}</p>}
          <button
            onClick={handleCreate}
            disabled={createCheck.isPending}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            {createCheck.isPending ? 'Logging...' : 'Log QC Check'}
          </button>
        </div>
      </div>

      {/* Right: QC Log */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* KPIs */}
        <div className="flex items-center gap-4 px-5 py-3 border-b border-white/[0.05] flex-wrap">
          {[
            { label: 'Pass Rate', value: `${passRate}%`, color: 'text-emerald-400' },
            { label: 'Passed', value: passed, color: 'text-emerald-400' },
            { label: 'Failed', value: failed, color: 'text-rose-400' },
            { label: 'Rework', value: rework, color: 'text-amber-400' },
            { label: 'Total Checks', value: checks.length, color: 'text-white' },
          ].map(kpi => (
            <div key={kpi.label} className="flex flex-col">
              <span className={`text-lg font-black ${kpi.color}`}>{kpi.value}</span>
              <span className="text-[10px] text-white/30 uppercase tracking-wider">{kpi.label}</span>
            </div>
          ))}
          <div className="ml-auto">
            <button onClick={() => refetch()} disabled={isRefetching} className="text-white/40 hover:text-white transition-colors">
              <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Check Log */}
        <div className="flex-1 overflow-auto custom-scrollbar p-4 space-y-2">
          {isLoading ? (
            [...Array(5)].map((_, i) => <div key={i} className="h-20 rounded-xl bg-zinc-900 animate-pulse" />)
          ) : checks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ShieldCheck className="w-10 h-10 text-white/10 mb-3" />
              <p className="text-white/30">No QC checks logged yet.</p>
            </div>
          ) : checks.map((check, idx) => {
            const statusCfg = STATUS_CONFIG[check.status];
            const tierCfg = TIER_CONFIG[check.qcTier];
            const StatusIcon = statusCfg.icon;
            return (
              <motion.div
                key={check.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.01 }}
                className={`flex items-start gap-4 p-4 rounded-xl border ${statusCfg.bg} ${statusCfg.border}`}
              >
                <div className={`p-2 rounded-lg bg-zinc-950/50 flex-shrink-0 ${statusCfg.text}`}>
                  <StatusIcon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-bold text-sm font-mono">{check.bundle.bundleNumber}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tierCfg.bg} ${tierCfg.color} ${tierCfg.border}`}>
                      {tierCfg.label}
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}>
                      {statusCfg.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
                    <span className="text-xs text-white/50">QC: <span className="text-white/70">{check.qcPerson.firstName} {check.qcPerson.lastName}</span></span>
                    {check.operation && <span className="text-xs text-white/50">Stage: <span className="text-white/70">{check.operation.operationName}</span></span>}
                    {check.worker && <span className="text-xs text-white/50">Worker: <span className="text-white/70">{check.worker.firstName} {check.worker.lastName}</span></span>}
                  </div>
                  {check.defectNotes && (
                    <p className="text-xs text-rose-300/80 mt-1 italic">"{check.defectNotes}"</p>
                  )}
                </div>
                <span className="text-[10px] text-white/25 font-mono flex-shrink-0">{new Date(check.checkedAt).toLocaleString()}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
