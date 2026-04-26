"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Package, Shield, MapPin, CreditCard, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const NAV_LINKS = [
  { href: "/account/profile", label: "My Profile", icon: User },
  { href: "/account/orders", label: "Order History", icon: Package },
  { href: "/account/security", label: "Security & Login", icon: Shield },
  { href: "/account/addresses", label: "Saved Addresses", icon: MapPin },
  { href: "/account/payment", label: "Payment Methods", icon: CreditCard },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const userInitial = user?.name?.charAt(0) || "U";
  const userName = user?.name || "User";

  return (
    <div className="bg-muted/30 min-h-screen pb-12">
      {/* Account Header */}
      <div className="bg-brand text-white py-12 px-6">
        <div className="max-w-6xl mx-auto flex items-center gap-6">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold border-4 border-white/10 backdrop-blur-sm">
            {userInitial}
          </div>
          <div>
            <h1 className="text-3xl font-bold">Hello, {userName}</h1>
            <p className="text-brand-100 opacity-80">Manage your profile and orders</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 shrink-0 space-y-2">
          {NAV_LINKS.map(link => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                  isActive 
                    ? "bg-white text-brand shadow-sm" 
                    : "text-muted-foreground hover:bg-white hover:text-foreground"
                }`}
              >
                <Icon size={20} className={isActive ? "text-brand" : ""} />
                {link.label}
              </Link>
            );
          })}
          
          <button 
            onClick={() => {
              logout();
              window.location.href = "/login";
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-rose-500 hover:bg-rose-50 transition-colors mt-4"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
