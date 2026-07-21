import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, CalendarIcon, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { useEffect } from "react";
import { useProductionOrderStore } from "../store/production-order.store";
import { useProductionOrders } from "../hooks/useProductionOrderData";
import { useUpdateProductionOrder } from "../hooks/useProductionOrdersHooks";
import { productionOrderSchema, type ProductionOrderFormValues, type ProductionOrder } from "../types/production-order.types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export function EditProductionOrderDialog() {
  const store = useProductionOrderStore();
  const updateMutation = useUpdateProductionOrder();
  const { orders } = useProductionOrders();

  const form = useForm<ProductionOrderFormValues>({
    resolver: zodResolver(productionOrderSchema),
    defaultValues: {
      customerName: "",
      styleNumber: "",
      color: "",
      size: "",
      targetQuantity: 1000,
      department: "",
      priority: "medium",
      remarks: "",
    },
  });

  const orderToEdit = store.editOrderId ? orders.find((o: ProductionOrder) => o.id === store.editOrderId) : null;

  useEffect(() => {
    if (orderToEdit && store.isEditModalOpen) {
      form.reset({
        customerName: orderToEdit.customerName || "",
        styleNumber: orderToEdit.styleNumber || "",
        color: orderToEdit.color || "",
        size: orderToEdit.size || "",
        targetQuantity: orderToEdit.targetQuantity || 1000,
        department: orderToEdit.department || "",
        priority: orderToEdit.priority || "medium",
        dueDate: orderToEdit.dueDate ? new Date(orderToEdit.dueDate) : new Date(),
        remarks: orderToEdit.remarks || "",
      });
    }
  }, [orderToEdit, store.isEditModalOpen, form]);

  function onSubmit(data: ProductionOrderFormValues) {
    if (!store.editOrderId) return;
    updateMutation.mutate({ id: store.editOrderId, data }, {
      onSuccess: () => {
        store.setEditModalOpen(false);
      }
    });
  }

  return (
    <AnimatePresence>
      {store.isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => store.setEditModalOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-zinc-900/50 flex-shrink-0">
              <div>
                <h2 className="text-xl font-bold text-white">Edit Production Order</h2>
                <p className="text-sm text-white/50 mt-1">Modify the details of this production order.</p>
              </div>
              <button
                onClick={() => store.setEditModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-6 flex-1 custom-scrollbar">
              <Form {...form}>
                <form id="edit-order-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/70">Customer Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Nike, Custom Client..." className="bg-zinc-900/50 border-white/10 text-white" {...field} />
                          </FormControl>
                          <FormMessage className="text-rose-400" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/70">Department</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Stitching, Cutting..." className="bg-zinc-900/50 border-white/10 text-white" {...field} />
                          </FormControl>
                          <FormMessage className="text-rose-400" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="styleNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/70">Style Number</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. AW-2026-JK" className="bg-zinc-900/50 border-white/10 text-white" {...field} />
                          </FormControl>
                          <FormMessage className="text-rose-400" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/70">Color</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Navy" className="bg-zinc-900/50 border-white/10 text-white" {...field} />
                          </FormControl>
                          <FormMessage className="text-rose-400" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="size"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/70">Size</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. S, M, L" className="bg-zinc-900/50 border-white/10 text-white" {...field} />
                          </FormControl>
                          <FormMessage className="text-rose-400" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="targetQuantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/70">Target Quantity</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              className="bg-zinc-900/50 border-white/10 text-white" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
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

                    <FormField
                      control={form.control}
                      name="dueDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col pt-2">
                          <FormLabel className="text-white/70 pb-1">Due Date</FormLabel>
                          <Popover>
                            <PopoverTrigger>
                              <FormControl>
                                <div
                                  className={cn(
                                    "flex items-center justify-between h-9 px-4 py-2 w-full bg-zinc-900/50 border border-white/10 text-left text-sm font-normal hover:bg-zinc-800 hover:text-white text-white rounded-md cursor-pointer",
                                    !field.value && "text-white/40"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="h-4 w-4 opacity-50" />
                                </div>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-zinc-900 border-white/10" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date(new Date().setHours(0, 0, 0, 0))
                                }
                              />
                            </PopoverContent>
                          </Popover>
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
                        <FormLabel className="text-white/70">Remarks / Instructions</FormLabel>
                        <FormControl>
                          <textarea 
                            placeholder="Optional production notes..." 
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
                onClick={() => store.setEditModalOpen(false)}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                form="edit-order-form"
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                ) : (
                  <Check className="w-4 h-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
