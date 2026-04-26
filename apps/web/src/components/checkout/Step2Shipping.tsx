"use client";

import { useCheckoutStore } from "@/store/checkoutStore";
import { Truck, Clock, Zap } from "lucide-react";
import { useState } from "react";

const SHIPPING_OPTIONS = [
  {
    id: "standard",
    title: "Standard Shipping",
    description: "3-5 business days",
    price: 0,
    icon: Truck,
    days: 4
  },
  {
    id: "express",
    title: "Express Shipping",
    description: "1-2 business days",
    price: 15,
    icon: Clock,
    days: 2
  },
  {
    id: "same_day",
    title: "Same Day Delivery",
    description: "Delivered by 8 PM today",
    price: 25,
    icon: Zap,
    days: 0
  }
];

export function Step2Shipping() {
  const { prevStep, nextStep, setShipping, shippingMethod } = useCheckoutStore();
  const [selected, setSelected] = useState<string | null>(shippingMethod);

  const handleSelect = (id: string, price: number, days: number) => {
    setSelected(id);
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + days);
    setShipping(id as any, price, deliveryDate);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">Shipping Method</h2>
        <p className="text-muted-foreground text-sm">Choose how quickly you want your order delivered.</p>
      </div>

      <div className="space-y-4">
        {SHIPPING_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isSelected = selected === option.id;

          return (
            <div 
              key={option.id}
              onClick={() => handleSelect(option.id, option.price, option.days)}
              className={`p-5 border rounded-xl cursor-pointer flex items-center justify-between transition-all ${
                isSelected 
                  ? "border-brand bg-brand/5 ring-1 ring-brand" 
                  : "border-border hover:border-brand/50"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${isSelected ? "bg-brand text-white" : "bg-muted text-muted-foreground"}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <h4 className="font-bold">{option.title}</h4>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
              </div>
              <div className="font-bold text-lg">
                {option.price === 0 ? <span className="text-emerald-600">Free</span> : `$${option.price.toFixed(2)}`}
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-6 flex justify-between">
        <button 
          onClick={prevStep}
          className="px-8 py-3 text-muted-foreground font-bold hover:text-foreground transition-colors"
        >
          Back
        </button>
        <button 
          onClick={nextStep}
          disabled={!selected}
          className="px-8 py-3 bg-brand text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
}
