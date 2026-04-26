"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function HeroBento() {
  return (
    <section className="pt-32 pb-8 px-4 md:px-6 max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 h-auto md:h-[600px]">
        
        {/* Main large feature (spans 2 columns) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="md:col-span-2 relative rounded-3xl overflow-hidden bg-muted group cursor-pointer min-h-[400px] md:min-h-0"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
          <Image 
            src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1600&auto=format&fit=crop" 
            alt="Premium Collection" 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 p-8 md:p-12 z-20 w-full">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-semibold tracking-wider mb-4 border border-white/10">
              NEW COLLECTION
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-4 leading-tight">
              The Minimalist <br /> Essentials.
            </h1>
            <button className="flex items-center space-x-2 bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors">
              <span>Shop Now</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>

        <div className="flex flex-col gap-4 md:gap-6 h-full">
          {/* Top right smaller block */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex-1 relative rounded-3xl overflow-hidden bg-brand group cursor-pointer min-h-[200px]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand to-brand-hover opacity-90 z-10" />
            <Image 
              src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=800&auto=format&fit=crop" 
              alt="Watches" 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-110 mix-blend-overlay"
            />
            <div className="absolute inset-0 p-8 z-20 flex flex-col justify-between">
              <div className="bg-white/20 backdrop-blur-md w-12 h-12 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">%</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">Up to 40% off</h3>
                <p className="text-white/80 text-sm">On premium accessories</p>
              </div>
            </div>
          </motion.div>

          {/* Bottom right smaller block */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1 relative rounded-3xl overflow-hidden bg-surface border border-border group cursor-pointer min-h-[200px] p-8 flex flex-col justify-between hover:border-brand/50 transition-colors"
          >
            <div>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Top Rated</span>
              <h3 className="text-xl font-bold text-primary mt-2 leading-tight">Trending items this week</h3>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex -space-x-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`w-12 h-12 rounded-full border-2 border-surface bg-muted z-${10-i} overflow-hidden relative`}>
                     <Image src={`https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200&auto=format&fit=crop&sig=${i}`} alt="Product" fill className="object-cover" />
                  </div>
                ))}
              </div>
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center group-hover:scale-110 transition-transform">
                <ArrowRight size={18} />
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
