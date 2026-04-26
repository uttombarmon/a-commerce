"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { User, Camera, Mail, Phone, MapPin, Globe, Loader2, Save, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "Test User",
    email: user?.email || "test@example.com",
    bio: "Passionate shopper and early adopter of new tech. Always looking for the best deals!",
    phone: "+1 (555) 000-0000",
    location: "San Francisco, CA",
    website: "https://janedoe.me",
    twitter: "@janedoe",
    github: "janedoe",
    linkedin: "janedoe"
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200)); // Simulated API call
    setLoading(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black">My Profile</h2>
        {success && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-emerald-500 font-bold bg-emerald-500/10 px-4 py-2 rounded-full text-sm"
          >
            <CheckCircle2 size={16} />
            Profile updated successfully
          </motion.div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Avatar Section */}
        <section className="bg-white p-8 rounded-[2rem] border border-border flex flex-col md:flex-row items-center gap-8">
          <div className="relative group cursor-pointer">
            <div className="w-32 h-32 rounded-full bg-brand/10 border-4 border-brand/20 flex items-center justify-center text-4xl font-black text-brand overflow-hidden">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="text-white" />
            </div>
          </div>
          <div className="text-center md:text-left space-y-2">
            <h3 className="font-black text-xl">Profile Picture</h3>
            <p className="text-sm text-muted-foreground font-medium">JPG, GIF or PNG. Max size of 2MB.</p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-2">
              <button type="button" className="px-4 py-2 bg-brand text-white text-xs font-black rounded-lg hover:bg-brand/90 transition-colors">Upload New</button>
              <button type="button" className="px-4 py-2 bg-muted text-foreground text-xs font-black rounded-lg hover:bg-muted/80 transition-colors">Remove</button>
            </div>
          </div>
        </section>

        {/* Basic Info Section */}
        <section className="bg-white p-8 rounded-[2rem] border border-border grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full px-5 py-4 bg-muted/30 border border-transparent rounded-2xl focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/5 outline-none transition-all font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input 
                type="email" 
                value={formData.email}
                className="w-full pl-12 pr-4 py-4 bg-muted/10 border border-transparent rounded-2xl text-muted-foreground font-bold cursor-not-allowed"
                disabled
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input 
                type="tel" 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full pl-12 pr-4 py-4 bg-muted/30 border border-transparent rounded-2xl focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/5 outline-none transition-all font-bold"
              />
            </div>
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Bio</label>
            <textarea 
              value={formData.bio}
              onChange={e => setFormData({...formData, bio: e.target.value})}
              rows={3}
              className="w-full px-5 py-4 bg-muted/30 border border-transparent rounded-2xl focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/5 outline-none transition-all font-bold resize-none"
            />
          </div>
        </section>

        {/* Social / Web Section */}
        <section className="bg-white p-8 rounded-[2rem] border border-border grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Location</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input 
                type="text" 
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                className="w-full pl-12 pr-4 py-4 bg-muted/30 border border-transparent rounded-2xl focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/5 outline-none transition-all font-bold"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Website</label>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input 
                type="url" 
                value={formData.website}
                onChange={e => setFormData({...formData, website: e.target.value})}
                className="w-full pl-12 pr-4 py-4 bg-muted/30 border border-transparent rounded-2xl focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/5 outline-none transition-all font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 md:col-span-2">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50">
                <Image src="https://www.svgrepo.com/show/521890/twitter.svg" alt="Twitter" width={18} height={18} className="invert" />
              </div>
              <input type="text" value={formData.twitter} className="w-full pl-12 pr-4 py-3 bg-muted/30 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-brand/20" />
            </div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50">
                <Image src="https://www.svgrepo.com/show/512317/github-142.svg" alt="Github" width={18} height={18} className="invert" />
              </div>
              <input type="text" value={formData.github} className="w-full pl-12 pr-4 py-3 bg-muted/30 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-brand/20" />
            </div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50">
                <Image src="https://www.svgrepo.com/show/521711/linkedin.svg" alt="Linkedin" width={18} height={18} className="invert" />
              </div>
              <input type="text" value={formData.linkedin} className="w-full pl-12 pr-4 py-3 bg-muted/30 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-brand/20" />
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="px-12 py-5 bg-brand text-white font-black rounded-2xl hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center gap-3 transition-all shadow-xl shadow-brand/20"
          >
            {loading ? <Loader2 size={24} className="animate-spin" /> : (
              <>
                <Save size={20} strokeWidth={3} />
                Save Profile
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
