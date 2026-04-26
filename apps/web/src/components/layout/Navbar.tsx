"use client";

import { Search, ShoppingBag, User, Menu } from "lucide-react";
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

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 py-4 md:py-6"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className={`w-full max-w-6xl rounded-full transition-all duration-300 ease-in-out ${isScrolled ? 'glass shadow-lg py-2 px-6' : 'bg-transparent py-2 px-2'}`}>
        <div className="flex items-center justify-between">
          
          {/* Logo & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <button className="md:hidden p-2 text-foreground hover:bg-muted rounded-full transition-colors">
              <Menu size={24} />
            </button>
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl">
                A
              </div>
              <span className={`text-xl font-bold tracking-tight hidden sm:block ${isScrolled ? 'text-foreground' : 'text-primary'}`}>
                ACommerce
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {['Discover', 'Categories', 'Deals', 'New'].map((item) => (
              <Link key={item} href="#" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full transition-all">
                {item}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Search Pill */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <Suspense fallback={<div className="w-full h-10 bg-muted animate-pulse rounded-full" />}>
                <SearchAutocomplete />
              </Suspense>
            </div>
            <button className="md:hidden p-2 text-foreground hover:bg-muted rounded-full transition-colors">
              <Search size={20} />
            </button>

            {/* Auth Actions / Profile */}
            <div className="flex items-center gap-3">
              {!isAuthenticated ? (
                <div className="hidden sm:flex items-center gap-3">
                  <Link 
                    href="/login" 
                    className="px-5 py-2.5 text-sm font-black text-foreground hover:text-brand transition-all rounded-full hover:bg-brand/5"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/register" 
                    className="px-6 py-2.5 text-sm font-black bg-brand text-white rounded-full hover:shadow-[0_8px_20px_-6px_rgba(255,107,0,0.4)] hover:-translate-y-0.5 transition-all active:scale-95"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <Link 
                  href="/account" 
                  className="flex items-center gap-2 p-1.5 pr-4 bg-muted/50 hover:bg-muted rounded-full transition-all border border-border/50 group"
                >
                  <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-brand">
                    <User size={18} strokeWidth={2.5} />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-none mb-0.5">Account</p>
                    <p className="text-sm font-bold text-foreground leading-none">{user?.name.split(' ')[0]}</p>
                  </div>
                </Link>
              )}
            </div>

            {/* Wishlist */}
            <Link href="/wishlists" className="relative p-2.5 text-foreground hover:bg-muted rounded-full transition-all">
              <Heart size={20} strokeWidth={2} />
              {wishlistItemsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-background">
                  {wishlistItemsCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <MiniCartPopover />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
