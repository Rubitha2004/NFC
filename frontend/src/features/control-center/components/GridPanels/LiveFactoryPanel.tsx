import { FactoryFloor } from "../../../factory/components/FactoryFloor";

export function LiveFactoryPanel() {
  return (
    <div className="flex flex-col h-full bg-zinc-950 rounded-xl overflow-hidden border border-white/5 relative">
      <div className="absolute top-3 left-4 z-10">
        <h3 className="text-sm font-semibold text-white drop-shadow-md">Live Factory Floor</h3>
        <p className="text-[10px] text-white/50 drop-shadow-md">Real-time terminal and machine mapping</p>
      </div>
      
      {/* We reuse the existing interactive FactoryFloor component */}
      <div className="flex-1 w-full h-full relative">
        <FactoryFloor />
      </div>
    </div>
  );
}
