"use client";

import { useCartStore } from "@/store/cartStore";
import { useCheckoutStore } from "@/store/checkoutStore";
import Image from "next/image";

export function OrderSummarySidebar() {
  const items = useCartStore(state => state.items);
  const discountAmount = useCartStore(state => state.discountAmount);
  const couponCode = useCartStore(state => state.couponCode);
  const shippingFee = useCheckoutStore(state => state.shippingFee);
  
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = Math.max(0, subtotal + tax + shippingFee - discountAmount);

  return (
    <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
      <h3 className="font-bold text-lg mb-4">Order Summary</h3>
      
      {/* Items List (Collapsed View) */}
      <div className="max-h-60 overflow-y-auto space-y-4 mb-6 pr-2">
        {items.map(item => (
          <div key={item.id} className="flex gap-4">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0 border border-border">
              <Image src={item.image} alt={item.title} fill className="object-cover" />
              <span className="absolute -top-2 -right-2 bg-muted-foreground text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full z-10 font-bold">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold truncate">{item.title}</h4>
              <p className="text-xs text-muted-foreground">{item.variantName}</p>
            </div>
            <div className="font-bold text-sm">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-4 space-y-3 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        
        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-600 font-bold">
            <span>Discount ({couponCode})</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between text-muted-foreground">
          <span>Shipping</span>
          <span>{shippingFee === 0 ? "Calculated in next step" : `$${shippingFee.toFixed(2)}`}</span>
        </div>
        
        <div className="flex justify-between text-muted-foreground">
          <span>Estimated Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
      </div>

      <div className="border-t border-border mt-4 pt-4 flex justify-between items-center">
        <span className="font-bold text-lg">Total</span>
        <span className="font-bold text-2xl text-brand">${total.toFixed(2)}</span>
      </div>
    </div>
  );
}
