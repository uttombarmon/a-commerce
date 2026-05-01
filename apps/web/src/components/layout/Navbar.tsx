"use client";

import { Search, ShoppingBag, User, Menu, LogOut } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useWishlistStore } from "@/store/wishlistStore";
import { SearchAutocomplete } from "@/components/search/SearchAutocomplete";
import { MiniCartPopover } from "@/components/cart/MiniCartPopover";
import { Heart } from "lucide-react";

import { useAuthStore } from "@/store/authStore";

export function Navbar() {
  const { itemCount } = useCart();
  const wishlistItemsCount = useWishlistStore(state => state.lists.reduce((acc, list) => acc + list.items.length, 0));
  const { isAuthenticated, user, logout } = useAuthStore();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 py-4 md:py-6 pointer-events-none"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className={`w-full max-w-7xl rounded-[32px] transition-all duration-500 ease-in-out pointer-events-auto ${isScrolled ? 'glass shadow-2xl py-3 px-8 translate-y-[-4px]' : 'bg-transparent py-4 px-4'}`}>
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Mobile Menu */}
          <div className="flex items-center space-x-6">
            <button className="md:hidden p-3 text-foreground hover:bg-muted rounded-2xl transition-colors">
              <Menu size={24} />
            </button>
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center font-black text-2xl group-hover:scale-110 transition-transform shadow-lg">
                A
              </div>
              <span className={`text-2xl font-black tracking-tighter hidden sm:block ${isScrolled ? 'text-foreground' : 'text-primary'}`}>
                ACommerce
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {['Discover', 'Categories', 'Deals', 'New'].map((item) => (
              <Link key={item} href="#" className="px-5 py-2.5 text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-muted rounded-2xl transition-all">
                {item}
              </Link>
            ))}
          </nav>

          {/* Global Search */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <Suspense fallback={<div className="w-full h-12 bg-muted animate-pulse rounded-full" />}>
              <SearchAutocomplete />
            </Suspense>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            <button className="md:hidden p-3 text-foreground hover:bg-muted rounded-2xl transition-colors">
              <Search size={20} />
            </button>

            {/* Auth Actions / Profile */}
            <div className="flex items-center">
              {!isAuthenticated ? (
                <div className="hidden sm:flex items-center gap-2">
                  <Link 
                    href="/login" 
                    className="px-6 py-3 text-sm font-black text-foreground hover:text-brand transition-all rounded-2xl hover:bg-brand/5"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/register" 
                    className="px-8 py-3 text-sm font-black bg-brand text-white rounded-2xl hover:shadow-[0_10px_25px_-5px_rgba(79,70,229,0.4)] hover:-translate-y-1 transition-all active:scale-95 shadow-md"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link 
                    href="/account" 
                    className="flex items-center gap-3 p-1.5 pr-5 bg-muted/50 hover:bg-muted rounded-2xl transition-all border border-border/50 group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-brand text-white flex items-center justify-center shadow-inner">
                      <User size={20} strokeWidth={2.5} />
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-none mb-1">My Account</p>
                      <p className="text-sm font-black text-foreground leading-none">{user?.name.split(' ')[0]}</p>
                    </div>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="p-3 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all group"
                    title="Logout"
                  >
                    <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
                  </button>
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Link href="/wishlists" className="relative p-3 text-foreground hover:bg-muted rounded-2xl transition-all group">
              <Heart size={22} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
              {wishlistItemsCount > 0 && (
                <span className="absolute top-2 right-2 bg-rose-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-background animate-in zoom-in">
                  {wishlistItemsCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <div className="group">
              <MiniCartPopover />
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
