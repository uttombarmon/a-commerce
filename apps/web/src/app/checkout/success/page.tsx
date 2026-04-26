"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, Truck, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Trigger confetti animation on mount
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="max-w-3xl mx-auto text-center py-12 px-6">
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
          <CheckCircle className="text-emerald-500 w-12 h-12" />
        </div>
      </div>

      <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Thank you for your purchase. We've received your order and are getting it ready to ship.
      </p>

      <div className="bg-white rounded-2xl p-8 border border-border shadow-sm max-w-xl mx-auto mb-12 text-left">
        <div className="flex items-center justify-between border-b border-border pb-6 mb-6">
          <div>
            <p className="text-sm text-muted-foreground">Order Number</p>
            <p className="font-bold text-xl">{orderId || "ORD-XXXXXX-XXX"}</p>
          </div>
          <div className="bg-brand/10 text-brand px-4 py-2 rounded-full font-bold text-sm">
            Processing
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="bg-muted p-3 rounded-full shrink-0">
              <Package className="text-foreground" size={24} />
            </div>
            <div>
              <h4 className="font-bold">Order Details Sent</h4>
              <p className="text-sm text-muted-foreground">A confirmation email has been sent to your registered email address.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-muted p-3 rounded-full shrink-0">
              <Truck className="text-foreground" size={24} />
            </div>
            <div>
              <h4 className="font-bold">Track Your Delivery</h4>
              <p className="text-sm text-muted-foreground">You will receive shipping updates via SMS and email once your package is dispatched.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link 
          href="/account/orders" 
          className="px-8 py-4 border border-border rounded-xl font-bold hover:bg-muted transition-colors w-full sm:w-auto"
        >
          View Order Status
        </Link>
        <Link 
          href="/" 
          className="px-8 py-4 bg-brand text-white rounded-xl font-bold hover:opacity-90 flex items-center justify-center gap-2 transition-all w-full sm:w-auto"
        >
          Continue Shopping
          <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
}
