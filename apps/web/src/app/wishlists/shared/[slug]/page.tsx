"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import { Heart, ShoppingCart, Share2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cartStore";

export default function SharedWishlistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [mounted, setMounted] = useState(false);
  const addToCart = useCartStore(state => state.addItem);
  const toggleCart = useCartStore(state => state.toggleCart);

  // Mock data for a shared list (in a real app, fetch from DB via slug)
  const [listData, setListData] = useState({
    name: "Summer Essentials",
    owner: "Jane Doe",
    items: [
      { productId: 201, title: "Echo Dot (5th Gen) Smart Speaker", price: 49.99, image: "https://images.unsplash.com/photo-1543512214-318c7553f230?q=80&w=400" },
      { productId: 202, title: "Kindle Paperwhite (8 GB)", price: 139.99, image: "https://images.unsplash.com/photo-1592496001020-d3124286f52e?q=80&w=400" },
      { productId: 205, title: "Ring Video Doorbell", price: 99.99, image: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=400" },
    ]
  });

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const handleAddAllToCart = () => {
    listData.items.forEach(item => {
      addToCart({
        productId: item.productId,
        quantity: 1,
        title: item.title,
        image: item.image,
        price: item.price,
        maxStock: 100
      });
    });
    toggleCart(true);
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-brand font-bold mb-8 transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Store
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[3rem] border border-border shadow-xl shadow-black/5 overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 md:p-12 bg-gradient-to-br from-brand/5 to-transparent border-b border-border flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 text-brand font-black uppercase tracking-[0.2em] text-xs mb-3">
                <Share2 size={14} />
                Shared Wishlist
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">{listData.name}</h1>
              <p className="text-muted-foreground font-medium">Curated by <span className="text-foreground font-bold">{listData.owner}</span></p>
            </div>
            
            <button 
              onClick={handleAddAllToCart}
              className="px-8 py-4 bg-brand text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand/20 flex items-center gap-3"
            >
              <ShoppingCart size={20} />
              Add All to Cart
            </button>
          </div>

          {/* Grid */}
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {listData.items.map((item, index) => (
                <motion.div 
                  key={item.productId}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="relative aspect-square rounded-[2rem] overflow-hidden border border-border bg-muted mb-4">
                    <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </div>
                  <h3 className="font-bold text-lg mb-1 line-clamp-2">{item.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xl text-brand">${item.price.toFixed(2)}</span>
                    <button 
                      onClick={() => {
                        addToCart({...item, quantity: 1, maxStock: 100});
                        toggleCart(true);
                      }}
                      className="p-3 bg-muted rounded-xl hover:bg-brand hover:text-white transition-all"
                    >
                      <ShoppingCart size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="p-8 bg-muted/30 border-t border-border text-center">
            <p className="text-sm text-muted-foreground font-medium flex items-center justify-center gap-2">
              Want to create your own wishlist? <Link href="/register" className="text-brand font-black hover:underline">Join ACommerce today</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
