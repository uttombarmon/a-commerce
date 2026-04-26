"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { User, Mail, Lock, Phone, ShieldCheck, Bell, Smartphone, ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SecurityPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "Test User",
    email: user?.email || "test@example.com",
    phone: "+1 (555) 000-0000",
    twoFactor: false
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock save delay
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <Link 
        href="/account" 
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-bold mb-8 transition-colors group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to Account
      </Link>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Left: Navigation / Info */}
        <div className="md:w-1/3">
          <div className="sticky top-32">
            <h1 className="text-3xl font-black mb-2">My Profile</h1>
            <p className="text-muted-foreground font-medium mb-8">Manage your personal information and account security settings.</p>
            
            <div className="space-y-2">
              {['Personal Info', 'Password', '2FA Authentication', 'Sessions'].map((item) => (
                <button 
                  key={item}
                  className={`w-full text-left px-6 py-3 rounded-2xl font-bold transition-all ${item === 'Personal Info' ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'hover:bg-muted text-muted-foreground'}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="flex-grow">
          <form onSubmit={handleSave} className="space-y-8">
            <section className="glass-card p-8 rounded-[2.5rem] border border-border bg-white shadow-sm">
              <h2 className="text-xl font-black mb-6 flex items-center gap-3">
                <User className="text-brand" />
                Personal Information
              </h2>
              
              <div className="grid gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-brand transition-colors" size={18} />
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-muted/30 border border-transparent rounded-2xl focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/5 outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-brand transition-colors" size={18} />
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-muted/30 border border-transparent rounded-2xl focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/5 outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Phone Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-brand transition-colors" size={18} />
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-muted/30 border border-transparent rounded-2xl focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/5 outline-none transition-all font-medium"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="glass-card p-8 rounded-[2.5rem] border border-border bg-white shadow-sm">
              <h2 className="text-xl font-black mb-6 flex items-center gap-3">
                <ShieldCheck className="text-emerald-500" />
                Two-Factor Authentication
              </h2>
              
              <div className="flex items-center justify-between p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                    <Smartphone size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Authenticator App</h3>
                    <p className="text-xs text-muted-foreground font-medium">Use an app like Google Authenticator</p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, twoFactor: !formData.twoFactor})}
                  className={`w-12 h-6 rounded-full transition-colors relative ${formData.twoFactor ? 'bg-emerald-500' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.twoFactor ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            </section>

            <div className="flex items-center justify-between gap-4">
              {success && (
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-emerald-600 font-bold flex items-center gap-2"
                >
                  <ShieldCheck size={18} />
                  Changes saved successfully!
                </motion.p>
              )}
              <div className="flex-grow" />
              <button 
                type="submit" 
                disabled={loading}
                className="px-10 py-4 bg-brand text-white font-black rounded-2xl hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center gap-3 transition-all shadow-xl shadow-brand/20"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : (
                  <>
                    <Save size={18} strokeWidth={3} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
