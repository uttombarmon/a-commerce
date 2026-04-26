"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Shield, Smartphone, Laptop, LogOut, CheckCircle } from "lucide-react";

export default function SecurityPage() {
  const { accessToken } = useAuthStore();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, pass the accessToken in Authorization header
    fetch("/api/auth/sessions", {
      headers: { "Authorization": `Bearer ${accessToken}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSessions(data.sessions);
        }
        setLoading(false);
      });
  }, [accessToken]);

  const handleRevoke = async (id: number) => {
    const res = await fetch(`/api/auth/sessions?id=${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${accessToken}` }
    });
    const data = await res.json();
    if (data.success) {
      setSessions(sessions.filter(s => s.id !== id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-8">Security Dashboard</h1>

      {/* 2FA Section */}
      <div className="bg-white border border-border rounded-2xl p-6 mb-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-brand/10 text-brand rounded-xl">
            <Shield size={24} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">Two-Factor Authentication (2FA)</h2>
            <p className="text-muted-foreground mt-1 mb-4">Add an extra layer of security to your account using an authenticator app like Google Authenticator.</p>
            <button className="px-6 py-2 bg-brand text-white font-bold rounded-lg hover:opacity-90">
              Enable 2FA
            </button>
          </div>
        </div>
      </div>

      {/* Sessions Section */}
      <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Active Sessions</h2>
        <p className="text-muted-foreground text-sm mb-6">These are the devices that have logged into your account. Revoke any sessions that you do not recognize.</p>

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-16 bg-muted rounded-xl" />
            <div className="h-16 bg-muted rounded-xl" />
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session, i) => {
              const isCurrent = i === 0; // Mock current session
              const isMobile = session.userAgent.includes("iPhone") || session.userAgent.includes("Android");

              return (
                <div key={session.id} className="flex items-center justify-between p-4 border border-border rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-muted text-foreground rounded-lg">
                      {isMobile ? <Smartphone size={20} /> : <Laptop size={20} />}
                    </div>
                    <div>
                      <p className="font-bold flex items-center gap-2">
                        {isMobile ? "Mobile Device" : "Desktop Browser"}
                        {isCurrent && <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Current</span>}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {session.ipAddress} • Last active: {new Date(session.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  {!isCurrent && (
                    <button 
                      onClick={() => handleRevoke(session.id)}
                      className="text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-bold"
                    >
                      <LogOut size={16} />
                      Revoke
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
