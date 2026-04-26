"use client";

import { useEffect, useState } from "react";
import { X, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { CartItemRow } from "./CartItemRow";
import { OrderSummary } from "./OrderSummary";

export function CartDrawer() {
  const isOpen = useCartStore(state => state.isOpen);
  const toggleCart = useCartStore(state => state.toggleCart);
  const items = useCartStore(state => state.items);
  const clearCart = useCartStore(state => state.clearCart);

  // Prevent hydration mismatch for Zustand persist
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => toggleCart(false)}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transition-transform duration-300 ease-in-out transform flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-2 font-bold text-xl">
            <ShoppingBag />
            <h2>Your Cart</h2>
            <span className="bg-brand text-white text-xs px-2 py-1 rounded-full ml-2">
              {items.reduce((a, b) => a + b.quantity, 0)}
            </span>
          </div>
          <button 
            onClick={() => toggleCart(false)}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
              <ShoppingBag size={64} className="text-muted-foreground" />
              <p className="text-lg font-bold">Your cart is empty</p>
              <button 
                onClick={() => toggleCart(false)}
                className="flex items-center gap-2 text-brand font-bold hover:underline"
              >
                Continue Shopping <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-end mb-4">
                <button onClick={clearCart} className="text-sm font-bold text-muted-foreground hover:text-rose-500 transition-colors">
                  Clear Cart
                </button>
              </div>
              {items.map(item => (
                <CartItemRow key={item.id} item={item} />
              ))}
              
              <div className="mt-8">
                <OrderSummary />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
