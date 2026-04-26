"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { Tag, X } from "lucide-react";

export function OrderSummary() {
  const items = useCartStore(state => state.items);
  const couponCode = useCartStore(state => state.couponCode);
  const discountAmount = useCartStore(state => state.discountAmount);
  const applyCoupon = useCartStore(state => state.applyCoupon);
  const removeCoupon = useCartStore(state => state.removeCoupon);

  const [inputCode, setInputCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.08; // 8% mock tax
  const shipping = subtotal > 100 ? 0 : 15; // Free shipping over $100
  const total = Math.max(0, subtotal + tax + shipping - discountAmount);

  const handleApply = async () => {
    if (!inputCode.trim()) return;
    setLoading(true);
    setError("");
    const res = await applyCoupon(inputCode);
    if (!res.success) {
      setError(res.message || "Invalid coupon");
    } else {
      setInputCode("");
    }
    setLoading(false);
  };

  return (
    <div className="bg-muted/30 rounded-2xl p-6 border border-border">
      <h3 className="font-bold text-lg mb-4">Order Summary</h3>
      
      <div className="space-y-3 text-sm mb-6">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal ({items.reduce((a, b) => a + b.quantity, 0)} items)</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Estimated Tax (8%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Shipping</span>
          <span>{shipping === 0 ? <span className="text-emerald-600 font-bold">Free</span> : `$${shipping.toFixed(2)}`}</span>
        </div>
        
        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-600 font-bold">
            <span>Discount ({couponCode})</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center border-t border-border pt-4 mb-6">
        <span className="font-bold text-lg">Total</span>
        <span className="font-bold text-2xl text-brand">${total.toFixed(2)}</span>
      </div>

      {/* Coupon Input */}
      <div className="mb-6">
        {couponCode ? (
          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <Tag size={16} />
              {couponCode} Applied
            </div>
            <button onClick={removeCoupon} className="text-emerald-800 hover:text-emerald-900">
              <X size={16} />
            </button>
          </div>
        ) : (
          <div>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Promo code" 
                className="flex-1 p-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                value={inputCode}
                onChange={e => setInputCode(e.target.value)}
              />
              <button 
                onClick={handleApply}
                disabled={loading || !inputCode.trim()}
                className="px-4 bg-black text-white font-bold text-sm rounded-xl hover:opacity-90 disabled:opacity-50"
              >
                Apply
              </button>
            </div>
            {error && <p className="text-rose-500 text-xs mt-2">{error}</p>}
          </div>
        )}
      </div>

      <button className="w-full py-4 bg-brand text-white font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all">
        Proceed to Checkout
      </button>
    </div>
  );
}
