import { Save, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SettingsActionFooter() {
  return (
    <div className="flex items-center justify-end gap-3 px-6 py-4 bg-zinc-950 border-t border-white/[0.05] flex-shrink-0">
      <Button variant="ghost" className="text-white/60 hover:text-white hover:bg-white/5">
        <X className="w-4 h-4 mr-2" />
        Cancel
      </Button>
      <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
        <RotateCcw className="w-4 h-4 mr-2" />
        Reset
      </Button>
      <Button className="bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-900/20">
        <Save className="w-4 h-4 mr-2" />
        Save Settings
      </Button>
    </div>
  );
}
