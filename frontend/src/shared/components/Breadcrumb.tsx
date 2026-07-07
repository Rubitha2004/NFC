import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { generateBreadcrumbs } from "@/shared/utils/route.utils";
import { cn } from "@/lib/utils";

export function Breadcrumb() {
  const { pathname } = useLocation();
  const crumbs = generateBreadcrumbs(pathname);

  if (crumbs.length === 0) return null;

  return (
    <nav aria-label="breadcrumb" className="flex items-center text-sm">
      {/* Home icon */}
      <Link
        to="/dashboard"
        className="text-muted-foreground hover:text-foreground transition-colors flex items-center"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>

      {crumbs.map((crumb, index) => (
        <span key={index} className="flex items-center">
          <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-muted-foreground/50" />
          {crumb.path ? (
            <Link
              to={crumb.path}
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              {crumb.label}
            </Link>
          ) : (
            <span className={cn("font-medium text-foreground")}>
              {crumb.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
