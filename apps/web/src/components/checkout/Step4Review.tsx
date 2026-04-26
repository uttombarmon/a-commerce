"use client";

import { useCheckoutStore } from "@/store/checkoutStore";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Truck, CreditCard, Loader2 } from "lucide-react";

export function Step4Review() {
  const router = useRouter();
  const cartItems = useCartStore(state => state.items);
  const checkoutState = useCheckoutStore();
  const { prevStep, selectedAddress, shippingMethod, paymentMethod, deliveryDate } = checkoutState;
  
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems,
          checkoutState: {
            address: selectedAddress,
            shipping: shippingMethod,
            payment: paymentMethod
          }
        })
      });

      const data = await res.json();

      if (data.success) {
        useCartStore.getState().clearCart();
        checkoutState.resetCheckout();
        router.push(`/checkout/success?orderId=${data.orderNumber}`);
      } else {
        setError(data.error || "Failed to process order");
        setLoading(false);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">Review Your Order</h2>
        <p className="text-muted-foreground text-sm">Please verify your details before placing the order.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Address Summary */}
        <div className="p-4 bg-muted/30 rounded-xl border border-border">
          <div className="flex items-center gap-2 font-bold mb-2 text-brand">
            <MapPin size={18} />
            Shipping To
          </div>
          <p className="font-bold text-sm">{selectedAddress?.fullName}</p>
          <p className="text-xs text-muted-foreground mt-1">{selectedAddress?.street}</p>
          <p className="text-xs text-muted-foreground">{selectedAddress?.city}, {selectedAddress?.state} {selectedAddress?.zip}</p>
        </div>

        {/* Shipping Summary */}
        <div className="p-4 bg-muted/30 rounded-xl border border-border">
          <div className="flex items-center gap-2 font-bold mb-2 text-brand">
            <Truck size={18} />
            Delivery Method
          </div>
          <p className="font-bold text-sm capitalize">{shippingMethod?.replace('_', ' ')}</p>
          {deliveryDate && (
            <p className="text-xs text-muted-foreground mt-1">
              Est. Delivery: {new Date(deliveryDate).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Payment Summary */}
        <div className="p-4 bg-muted/30 rounded-xl border border-border">
          <div className="flex items-center gap-2 font-bold mb-2 text-brand">
            <CreditCard size={18} />
            Payment
          </div>
          <p className="font-bold text-sm uppercase">{paymentMethod?.replace('_', ' ')}</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
        <label className="flex items-start gap-3 cursor-pointer">
          <input 
            type="checkbox" 
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-1 rounded text-brand focus:ring-brand accent-brand w-4 h-4"
          />
          <span className="text-sm text-amber-900 leading-tight">
            I agree to the ACommerce Terms of Service and Privacy Policy. I understand that all sales are final upon placing this order.
          </span>
        </label>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-sm font-bold">
          {error}
        </div>
      )}

      <div className="pt-6 flex justify-between border-t border-border">
        <button 
          onClick={prevStep}
          disabled={loading}
          className="px-8 py-3 text-muted-foreground font-bold hover:text-foreground transition-colors disabled:opacity-50"
        >
          Back
        </button>
        <button 
          onClick={handlePlaceOrder}
          disabled={!termsAccepted || loading}
          className="px-8 py-3 bg-brand text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Processing...
            </>
          ) : (
            "Place Order"
          )}
        </button>
      </div>
    </div>
  );
}
