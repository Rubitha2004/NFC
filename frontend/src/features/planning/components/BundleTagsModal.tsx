import { motion, AnimatePresence } from "framer-motion";
import { X, Printer, Nfc, CheckCircle2, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BundleTagsModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
  bundles: { quantity: number }[];
}

export function BundleTagsModal({ isOpen, onClose, orderNumber, bundles }: BundleTagsModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-zinc-950 border border-emerald-500/30 rounded-2xl shadow-2xl shadow-emerald-900/20 flex flex-col max-h-[85vh] overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-emerald-500/20 bg-emerald-950/20 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-full text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Order Planned & Tags Generated!</h2>
                <p className="text-emerald-400/80 mt-1">Successfully published to IoT terminals. {bundles.length} bundles generated for {orderNumber}.</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1 custom-scrollbar bg-zinc-900/30">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white/90 flex items-center gap-2">
                <Tags className="w-5 h-5 text-blue-400" />
                NFC Bundle Tags Preview
              </h3>
              <div className="flex items-center gap-3">
                <Button className="bg-zinc-800 hover:bg-zinc-700 text-white gap-2 border border-white/10">
                  <Printer className="w-4 h-4" />
                  Print Labels
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-500 text-white font-bold gap-2 shadow-lg shadow-blue-500/20">
                  <Nfc className="w-4 h-4" />
                  Encode NFC Tags
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {bundles.map((bundle, index) => {
                const bundleNumber = `${orderNumber}-B${(index + 1).toString().padStart(3, '0')}`;
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={index} 
                    className="bg-white rounded-xl overflow-hidden border border-zinc-200 shadow-md group relative"
                  >
                    {/* Simulated Label Sticker */}
                    <div className="p-4 bg-white text-zinc-900 relative">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Bundle ID</div>
                          <div className="text-lg font-black font-mono tracking-tight">{bundleNumber}</div>
                        </div>
                        <div className="w-10 h-10 border-2 border-zinc-900 rounded flex items-center justify-center">
                          <Nfc className="w-6 h-6 text-zinc-900" />
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-end border-t border-dashed border-zinc-300 pt-3">
                        <div>
                          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Quantity</div>
                          <div className="text-2xl font-bold">{bundle.quantity} <span className="text-sm font-medium text-zinc-500">pcs</span></div>
                        </div>
                        
                        {/* Simulated Barcode */}
                        <div className="flex gap-[2px] h-8 opacity-80">
                          {[...Array(16)].map((_, i) => (
                            <div key={i} className={`h-full bg-zinc-900 ${Math.random() > 0.5 ? 'w-1' : 'w-0.5'}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
