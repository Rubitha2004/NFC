import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
}

export function PageContainer({ children, className, animate = true }: PageContainerProps) {
  if (!animate) {
    return (
      <main className={cn("p-6 max-w-[1600px] mx-auto w-full space-y-6 flex-1", className)}>
        {children}
      </main>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn("p-4 md:p-6 lg:p-8 max-w-[1800px] mx-auto w-full space-y-6 flex-1", className)}
    >
      {children}
    </motion.main>
  );
}
