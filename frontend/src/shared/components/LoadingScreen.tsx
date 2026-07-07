import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";

interface LoadingScreenProps {
  isVisible: boolean;
}

export function LoadingScreen({ isVisible }: LoadingScreenProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
        >
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIwLjMiIG9wYWNpdHk9IjAuMDciPjxwYXRoIGQ9Ik0wIDQwTDQwIDAiLz48cGF0aCBkPSJNMCAwTDQwIDQwIi8+PC9nPjwvc3ZnPg==')] opacity-40" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative flex flex-col items-center gap-8"
          >
            {/* Logo */}
            <Logo className="scale-150" />

            {/* Loading label */}
            <div className="flex flex-col items-center gap-3">
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-sm text-muted-foreground font-medium tracking-widest uppercase"
              >
                Loading Factory...
              </motion.p>

              {/* Progress bar */}
              <div className="w-56 h-1 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full"
                />
              </div>
            </div>

            {/* Company tagline */}
            <p className="text-xs text-muted-foreground/60 tracking-wider">
              Smart Factory ERP Platform
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
