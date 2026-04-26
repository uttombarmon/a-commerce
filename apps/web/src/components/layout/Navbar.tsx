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
            <div className="flex items-center gap-2">
              {!isAuthenticated ? (
                <div className="hidden sm:flex items-center gap-2">
                  <Link 
                    href="/login" 
                    className="px-4 py-2 text-sm font-bold hover:text-brand transition-colors"
                  >
                    Log In
                  </Link>
                  <Link 
                    href="/register" 
                    className="px-4 py-2 text-sm font-bold bg-brand text-white rounded-full hover:opacity-90 transition-all shadow-sm"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <Link 
                  href="/account" 
                  className="p-2 text-foreground hover:bg-muted rounded-full transition-colors relative group"
                  aria-label="Account"
                >
                  <User size={20} />
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Hi, {user?.name.split(' ')[0]}
                  </span>
                </Link>
              )}
            </div>

            {/* Wishlist */}
            <Link href="/wishlists" className="relative p-2 text-foreground hover:bg-muted rounded-full transition-colors hidden sm:flex items-center justify-center">
              <Heart size={20} />
              {wishlistItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-surface">
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
