import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string | ReactNode;
  subtitle?: string | ReactNode;
  children: ReactNode;
  width?: string;
}

export function DetailsDrawer({ isOpen, onClose, title, subtitle, children, width = "w-[600px] sm:max-w-none" }: DetailsDrawerProps) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className={cn("p-0 bg-background border-l border-border/40 shadow-2xl flex flex-col", width)}>
        <SheetHeader className="p-6 border-b border-border/40 bg-muted/20 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-xl font-bold tracking-tight">{title}</SheetTitle>
              {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
            </div>
            {/* The default close button is rendered by Sheet, but we can override or just use the default. */}
          </div>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-background">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}
