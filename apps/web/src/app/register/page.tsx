"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Mail, Lock, Loader2, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 py-12 px-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-border p-8 text-center">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Check your email</h2>
          <p className="text-muted-foreground mb-6">
            We've sent a verification link to <span className="font-bold text-foreground">{formData.email}</span>. Please verify your email to continue.
          </p>
          <Link href="/login" className="text-brand font-bold hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 py-12 px-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-border p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-brand text-white rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-4">
            A
          </div>
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-muted-foreground">Join ACommerce today</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-sm font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-muted-foreground" size={20} />
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-muted-foreground" size={20} />
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-muted-foreground" size={20} />
              <input 
                type="password" 
                required
                minLength={8}
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all"
                placeholder="Min. 8 characters"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-brand text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-all mt-6"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : "Create Account"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account? <Link href="/login" className="text-brand font-bold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
