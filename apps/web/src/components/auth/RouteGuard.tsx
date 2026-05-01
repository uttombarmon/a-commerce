"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

interface RouteGuardProps {
  children: React.ReactNode;
  /** Roles allowed to view this page. Leave empty to allow any authenticated user. */
  allowedRoles?: string[];
  /** Where to redirect unauthenticated users. Defaults to /login */
  redirectTo?: string;
}

/** Returns the correct home dashboard for a given role */
function roleDashboard(role: string | undefined | null): string {
  if (role === "admin") return "/admin";
  if (role === "seller") return "/seller";
  return "/account";
}

export function RouteGuard({
  children,
  allowedRoles = [],
  redirectTo = "/login",
}: RouteGuardProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  const hasCorrectRole =
    allowedRoles.length === 0 || (!!user && allowedRoles.includes(user.role));

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(redirectTo);
      return;
    }

    // Logged in but wrong role → send them to their own dashboard
    if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
      router.replace(roleDashboard(user.role));
    }
  }, [isAuthenticated, user, allowedRoles, redirectTo, router]);

  // Prevent flash: render nothing until auth is confirmed and role matches
  if (!isAuthenticated || !hasCorrectRole) return null;

  return <>{children}</>;
}
