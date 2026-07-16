import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "./Breadcrumb";
import { SearchBar } from "./SearchBar";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { NotificationBell } from "./NotificationPanel";
import { ProfileDropdown } from "./ProfileDropdown";
import { useSidebarStore } from "@/store/sidebar.store";
import { getCurrentDate, getCurrentTime } from "@/shared/utils/date.utils";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface TopNavbarProps {
  sidebarWidth: number;
}

export function TopNavbar({ sidebarWidth }: TopNavbarProps) {
  const { toggleMobile } = useSidebarStore();
  const isMobile = useIsMobile();
  const [time, setTime] = useState(getCurrentTime());
  const date = getCurrentDate();

  // Live clock
  useEffect(() => {
    const interval = setInterval(() => setTime(getCurrentTime()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.header
      animate={{ paddingLeft: isMobile ? 0 : sidebarWidth }}
      transition={{ type: "spring", damping: 28, stiffness: 300 }}
      className="fixed top-0 right-0 left-0 z-20 h-14 bg-background/80 backdrop-blur-md border-b flex items-center pr-4"
    >
      <div className="flex items-center gap-3 w-full">
        {/* Mobile hamburger */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-9 w-9 ml-3"
          onClick={toggleMobile}
        >
          <Menu className="h-4 w-4" />
        </Button>

        {/* Breadcrumb */}
        <div className="hidden md:flex items-center min-w-0 flex-1 pl-2">
          <Breadcrumb />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 ml-auto shrink-0">
          {/* Search */}
          <SearchBar className="hidden md:flex w-52 xl:w-72" />

          {/* Date & Time */}
          <div className={cn(
            "hidden xl:flex flex-col items-end leading-none",
            "px-3 py-1.5 rounded-lg bg-muted/50 border text-xs"
          )}>
            <span className="font-mono font-semibold text-foreground">{time}</span>
            <span className="text-muted-foreground">{date}</span>
          </div>

          {/* Live status */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-muted-foreground px-2 py-1 rounded-lg bg-muted/50 border">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="font-medium">Shift A</span>
          </div>

          <ThemeSwitcher />
          <NotificationBell />
          <ProfileDropdown />
        </div>
      </div>
    </motion.header>
  );
}
