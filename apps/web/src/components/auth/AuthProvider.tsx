"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { login, logout, setAccessToken } = useAuthStore();
  const [isRefreshing, setIsRefreshing] = useState(true);

  useEffect(() => {
    const refreshSession = async () => {
      try {
        const res = await fetch("/api/auth/refresh", { method: "POST" });
        const data = await res.json();

        if (data.success) {
          // Now fetch user data with the new access token
          const userRes = await fetch("/api/auth/me", {
            headers: { Authorization: `Bearer ${data.accessToken}` }
          });
          const userData = await userRes.json();

          if (userData.success) {
            login(userData.user, data.accessToken);
          } else {
            logout();
          }
        } else {
          // No valid refresh token cookie
          logout();
        }
      } catch (error) {
        console.error("Auth Refresh Failed:", error);
        logout();
      } finally {
        setIsRefreshing(false);
      }
    };

    refreshSession();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Optionally show a global loader while checking session
  if (isRefreshing) {
    return (
      <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-bold text-brand animate-pulse">Restoring Session...</p>
      </div>
    );
  }

  return <>{children}</>;
}
