import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useUserStore } from "../store/user.store";
import { useUserRecords } from "../hooks/useUserData";
import { userSchema, type UserFormValues } from "../types/user.types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export function AddUserDialog() {
  const store = useUserStore();
  const { addUser, ROLES, DEPARTMENTS, STATUSES } = useUserRecords();
  
  const uniqueStatuses = Array.from(new Set(STATUSES));

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "Viewer",
      department: "",
      status: "Active",
      remarks: "",
    },
  });

  function onSubmit(data: UserFormValues) {
    addUser(data);
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
            className="relative w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-zinc-900/50 flex-shrink-0">
              <div>
                <h2 className="text-xl font-bold text-white">Add New User</h2>
                <p className="text-sm text-white/50 mt-1">Create an account and provision access roles.</p>
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
                <form id="create-user-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="fullName" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/70">Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" className="bg-zinc-900/50 border-white/10 text-white" {...field} />
                        </FormControl>
                        <FormMessage className="text-rose-400" />
                      </FormItem>
                    )} />
                    
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/70">Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john.doe@example.com" className="bg-zinc-900/50 border-white/10 text-white" {...field} />
                        </FormControl>
                        <FormMessage className="text-rose-400" />
                      </FormItem>
                    )} />
                  </div>

                  {/* Credentials */}
                  <div className="p-4 bg-zinc-900/30 rounded-xl border border-white/5 space-y-4">
                    <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider">Account Credentials</h3>
                    
                    <FormField control={form.control} name="username" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/70">Username</FormLabel>
                        <FormControl>
                          <Input placeholder="john.doe" className="bg-zinc-950 border-white/10 text-white" {...field} />
                        </FormControl>
                        <FormMessage className="text-rose-400" />
                      </FormItem>
                    )} />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField control={form.control} name="password" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/70">Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" className="bg-zinc-950 border-white/10 text-white" {...field} />
                          </FormControl>
                          <FormMessage className="text-rose-400" />
                        </FormItem>
                      )} />
                      
                      <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/70">Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" className="bg-zinc-950 border-white/10 text-white" {...field} />
                          </FormControl>
                          <FormMessage className="text-rose-400" />
                        </FormItem>
                      )} />
                    </div>
                  </div>

                  {/* Access & Role */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormField control={form.control} name="role" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/70">Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-zinc-900/50 border-white/10 text-white">
                              <SelectValue placeholder="Select Role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-rose-400" />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="department" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/70">Department</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-zinc-900/50 border-white/10 text-white">
                              <SelectValue placeholder="Select Department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-rose-400" />
                      </FormItem>
                    )} />
                    
                    <FormField control={form.control} name="status" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/70">Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-zinc-900/50 border-white/10 text-white">
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {uniqueStatuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-rose-400" />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="remarks" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/70">Remarks / Notes</FormLabel>
                      <FormControl>
                        <textarea 
                          placeholder="Optional notes about this user..." 
                          className="w-full min-h-[80px] rounded-md border border-white/10 bg-zinc-900/50 px-3 py-2 text-sm text-white placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 custom-scrollbar" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-rose-400" />
                    </FormItem>
                  )} />
                  
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
                form="create-user-form"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-900/20"
              >
                <Check className="w-4 h-4 mr-2" />
                Create User
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
