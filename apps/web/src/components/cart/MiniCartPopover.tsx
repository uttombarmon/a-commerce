"use client";

import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";

export function MiniCartPopover() {
  const items = useCartStore(state => state.items);
  const toggleCart = useCartStore(state => state.toggleCart);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const totalItems = mounted ? items.reduce((a, b) => a + b.quantity, 0) : 0;
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="relative group">
      {/* Icon trigger */}
      <button 
        onClick={() => toggleCart(true)}
        className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ShoppingCart size={24} />
        {totalItems > 0 && (
          <span className="absolute top-0 right-0 bg-brand text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center translate-x-1 -translate-y-1">
            {totalItems}
          </span>
        )}
      </button>

      {/* Popover */}
      {mounted && totalItems > 0 && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-border shadow-2xl rounded-2xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 transform origin-top-right scale-95 group-hover:scale-100">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-bold">Recent Items</h4>
            <span className="text-sm text-muted-foreground">{totalItems} items</span>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-3 mb-4">
            {items.slice(0, 3).map(item => (
              <div key={item.id} className="flex gap-3">
                <div className="relative w-12 h-12 rounded bg-muted shrink-0 overflow-hidden">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <div className="font-bold text-sm text-brand">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
            {items.length > 3 && (
              <p className="text-xs text-center text-muted-foreground pt-2">
                +{items.length - 3} more items
              </p>
            )}
          </div>

          <div className="border-t border-border pt-3 mb-3 flex justify-between items-center">
            <span className="font-bold">Subtotal</span>
            <span className="font-bold text-lg text-brand">${subtotal.toFixed(2)}</span>
          </div>

          <button 
            onClick={() => toggleCart(true)}
            className="w-full py-2 bg-brand text-white font-bold text-sm rounded-xl hover:opacity-90 transition-opacity"
          >
            View Cart
          </button>
        </div>
      )}
    </div>
  );
}
