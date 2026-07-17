import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useBundleStore } from "../store/bundle.store";
import { useBundleMutations } from "../hooks/useBundleMutations";
import { useProductionOrders } from "../../production-order/hooks/useProductionOrdersHooks";
import { useOperations } from "../../operation/hooks/useOperations";
import { bundleSchema, type BundleFormValues } from "../types/bundle.types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export function AddBundleDialog() {
  const store = useBundleStore();
  const { create } = useBundleMutations();
  const { data: posData = [] } = useProductionOrders();
  const { data: opsData = [] } = useOperations({ status: 'ACTIVE' });
  
  const POS = posData.map(p => p.orderNumber);
  const OPERATIONS = opsData.map(o => o.name);

  const form = useForm<BundleFormValues>({
    resolver: zodResolver(bundleSchema),
    defaultValues: {
      productionOrder: "",
      operation: "",
      targetPieces: 50,
      priority: "medium",
      remarks: "",
    },
  });

  function onSubmit(data: BundleFormValues) {
    const poId = posData.find(p => p.orderNumber === data.productionOrder)?.id;
    if (!poId) return; // Basic fallback for UI validation
    
    create.mutate({
      productionOrderId: parseInt(poId),
      quantity: data.targetPieces,
      status: "CREATED",
    });
    store.setCreateModalOpen(false);
    form.reset();
  }

  return (
    <AnimatePresence>
      {store.isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => store.setCreateModalOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-zinc-900/50 flex-shrink-0">
              <div>
                <h2 className="text-xl font-bold text-white">Create Bundle</h2>
                <p className="text-sm text-white/50 mt-1">Split operations from an existing Production Order.</p>
              </div>
              <button
                onClick={() => store.setCreateModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-6 flex-1 custom-scrollbar">
              <Form {...form}>
                <form id="create-bundle-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  <FormField
                    control={form.control}
                    name="productionOrder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/70">Production Order</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-zinc-900/50 border-white/10 text-white">
                              <SelectValue placeholder="Select PO" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {POS.map((po) => (
                              <SelectItem key={po} value={po}>{po}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-rose-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="operation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/70">Operation</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-zinc-900/50 border-white/10 text-white">
                              <SelectValue placeholder="Select Operation" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {OPERATIONS.map((op) => (
                              <SelectItem key={op} value={op}>{op}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-rose-400" />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="targetPieces"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/70">Target Pieces</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              className="bg-zinc-900/50 border-white/10 text-white" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage className="text-rose-400" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/70">Priority</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-zinc-900/50 border-white/10 text-white">
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-rose-400" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="remarks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/70">Remarks</FormLabel>
                        <FormControl>
                          <textarea 
                            placeholder="Optional instructions..." 
                            className="w-full min-h-[80px] rounded-md border border-white/10 bg-zinc-900/50 px-3 py-2 text-sm text-white placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 custom-scrollbar" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-rose-400" />
                      </FormItem>
                    )}
                  />
                  
                </form>
              </Form>
            </div>

            <div className="p-6 border-t border-white/10 bg-zinc-900/50 flex justify-end gap-3 flex-shrink-0">
              <Button
                variant="ghost"
                onClick={() => store.setCreateModalOpen(false)}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="create-bundle-form"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-900/20"
              >
                <Check className="w-4 h-4 mr-2" />
                Create Bundle
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
