import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useQCStore } from "../store/qc.store";
import { useQCMutations } from "../hooks/useQCMutations";
import { useBundles } from "../../bundle/hooks/useBundles";
import { useOperations } from "../../operation/hooks/useOperations";
import { useWorkers } from "../../worker/hooks/useWorkers";
import { qcSchema, type QCFormValues } from "../types/qc.types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export function AddInspectionDialog() {
  const store = useQCStore();
  const { create } = useQCMutations();
  
  const { data: bundlesData = [] } = useBundles();
  const { data: opsData = [] } = useOperations();
  const { data: workersData = [] } = useWorkers();

  const BUNDLES = bundlesData.map(b => b.bundleNumber);
  const OPERATIONS = opsData.map(o => o.name);
  const INSPECTORS = workersData.map(w => `${w.firstName} ${w.lastName}`);

  const form = useForm<QCFormValues>({
    resolver: zodResolver(qcSchema),
    defaultValues: {
      bundleNumber: "",
      operation: "",
      inspector: "",
      result: "Pass",
      defectCount: 0,
      remarks: "",
    },
  });

  // Watch the result to reset defect count if Pass/Pending
  const result = form.watch("result");

  function onSubmit(data: QCFormValues) {
    const bundleId = bundlesData.find(b => b.bundleNumber === data.bundleNumber)?.id;
    const inspectorId = workersData.find(w => `${w.firstName} ${w.lastName}` === data.inspector)?.id;

    if (!bundleId) return;

    create.mutate({
      bundleId: parseInt(bundleId),
      transactionId: 1, // Need a real transaction ID eventually
      inspectorId: inspectorId ? parseInt(inspectorId) : undefined,
      inspectedQuantity: data.defectCount > 0 ? data.defectCount : 1, // mocked for now
      passedQuantity: data.result === "Pass" ? 1 : 0,
      defectiveQuantity: data.result === "Fail" ? data.defectCount : 0,
      reworkQuantity: data.result === "Rework" ? data.defectCount : 0,
      status: data.result === "Pass" ? "PASSED" : data.result === "Fail" ? "FAILED" : "PARTIAL",
      notes: data.remarks
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
                <h2 className="text-xl font-bold text-white">New Inspection</h2>
                <p className="text-sm text-white/50 mt-1">Log a new QC result for a bundle.</p>
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
                <form id="create-qc-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="bundleNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/70">Bundle</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-zinc-900/50 border-white/10 text-white">
                                <SelectValue placeholder="Select Bundle" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {BUNDLES.map((b) => (
                                <SelectItem key={b} value={b}>{b}</SelectItem>
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
                  </div>

                  <FormField
                    control={form.control}
                    name="inspector"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/70">Inspector</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-zinc-900/50 border-white/10 text-white">
                              <SelectValue placeholder="Select Inspector" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {INSPECTORS.map((insp) => (
                              <SelectItem key={insp} value={insp}>{insp}</SelectItem>
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
                      name="result"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/70">Result</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-zinc-900/50 border-white/10 text-white">
                                <SelectValue placeholder="Select Result" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Pass">Pass</SelectItem>
                              <SelectItem value="Fail">Fail</SelectItem>
                              <SelectItem value="Rework">Rework</SelectItem>
                              <SelectItem value="Pending">Pending</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-rose-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="defectCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/70">Defect Count</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              disabled={result === "Pass" || result === "Pending"}
                              className="bg-zinc-900/50 border-white/10 text-white" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
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
                            placeholder="Describe defects..." 
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
                form="create-qc-form"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-900/20"
              >
                <Check className="w-4 h-4 mr-2" />
                Save Inspection
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
