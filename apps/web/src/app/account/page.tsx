"use client";

import { useAuthStore } from "@/store/authStore";
import { Package, Shield, Settings, Heart, CreditCard, MapPin, ChevronRight, LogOut } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AccountPage() {
  const { user, logout } = useAuthStore();

  const menuItems = [
    { title: "My Orders", desc: "Track, return or buy things again", icon: <Package size={24} />, href: "/account/orders", color: "text-blue-500" },
    { title: "Security", desc: "Edit login, name, and mobile number", icon: <Shield size={24} />, href: "/account/security", color: "text-emerald-500" },
    { title: "Wishlist", desc: "View and manage your saved items", icon: <Heart size={24} />, href: "/wishlists", color: "text-rose-500" },
    { title: "Payment Methods", desc: "Manage your cards and billing info", icon: <CreditCard size={24} />, href: "/account/payments", color: "text-amber-500" },
    { title: "Addresses", desc: "Edit delivery addresses for orders", icon: <MapPin size={24} />, href: "/account/addresses", color: "text-indigo-500" },
    { title: "Account Settings", desc: "Manage your preferences and notifications", icon: <Settings size={24} />, href: "/account/settings", color: "text-gray-500" },
  ];

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Hello, {user.name.split(' ')[0]}</h1>
          <p className="text-muted-foreground font-medium">Manage your profile, orders, and security settings.</p>
        </div>
        <button 
          onClick={logout}
          className="flex items-center gap-2 px-6 py-3 bg-rose-500/10 text-rose-600 rounded-2xl font-bold hover:bg-rose-500 hover:text-white transition-all group"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          Sign Out
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link 
              href={item.href}
              className="flex items-center gap-5 p-6 bg-white border border-border rounded-[2rem] hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all group"
            >
              <div className={`w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <div className="flex-grow">
                <h3 className="font-black text-lg">{item.title}</h3>
                <p className="text-sm text-muted-foreground font-medium">{item.desc}</p>
              </div>
              <ChevronRight className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 p-8 bg-gradient-to-br from-brand to-indigo-600 rounded-[2.5rem] text-white overflow-hidden relative shadow-2xl shadow-brand/20">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h2 className="text-2xl font-black mb-1">Become a Seller</h2>
            <p className="font-medium opacity-90">Start selling your products to millions of customers today.</p>
          </div>
          <Link 
            href="/seller/register" 
            className="px-8 py-4 bg-white text-brand font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl"
          >
            Open Your Store
          </Link>
        </div>
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/20 blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>
    </div>
  );
}
