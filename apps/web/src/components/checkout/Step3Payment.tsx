"use client";

import { useState } from "react";
import { useCheckoutStore } from "@/store/checkoutStore";
import { CreditCard, Wallet, Banknote, ShieldCheck } from "lucide-react";
import Image from "next/image";

const PAYMENT_METHODS = [
  { id: "credit_card", label: "Credit or Debit Card", icon: CreditCard },
  { id: "bkash", label: "bKash", icon: Wallet, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/BKash_Logo.svg/1200px-BKash_Logo.svg.png" },
  { id: "nagad", label: "Nagad", icon: Wallet, img: "https://download.logo.wine/logo/Nagad/Nagad-Logo.wine.png" },
  { id: "sslcommerz", label: "SSLCommerz", icon: ShieldCheck, img: "https://securepay.sslcommerz.com/public/image/SSLCommerz-Pay-With-logo-All-Size-05.png" },
  { id: "cod", label: "Cash on Delivery", icon: Banknote },
];

export function Step3Payment() {
  const { prevStep, nextStep, setPayment, paymentMethod } = useCheckoutStore();
  const [selected, setSelected] = useState<string | null>(paymentMethod);
  const [saveCard, setSaveCard] = useState(false);

  // Mock Card Form State
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const handleNext = () => {
    if (!selected) return;
    
    let details = {};
    if (selected === "credit_card") {
      details = { last4: cardNumber.slice(-4) || "4242", saved: saveCard };
    }
    
    setPayment(selected as any, details);
    nextStep();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">Payment Method</h2>
        <p className="text-muted-foreground text-sm">All transactions are secure and encrypted.</p>
      </div>

      <div className="space-y-4">
        {PAYMENT_METHODS.map((method) => {
          const isSelected = selected === method.id;
          const Icon = method.icon;

          return (
            <div key={method.id} className={`border rounded-xl transition-all ${isSelected ? "border-brand bg-brand/5 ring-1 ring-brand" : "border-border"}`}>
              <div 
                className="p-5 flex items-center justify-between cursor-pointer"
                onClick={() => setSelected(method.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-brand" : "border-muted-foreground"}`}>
                    {isSelected && <div className="w-2.5 h-2.5 bg-brand rounded-full" />}
                  </div>
                  <Icon size={20} className={isSelected ? "text-brand" : "text-muted-foreground"} />
                  <span className="font-bold">{method.label}</span>
                </div>
                {method.img && (
                  <div className="relative w-16 h-8 object-contain">
                    <Image src={method.img} alt={method.label} fill className="object-contain" />
                  </div>
                )}
              </div>

              {/* Conditional Form Rendering based on Selection */}
              {isSelected && method.id === "credit_card" && (
                <div className="p-5 pt-0 border-t border-brand/20 mt-2">
                  <div className="space-y-4 mt-4">
                    <div>
                      <input 
                        type="text" 
                        placeholder="Card Number (Mock)" 
                        className="w-full p-3 border border-border rounded-lg bg-white"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input 
                        type="text" 
                        placeholder="MM / YY" 
                        className="w-full p-3 border border-border rounded-lg bg-white"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                      />
                      <input 
                        type="text" 
                        placeholder="CVC" 
                        className="w-full p-3 border border-border rounded-lg bg-white"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                      />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer mt-2">
                      <input type="checkbox" checked={saveCard} onChange={(e) => setSaveCard(e.target.checked)} className="rounded text-brand focus:ring-brand accent-brand w-4 h-4" />
                      <span className="text-sm text-muted-foreground">Save this card for future purchases</span>
                    </label>
                  </div>
                </div>
              )}

              {isSelected && method.id !== "credit_card" && method.id !== "cod" && (
                <div className="p-5 pt-0 border-t border-brand/20 mt-2 text-sm text-muted-foreground">
                  You will be redirected to {method.label}'s secure portal to complete your payment after reviewing your order.
                </div>
              )}
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
          onClick={handleNext}
          disabled={!selected}
          className="px-8 py-3 bg-brand text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
        >
          <ShieldCheck size={18} />
          Review Order
        </button>
      </div>
    </div>
  );
}
