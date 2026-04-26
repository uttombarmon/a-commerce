"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "../ui/ProductCard";
import type { Product } from "@/types/product";
import { Zap } from "lucide-react";
import { motion } from "framer-motion";

// Mock data
const flashProducts: (Product & { soldPercentage: number })[] = [
  { id: 101, title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones", price: 199.99, comparePrice: 299.99, rating: 4.8, reviews: 12450, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop", sellerName: "Sony Official", soldCount: 8500, freeShipping: true, soldPercentage: 85 },
  { id: 102, title: "Apple Watch Series 9 — GPS, 41mm Midnight Aluminium", price: 249.50, comparePrice: 399.00, rating: 4.5, reviews: 8930, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop", sellerName: "Apple Store", soldCount: 5300, freeShipping: true, soldPercentage: 60 },
  { id: 103, title: "Samsung 55-inch Crystal UHD 4K Smart TV 2024 Model", price: 349.00, comparePrice: 499.00, rating: 4.2, reviews: 4500, image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=400&auto=format&fit=crop", sellerName: "Samsung", soldCount: 2900, freeShipping: true, soldPercentage: 92 },
  { id: 104, title: "JBL Charge 5 Portable Bluetooth Speaker — Waterproof", price: 39.99, comparePrice: 79.99, rating: 4.6, reviews: 2100, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=400&auto=format&fit=crop", sellerName: "JBL Audio", soldCount: 1200, freeShipping: false, soldPercentage: 45 },
];

export function FlashSale() {
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 45, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (time: number) => time.toString().padStart(2, '0');

  return (
    <section className="py-12 px-4 md:px-6 max-w-7xl mx-auto w-full my-8">
      <div className="bg-zinc-950 dark:bg-zinc-900 rounded-[2rem] p-6 md:p-10 text-white relative overflow-hidden shadow-2xl">
        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand/30 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] pointer-events-none translate-y-1/3 -translate-x-1/3" />
        
        <div className="relative z-10 flex flex-col lg:flex-row gap-10">
          
          {/* Left Sticky Content */}
          <div className="lg:w-1/3 flex flex-col justify-center">
            <div className="flex items-center space-x-2 mb-4">
              <Zap size={24} className="text-yellow-400 fill-yellow-400" />
              <span className="text-yellow-400 font-bold tracking-wider text-sm uppercase">Flash Sale</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Hurry, offers end soon.</h2>
            
            <div className="flex items-center space-x-3 mb-8">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 w-16 h-16 flex flex-col items-center justify-center border border-white/10 shadow-lg">
                <span className="text-2xl font-bold">{formatTime(timeLeft.hours)}</span>
                <span className="text-[10px] uppercase tracking-wider text-white/60">Hrs</span>
              </div>
              <span className="text-2xl font-bold text-white/50">:</span>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 w-16 h-16 flex flex-col items-center justify-center border border-white/10 shadow-lg">
                <span className="text-2xl font-bold">{formatTime(timeLeft.minutes)}</span>
                <span className="text-[10px] uppercase tracking-wider text-white/60">Min</span>
              </div>
              <span className="text-2xl font-bold text-white/50">:</span>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 w-16 h-16 flex flex-col items-center justify-center border border-white/10 shadow-lg">
                <span className="text-2xl font-bold">{formatTime(timeLeft.seconds)}</span>
                <span className="text-[10px] uppercase tracking-wider text-white/60">Sec</span>
              </div>
            </div>
            
            <button className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors w-max">
              Shop All Deals
            </button>
          </div>

          {/* Right Scrollable Products */}
          <div className="lg:w-2/3 flex overflow-x-auto space-x-4 pb-6 no-scrollbar snap-x">
            {flashProducts.map((product) => (
              <motion.div 
                key={product.id} 
                className="min-w-[280px] w-[280px] snap-start shrink-0"
                whileHover={{ y: -5 }}
              >
                <div className="bg-white dark:bg-zinc-950 rounded-2xl p-4 shadow-xl border border-white/10 h-full flex flex-col">
                  {/* Reuse ProductCard but override text for dark mode compatibility if needed, or ProductCard handles it */}
                  <div className="flex-1">
                     <ProductCard {...product} />
                  </div>
                  
                  {/* Stock Progress Bar */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex justify-between text-xs text-muted-foreground mb-2">
                      <span>{product.soldPercentage}% Claimed</span>
                      {product.soldPercentage > 90 && <span className="text-red-500 font-bold">Almost gone!</span>}
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)] ${product.soldPercentage > 90 ? 'bg-red-500' : 'bg-brand'}`} 
                        style={{ width: `${product.soldPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
