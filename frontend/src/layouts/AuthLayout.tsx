import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { Logo } from "@/shared/components/Logo";

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel – branding */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-slate-900 to-slate-800 flex-col justify-between p-10 relative overflow-hidden">
        {/* Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* Logo */}
        <Logo />

        {/* Center content */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Smart Factory<br />
              <span className="text-cyan-400">Production ERP</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Real-time production monitoring, NFC attendance, and quality control for modern garment factories.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-3 gap-4 mt-10"
          >
            {[
              { label: "Workers Tracked", value: "500+" },
              { label: "Machines Live", value: "120+" },
              { label: "Bundles/Day", value: "2,000+" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Footer */}
        <p className="relative text-xs text-slate-500">
          © {new Date().getFullYear()} FactoryOS. All rights reserved.
        </p>
      </div>

      {/* Right panel – auth form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}
