"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Mail, Lock, Loader2 } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore(state => state.login);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data.success) {
        login(data.user, data.accessToken);
        router.push("/"); // Redirect to home or intended page
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider: string) => {
    // In a real app: window.location.href = `/api/auth/${provider}`;
    alert(`${provider} login mock flow initiated.`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 py-12 px-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-border p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-brand text-white rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-4">
            A
          </div>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground">Sign in to your ACommerce account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-sm font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-muted-foreground" size={20} />
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-bold">Password</label>
              <Link href="/forgot-password" className="text-sm text-brand font-bold hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-muted-foreground" size={20} />
              <input 
                type="password" 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-brand text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : "Sign In"}
          </button>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button onClick={() => handleOAuth("google")} className="flex items-center justify-center gap-2 w-full py-2.5 border border-border rounded-xl hover:bg-muted font-bold transition-colors">
              <Image src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={20} height={20} />
              Google
            </button>
            <button onClick={() => handleOAuth("facebook")} className="flex items-center justify-center gap-2 w-full py-2.5 border border-border rounded-xl hover:bg-muted font-bold transition-colors">
              <Image src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" width={20} height={20} />
              Facebook
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Don't have an account? <Link href="/register" className="text-brand font-bold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
