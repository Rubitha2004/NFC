import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Radio, Activity, CheckCircle, AlertTriangle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import type { Bundle } from '../types/bundle.types';

interface BundleIoTSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  bundle: Bundle | null;
}

export function BundleIoTSimulatorModal({ isOpen, onClose, bundle }: BundleIoTSimulatorModalProps) {
  const queryClient = useQueryClient();
  const [isScanning, setIsScanning] = useState(false);

  const scanMutation = useMutation({
    mutationFn: async (payload: { tagCode: string; workerCardId: string; terminalCode: string }) => {
      const response = await axios.post('/api/iot/scan', payload);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
      toast.success(data.data?.message || 'Scan successful');
      onClose();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || err.message || 'Scan failed');
    }
  });

  if (!isOpen || !bundle) return null;

  const isReady = bundle.activeTagCode && bundle.activeWorkerCardId && bundle.activeTerminalCode;

  const handleSimulate = async () => {
    if (!isReady) return;
    setIsScanning(true);
    
    // Slight delay for "simulation" feel
    await new Promise(r => setTimeout(r, 600));
    
    scanMutation.mutate({
      tagCode: bundle.activeTagCode!,
      workerCardId: bundle.activeWorkerCardId!,
      terminalCode: bundle.activeTerminalCode!
    });
    
    setIsScanning(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between p-5 border-b border-white/10 bg-zinc-950/50">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-blue-500" />
              Test IoT Scan
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/50">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
              <h3 className="font-bold text-blue-400 mb-1">{bundle.bundleNumber}</h3>
              <p className="text-sm text-blue-300/70">
                Current Operation: <span className="text-white font-medium">{bundle.operation}</span>
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-zinc-950 border border-white/5 rounded-lg">
                <span className="text-white/50 text-sm">Tag Code (NFC):</span>
                <span className="font-mono text-sm text-emerald-400">{bundle.activeTagCode || 'Missing'}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-zinc-950 border border-white/5 rounded-lg">
                <span className="text-white/50 text-sm">Terminal Code (Machine):</span>
                <span className="font-mono text-sm text-blue-400">{bundle.activeTerminalCode || 'Missing'}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-zinc-950 border border-white/5 rounded-lg">
                <span className="text-white/50 text-sm">Worker Card ID:</span>
                <span className="font-mono text-sm text-purple-400">{bundle.activeWorkerCardId || 'Missing'}</span>
              </div>
            </div>

            {!isReady && (
              <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-lg text-sm">
                <AlertTriangle className="w-4 h-4" />
                This bundle is missing an assigned tag, machine terminal, or worker card ID. Simulation is not possible.
              </div>
            )}
          </div>
          
          <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-zinc-950/50">
            <button 
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button 
              disabled={!isReady || isScanning || scanMutation.isPending}
              onClick={handleSimulate}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-blue-900/20 px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all"
            >
              {(isScanning || scanMutation.isPending) ? <Activity className="w-4 h-4 animate-spin" /> : <Radio className="w-4 h-4" />}
              {scanMutation.isPending ? 'Scanning...' : 'Simulate Scan'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
