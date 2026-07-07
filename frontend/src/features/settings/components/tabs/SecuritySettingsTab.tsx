import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { securitySettingsSchema, type SecuritySettingsFormValues } from "../../types/settings.types";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export function SecuritySettingsTab() {
  const form = useForm<SecuritySettingsFormValues>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      passwordPolicy: "strong",
      sessionTimeout: 60,
      twoFactorAuth: true,
      accountLockPolicy: 5,
    },
  });

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white">Security & Authentication</h2>
        <p className="text-sm text-white/50 mt-1">Configure password rules, session lifetimes, and MFA requirements.</p>
      </div>

      <Form {...form}>
        <form className="space-y-6">
          
          <div className="p-4 bg-zinc-900/30 rounded-xl border border-white/5 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Two-Factor Authentication (2FA)</h3>
              <p className="text-xs text-white/40 mt-1">Enforce 2FA globally for all Administrators and Managers.</p>
            </div>
            <FormField control={form.control} name="twoFactorAuth" render={({ field }) => (
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            )} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <FormField control={form.control} name="passwordPolicy" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/70">Password Policy Strength</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-zinc-900/50 border-white/10 text-white">
                      <SelectValue placeholder="Select Policy" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="basic">Basic (8 chars, 1 number)</SelectItem>
                    <SelectItem value="strong">Strong (10 chars, upper/lower, numbers, symbols)</SelectItem>
                    <SelectItem value="strict">Strict (12 chars, 90-day rotation, no history reuse)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="sessionTimeout" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/70">Idle Session Timeout (Minutes)</FormLabel>
                <FormControl>
                  <Input type="number" className="bg-zinc-900/50 border-white/10 text-white" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="accountLockPolicy" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/70">Failed Logins Before Lockout</FormLabel>
                <FormControl>
                  <Input type="number" className="bg-zinc-900/50 border-white/10 text-white" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </form>
      </Form>
    </div>
  );
}
