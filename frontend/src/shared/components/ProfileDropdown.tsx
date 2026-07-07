import { useNavigate } from "react-router-dom";
import { User, Settings, Lock, LogOut, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";

export function ProfileDropdown() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={
        <Button variant="ghost" className="h-9 gap-2 px-2 rounded-lg">
          {/* Avatar */}
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.charAt(0) ?? "A"}
          </div>
          <div className="hidden md:flex flex-col items-start leading-none">
            <span className="text-sm font-medium">{user?.name ?? "Admin"}</span>
            <span className="text-[10px] text-muted-foreground capitalize">{user?.role ?? "admin"}</span>
          </div>
          <ChevronDown className="hidden md:block h-3 w-3 text-muted-foreground" />
        </Button>
      } />
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5 mb-1">
          <p className="text-sm font-medium">{user?.name ?? "Admin User"}</p>
          <p className="text-xs text-muted-foreground">{user?.email ?? "admin@factory.com"}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2" onClick={() => navigate("/settings")}>
          <User className="h-4 w-4" /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2" onClick={() => navigate("/settings")}>
          <Settings className="h-4 w-4" /> Settings
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2">
          <Lock className="h-4 w-4" /> Change Password
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive" onClick={handleLogout}>
          <LogOut className="h-4 w-4" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
