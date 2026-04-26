"use client";

import { Heart } from "lucide-react";
import { useWishlistStore, WishlistItem } from "@/store/wishlistStore";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WishlistButtonProps {
  item: WishlistItem;
  className?: string;
  iconSize?: number;
}

export function WishlistButton({ item, className = "", iconSize = 24 }: WishlistButtonProps) {
  const { lists, activeListId, toggleItem, isInList } = useWishlistStore();
  const [mounted, setMounted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  // Use the active list or default to the first one
  const targetListId = activeListId || lists[0]?.id;
  const isWished = targetListId ? isInList(targetListId, item.productId, item.variantId) : false;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!targetListId) return;

    // Optimistic UI update via Zustand
    toggleItem(targetListId, item);
    
    // Show temporary feedback tooltip if adding
    if (!isWished) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    }
  };

  return (
    <div className="relative flex items-center justify-center">
      <motion.button
        whileTap={{ scale: 0.8 }}
        onClick={handleClick}
        className={`p-2 rounded-full transition-colors flex items-center justify-center ${
          isWished ? "bg-rose-50 text-rose-500" : "bg-white/80 backdrop-blur-sm text-muted-foreground hover:text-rose-500 hover:bg-rose-50"
        } ${className}`}
        title={isWished ? "Remove from Wishlist" : "Add to Wishlist"}
      >
        <Heart 
          size={iconSize} 
          className={`transition-all duration-300 ${isWished ? "fill-rose-500 text-rose-500" : ""}`} 
        />
      </motion.button>

      {/* Temporary Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg z-50 pointer-events-none"
          >
            Saved to Wishlist
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
