import { useState, useRef } from "react";
import { RotateCcw, Search, X, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMachineSelection } from "../../hooks/useMachineSelection";
import type { MachineData } from "../../types/factory.types";

interface CameraControlsProps {
  machines: MachineData[];
  onReset: () => void;
  onToggleFullscreen: () => void;
  className?: string;
}

export function CameraControls({ machines, onReset, onToggleFullscreen, className }: CameraControlsProps) {
  const [searchVal, setSearchVal] = useState("");
  const [results, setResults] = useState<MachineData[]>([]);
  const { selectMachine, setSearch } = useMachineSelection();
const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (q: string) => {
    setSearchVal(q);
    if (!q.trim()) {
      setResults([]);
      setSearch("", null);
      return;
    }
    const found = machines.filter((m) =>
      m.id.toLowerCase().includes(q.toLowerCase()) ||
      m.worker?.name.toLowerCase().includes(q.toLowerCase()) ||
      m.bundle?.bundleNumber.toLowerCase().includes(q.toLowerCase())
    ).slice(0, 6);
    setResults(found);
  };

  const handlePick = (m: MachineData) => {
    selectMachine(m);
    setSearch(m.id, m.id);
    setSearchVal(m.id);
    setResults([]);
  };

  const handleClear = () => {
    setSearchVal("");
    setResults([]);
    setSearch("", null);
  };

  return (
    <div className={cn("absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2", className)}>
      {/* Search */}
      <div className="relative">
        <div className="flex items-center gap-2 h-9 px-3 rounded-xl border bg-background/90 backdrop-blur-md shadow-lg">
          <Search className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchVal}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search machine / worker / bundle…"
            className="w-56 bg-transparent text-xs outline-none placeholder:text-muted-foreground/60"
          />
          {searchVal && (
            <button onClick={handleClear} className="text-muted-foreground hover:text-foreground">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Results dropdown */}
        {results.length > 0 && (
          <div className="absolute bottom-full mb-2 w-full bg-background/95 backdrop-blur-md border rounded-xl shadow-xl overflow-hidden">
            {results.map((m) => (
              <button
                key={m.id}
                onClick={() => handlePick(m)}
                className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-muted/50 transition-colors text-left"
              >
                <span className="text-xs font-bold text-blue-400 w-10">{m.id}</span>
                <span className="text-xs text-foreground flex-1">{m.worker?.name ?? "No worker"}</span>
                {m.bundle && (
                  <span className="text-[10px] text-muted-foreground">{m.bundle.bundleNumber}</span>
                )}
                <span className={cn("w-2 h-2 rounded-full flex-shrink-0",
                  m.status === "running" ? "bg-green-400" :
                  m.status === "idle" ? "bg-yellow-400" :
                  m.status === "offline" ? "bg-red-400" :
                  "bg-gray-400"
                )} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Camera action buttons */}
      <div className="flex items-center gap-1 h-9 px-2 rounded-xl border bg-background/90 backdrop-blur-md shadow-lg">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onReset} title="Reset camera">
          <RotateCcw className="w-3.5 h-3.5" />
        </Button>
        <div className="w-px h-4 bg-border" />
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onToggleFullscreen} title="Fullscreen">
          <Maximize2 className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Legend */}
      <div className="h-9 px-3 rounded-xl border bg-background/90 backdrop-blur-md shadow-lg flex items-center gap-3">
        {[
          { label: "Running",     dot: "bg-green-400 shadow-[0_0_4px_#4ade80]" },
          { label: "Idle",        dot: "bg-yellow-400" },
          { label: "Offline",     dot: "bg-red-400" },
          { label: "Maintenance", dot: "bg-orange-400" },
        ].map(({ label, dot }) => (
          <div key={label} className="flex items-center gap-1">
            <span className={cn("w-2 h-2 rounded-full", dot)} />
            <span className="text-[10px] text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
