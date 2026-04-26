"use client";

import Link from "next/link";
import { ArrowRight, Globe, Mail, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-surface border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        
        {/* Newsletter Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 pb-16 border-b border-border gap-8">
          <div className="max-w-md">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Join our newsletter</h2>
            <p className="text-muted-foreground">Stay updated on new releases and features, drop in your email.</p>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-muted border border-border rounded-full px-6 py-3 outline-none focus:ring-2 focus:ring-brand flex-grow md:w-64"
            />
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 py-3 font-medium transition-colors flex items-center">
              Subscribe <ArrowRight size={16} className="ml-2" />
            </button>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                A
              </div>
              <span className="text-xl font-bold tracking-tight text-primary">ACommerce</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs mb-6">
              The ultimate marketplace for the modern era. Curated products, seamless experience, and exceptional quality.
            </p>
            <div className="flex space-x-4 text-muted-foreground">
              <button className="hover:text-primary transition-colors"><Globe size={20} /></button>
              <button className="hover:text-primary transition-colors"><Mail size={20} /></button>
              <button className="hover:text-primary transition-colors"><MessageCircle size={20} /></button>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <h3 className="font-semibold text-primary mb-2">Shop</h3>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">All Products</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Categories</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">New Arrivals</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Featured</Link>
          </div>

          <div className="flex flex-col space-y-3">
            <h3 className="font-semibold text-primary mb-2">Company</h3>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Careers</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Press</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link>
          </div>

          <div className="flex flex-col space-y-3">
            <h3 className="font-semibold text-primary mb-2">Legal</h3>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Return Policy</Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© 2026 ACommerce Inc. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <span>🇺🇸 United States</span>
            <span>English (US)</span>
            <span>$ USD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
