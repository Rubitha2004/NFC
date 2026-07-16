import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, breadcrumbs, children, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-border/40 pb-6 mb-6", className)}>
      <div className="space-y-1.5">
        {breadcrumbs && (
          <div className="mb-3">
            {breadcrumbs}
          </div>
        )}
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground max-w-2xl">{description}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-3 shrink-0 flex-wrap mt-2 md:mt-0">{children}</div>}
    </div>
  );
}

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export function PageContainer({ children, className, animate = true }: PageContainerProps) {
  if (!animate) {
    return (
      <main className={cn("flex flex-col flex-1 p-4 sm:p-6 lg:p-8 max-w-[1800px] mx-auto w-full", className)}>
        {children}
      </main>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn("flex flex-col flex-1 p-4 sm:p-6 lg:p-8 max-w-[1800px] mx-auto w-full", className)}
    >
      {children}
    </motion.main>
  );
}
