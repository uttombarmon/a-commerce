"use client";

import { Search, ShoppingBag, User, Menu } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

export function Navbar() {
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
            <div className="hidden md:flex items-center bg-muted/50 hover:bg-muted border border-border rounded-full px-4 py-1.5 transition-colors group focus-within:ring-2 focus-within:ring-brand focus-within:bg-surface">
              <Search size={16} className="text-muted-foreground group-focus-within:text-brand" />
              <input
                type="text"
                placeholder="Search products..."
                className="bg-transparent border-none outline-none text-sm w-48 ml-2 text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <button className="md:hidden p-2 text-foreground hover:bg-muted rounded-full transition-colors">
              <Search size={20} />
            </button>

            {/* Account */}
            <button className="p-2 text-foreground hover:bg-muted rounded-full transition-colors hidden sm:block">
              <User size={20} />
            </button>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-foreground hover:bg-muted rounded-full transition-colors flex items-center justify-center bg-primary text-primary-foreground">
              <ShoppingBag size={20} />
              <span className="absolute -top-1 -right-1 bg-brand text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-surface">
                0
              </span>
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
