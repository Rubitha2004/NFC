import type { AppUser } from "../../types/user.types";
import { Check, X } from "lucide-react";

export function UserPermissionsTab({ user }: { user: AppUser }) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Access Control Matrix</h3>
          <p className="text-xs text-white/50 mt-1">Granular CRUD permissions inherited from role: <span className="text-blue-400">{user.role}</span></p>
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-zinc-900 border-b border-white/5">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">Module</th>
              <th className="px-4 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider text-center">Create</th>
              <th className="px-4 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider text-center">Read</th>
              <th className="px-4 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider text-center">Update</th>
              <th className="px-4 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider text-center">Delete</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {user.permissions.map((perm) => (
              <tr key={perm.module} className="hover:bg-white/[0.02]">
                <td className="px-4 py-3 text-sm font-medium text-white">{perm.module}</td>
                <td className="px-4 py-3 text-center">
                  {perm.create ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-white/20 mx-auto" />}
                </td>
                <td className="px-4 py-3 text-center">
                  {perm.read ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-white/20 mx-auto" />}
                </td>
                <td className="px-4 py-3 text-center">
                  {perm.update ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-white/20 mx-auto" />}
                </td>
                <td className="px-4 py-3 text-center">
                  {perm.delete ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-white/20 mx-auto" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {user.permissions.length === 0 && (
        <div className="p-8 text-center text-white/40 text-sm">
          No explicit permissions defined for this role.
        </div>
      )}
    </div>
  );
}
