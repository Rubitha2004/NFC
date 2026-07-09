import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { factorySettingsSchema, type FactorySettingsFormValues } from "../../types/settings.types";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function FactorySettingsTab() {
  const form = useForm<FactorySettingsFormValues>({
    resolver: zodResolver(factorySettingsSchema),
    defaultValues: {
      factoryName: "Main Production Facility",
      defaultShift: "morning",
    },
  });

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white">Factory Structure</h2>
        <p className="text-sm text-white/50 mt-1">Configure physical layouts, hierarchies, and production defaults.</p>
      </div>

      <Form {...form}>
        <form className="space-y-6">
          <FormField control={form.control} name="factoryName" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white/70">Main Factory Designation</FormLabel>
              <FormControl>
                <Input className="bg-zinc-900/50 border-white/10 text-white max-w-md" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <div className="pt-4 mt-6 border-t border-white/5">
            <FormField control={form.control} name="defaultShift" render={({ field }) => (
              <FormItem className="max-w-xs">
                <FormLabel className="text-white/70">Default Factory Shift</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-zinc-900/50 border-white/10 text-white">
                      <SelectValue placeholder="Select Shift" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="morning">Morning (06:00 - 14:00)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (14:00 - 22:00)</SelectItem>
                    <SelectItem value="night">Night (22:00 - 06:00)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </form>
      </Form>
    </div>
  );
}
