import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Tag, CheckCircle2, AlertCircle, RefreshCw, Unlink, Link } from "lucide-react";
import { useTags, useCreateTag, useReleaseTag, useAssignTag, useAvailableTags } from "../hooks/useTagWorkflow";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/axios";
import type { Tag as TagType } from "../types/tag-workflow.types";

function ScanTagModal({ onClose }: { onClose: () => void }) {
  const [tagCode, setTagCode] = useState("");
  const create = useCreateTag();

  const handleSubmit = () => {
    if (!tagCode.trim()) return;
    create.mutate({ tagCode: tagCode.trim() }, {
      onSuccess: () => { setTagCode(""); onClose(); }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-sm bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl"
      >
        <h3 className="text-lg font-bold text-white mb-1">Scan New Tag Into Pool</h3>
        <p className="text-sm text-white/40 mb-5">Enter the physical NFC tag code to register it.</p>
        <input
          autoFocus
          value={tagCode}
          onChange={e => setTagCode(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="e.g. TAG-001"
          className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-emerald-500 mb-4"
        />
        {create.isError && <p className="text-rose-400 text-xs mb-3">{(create.error as any)?.message || 'Error creating tag'}</p>}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-white/10 text-white/60 text-sm hover:bg-white/5">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={!tagCode.trim() || create.isPending}
            className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold disabled:opacity-50"
          >
            {create.isPending ? "Scanning..." : "Register Tag"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export function TagPoolTab() {
  const { data: tags = [], isLoading, refetch, isRefetching } = useTags();
  const releaseTag = useReleaseTag();
  const [showScan, setShowScan] = useState(false);

  const available = tags.filter(t => t.status === 'AVAILABLE');
  const assigned = tags.filter(t => t.status === 'ASSIGNED');

  return (
    <div className="h-full flex flex-col bg-zinc-950 overflow-hidden">
      {showScan && <ScanTagModal onClose={() => setShowScan(false)} />}

      {/* Sub-header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.05]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-400">{available.length} Available</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
            <Link className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-bold text-amber-400">{assigned.length} Assigned</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => refetch()} disabled={isRefetching} className="flex items-center gap-2 px-3 py-2 text-sm text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowScan(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" /> Scan Tag
          </button>
        </div>
      </div>

      {/* Tag Grid */}
      <div className="flex-1 overflow-auto p-6 custom-scrollbar">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => <div key={i} className="h-28 rounded-xl bg-zinc-900 animate-pulse" />)}
          </div>
        ) : tags.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-20">
            <Tag className="w-12 h-12 text-white/10 mb-4" />
            <p className="text-white/40 font-semibold">No tags in pool</p>
            <p className="text-white/20 text-sm mt-1">Click "Scan Tag" to register a new NFC tag.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {tags.map((tag, idx) => (
              <motion.div
                key={tag.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02 }}
                className={`p-4 rounded-xl border flex flex-col gap-3 group relative ${
                  tag.status === 'AVAILABLE'
                    ? 'bg-emerald-500/5 border-emerald-500/20'
                    : 'bg-amber-500/5 border-amber-500/20'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-lg bg-zinc-900/80">
                    <Tag className={`w-4 h-4 ${tag.status === 'AVAILABLE' ? 'text-emerald-400' : 'text-amber-400'}`} />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                    tag.status === 'AVAILABLE'
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                      : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                  }`}>{tag.status}</span>
                </div>
                <div>
                  <p className="text-white font-bold font-mono text-sm">{tag.tagCode}</p>
                  {tag.status === 'ASSIGNED' && tag.bundle && (
                    <p className="text-xs text-white/40 mt-0.5 truncate">{tag.bundle.bundleNumber}</p>
                  )}
                  {tag.status === 'ASSIGNED' && tag.assignedAt && (
                    <p className="text-[10px] text-white/25 mt-0.5">
                      Since {new Date(tag.assignedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                {tag.status === 'ASSIGNED' && (
                  <button
                    onClick={() => releaseTag.mutate(tag.id)}
                    disabled={releaseTag.isPending}
                    className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    <Unlink className="w-3 h-3" /> Release Tag
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
