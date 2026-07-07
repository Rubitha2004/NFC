import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export function SearchBar({ placeholder = "Search anything...", className }: SearchBarProps) {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Keyboard shortcut: Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("global-search")?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div
      className={cn(
        "relative flex items-center h-9 rounded-lg border bg-muted/50 transition-all",
        isFocused && "bg-background border-ring shadow-sm ring-1 ring-ring/30",
        className
      )}
    >
      <Search className="absolute left-3 h-3.5 w-3.5 text-muted-foreground" />
      <input
        id="global-search"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="w-full bg-transparent pl-9 pr-16 text-sm outline-none placeholder:text-muted-foreground/70"
      />
      {value ? (
        <button
          onClick={() => setValue("")}
          className="absolute right-3 text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : (
        <kbd className="absolute right-3 text-[10px] text-muted-foreground/60 font-mono bg-muted border rounded px-1">
          ⌘K
        </kbd>
      )}
    </div>
  );
}
