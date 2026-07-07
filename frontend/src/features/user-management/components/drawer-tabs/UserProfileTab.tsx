import type { AppUser } from "../../types/user.types";
import { UserRolePill, UserStatusBadge } from "../UserUIHelpers";
import { Mail, Phone, Building2, Calendar } from "lucide-react";

export function UserProfileTab({ user }: { user: AppUser }) {
  return (
    <div className="p-6 space-y-8">
      {/* Bio Section */}
      <div className="flex flex-col items-center p-6 bg-zinc-900/50 border border-white/5 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-blue-500/20 to-transparent"></div>
        <img 
          src={user.profilePhoto} 
          alt={user.fullName} 
          className="w-24 h-24 rounded-full border-4 border-zinc-950 shadow-2xl relative z-10" 
        />
        <h3 className="text-xl font-bold text-white mt-4 relative z-10">{user.fullName}</h3>
        <p className="text-white/50 text-sm mb-3 relative z-10">@{user.username}</p>
        
        <div className="flex gap-2 relative z-10">
          <UserRolePill role={user.role} />
          <UserStatusBadge status={user.status} />
        </div>
      </div>

      {/* Info Grid */}
      <div>
        <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-4">Contact & Employment</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-zinc-900/30 rounded-xl border border-white/5">
            <div className="p-2 bg-white/5 rounded-lg text-blue-400"><Mail className="w-4 h-4" /></div>
            <div>
              <p className="text-[10px] uppercase text-white/40 font-bold tracking-wider">Email Address</p>
              <p className="text-sm text-white truncate">{user.email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-zinc-900/30 rounded-xl border border-white/5">
            <div className="p-2 bg-white/5 rounded-lg text-emerald-400"><Phone className="w-4 h-4" /></div>
            <div>
              <p className="text-[10px] uppercase text-white/40 font-bold tracking-wider">Phone</p>
              <p className="text-sm text-white">{user.phone || "N/A"}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-zinc-900/30 rounded-xl border border-white/5">
            <div className="p-2 bg-white/5 rounded-lg text-amber-400"><Building2 className="w-4 h-4" /></div>
            <div>
              <p className="text-[10px] uppercase text-white/40 font-bold tracking-wider">Department</p>
              <p className="text-sm text-white">{user.department}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-zinc-900/30 rounded-xl border border-white/5">
            <div className="p-2 bg-white/5 rounded-lg text-purple-400"><Calendar className="w-4 h-4" /></div>
            <div>
              <p className="text-[10px] uppercase text-white/40 font-bold tracking-wider">Created Date</p>
              <p className="text-sm text-white">{new Date(user.createdDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
