import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";

// Redirects to login if not authenticated
export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

// Redirects to dashboard if already authenticated
export function GuestRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? (
    <Navigate to="/planning/center" replace />
  ) : (
    <Outlet />
  );
}