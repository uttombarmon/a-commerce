"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Truck, MapPin, CreditCard, Download, RotateCcw } from "lucide-react";

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      const { id } = await params;
      const res = await fetch(`/api/user/orders/${id}`);
      const data = await res.json();
      if (data.success) {
        setOrder(data.order);
      }
      setLoading(false);
    };

    fetchOrder();
  }, [params]);

  if (loading) {
    return <div className="animate-pulse h-96 bg-white rounded-2xl border border-border" />;
  }

  if (!order) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-border">
        <h2 className="text-xl font-bold mb-2">Order Not Found</h2>
        <p className="text-muted-foreground mb-6">We couldn't find the details for this order.</p>
        <Link href="/account/orders" className="text-brand font-bold hover:underline">
          Back to Orders
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return "bg-emerald-500";
      case 'shipped': return "bg-blue-500";
      default: return "bg-amber-500";
    }
  };

  return (
    <div className="space-y-6">
      <Link href="/account/orders" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
        <ChevronLeft size={16} />
        Back to Orders
      </Link>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Order {order.id}</h1>
          <p className="text-muted-foreground text-sm">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-sm font-bold hover:bg-muted transition-colors">
            <Download size={16} />
            Invoice
          </button>
          {order.status === 'delivered' && (
            <button className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity">
              <RotateCcw size={16} />
              Return Items
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-muted -z-10 -translate-y-1/2" />
          
          {['processing', 'shipped', 'delivered'].map((step, i) => {
            const isCompleted = 
              order.status === 'delivered' || 
              (order.status === 'shipped' && i < 2) || 
              (order.status === 'processing' && i === 0);
              
            const isCurrent = order.status === step;

            return (
              <div key={step} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  isCompleted ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
                } ${isCurrent ? "ring-4 ring-emerald-500/20" : ""}`}>
                  {i + 1}
                </div>
                <span className={`text-xs font-bold mt-2 capitalize ${isCurrent ? "text-emerald-600" : "text-muted-foreground"}`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        {order.trackingNumber && (
          <div className="bg-muted/50 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Truck className="text-brand" size={20} />
              <div>
                <p className="text-sm font-bold">Tracking Number</p>
                <p className="text-xs text-muted-foreground">{order.trackingNumber}</p>
              </div>
            </div>
            {order.deliveryDate && (
              <div className="text-right">
                <p className="text-sm font-bold">Estimated Delivery</p>
                <p className="text-xs text-muted-foreground">{new Date(order.deliveryDate).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4">Items Summary</h3>
            <div className="space-y-4">
              {order.items.map((item: any, i: number) => (
                <div key={i} className="flex gap-4">
                  <div className="relative w-20 h-20 bg-muted rounded-xl overflow-hidden border border-border">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm">{item.title}</h4>
                    <p className="text-muted-foreground text-xs mt-1">Qty: {item.quantity}</p>
                  </div>
                  <div className="font-bold text-right">
                    ${(item.priceAtPurchase * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4">Payment Summary</h3>
            <div className="space-y-2 text-sm mb-4 pb-4 border-b border-border">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>${order.shippingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between items-center font-bold text-lg">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-sm flex items-center gap-2 mb-2 text-muted-foreground">
                <MapPin size={16} /> Shipping Address
              </h3>
              <p className="text-sm font-bold">{order.shippingAddress.fullName}</p>
              <p className="text-xs text-muted-foreground mt-1">{order.shippingAddress.street}</p>
              <p className="text-xs text-muted-foreground">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
            </div>
            
            <div className="pt-4 border-t border-border">
              <h3 className="font-bold text-sm flex items-center gap-2 mb-2 text-muted-foreground">
                <CreditCard size={16} /> Payment Method
              </h3>
              <p className="text-sm font-bold uppercase">{order.paymentMethod.replace('_', ' ')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
