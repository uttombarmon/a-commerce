"use client";

import { useCheckoutStore } from "@/store/checkoutStore";
import { OrderSummarySidebar } from "@/components/checkout/OrderSummarySidebar";
import { Step1Address } from "@/components/checkout/Step1Address";
import { Step2Shipping } from "@/components/checkout/Step2Shipping";
import { Step3Payment } from "@/components/checkout/Step3Payment";
import { Step4Review } from "@/components/checkout/Step4Review";
import { Check } from "lucide-react";

const STEPS = [
  { id: 1, label: "Address" },
  { id: 2, label: "Shipping" },
  { id: 3, label: "Payment" },
  { id: 4, label: "Review" },
];

export default function CheckoutPage() {
  const currentStep = useCheckoutStore(state => state.currentStep);
  const setStep = useCheckoutStore(state => state.setStep);

  return (
    <div className="flex flex-col lg:flex-row gap-12 items-start">
      {/* Main Form Area */}
      <div className="flex-1 w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center relative z-10 w-full">
                <button
                  onClick={() => step.id < currentStep && setStep(step.id)}
                  disabled={step.id >= currentStep}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    currentStep === step.id 
                      ? "bg-brand text-white border-4 border-brand/20" 
                      : currentStep > step.id 
                        ? "bg-emerald-500 text-white cursor-pointer hover:bg-emerald-600" 
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {currentStep > step.id ? <Check size={20} /> : step.id}
                </button>
                <span className={`text-xs mt-2 font-bold ${currentStep === step.id ? "text-brand" : "text-muted-foreground"}`}>
                  {step.label}
                </span>
                
                {index < STEPS.length - 1 && (
                  <div className={`absolute top-5 left-[50%] right-[-50%] h-1 -z-10 ${currentStep > step.id ? "bg-emerald-500" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Step Rendering */}
        <div className="bg-white p-8 rounded-2xl border border-border shadow-sm">
          {currentStep === 1 && <Step1Address />}
          {currentStep === 2 && <Step2Shipping />}
          {currentStep === 3 && <Step3Payment />}
          {currentStep === 4 && <Step4Review />}
        </div>
      </div>

      {/* Sidebar Summary */}
      <div className="w-full lg:w-[400px] sticky top-24">
        <OrderSummarySidebar />
      </div>
    </div>
  );
}
