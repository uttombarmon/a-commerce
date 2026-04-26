"use client";

import { useState } from "react";
import { Package, Image as ImageIcon, Layers, DollarSign, Truck, Search as SearchIcon, Check, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { STEPS } from "./types";
import { useProductForm } from "./useProductForm";
import { BasicInfo } from "./BasicInfo";
import { MediaUpload } from "./MediaUpload";
import { VariantMatrix } from "./VariantMatrix";
import { PricingData } from "./PricingData";
import { InventoryShipping } from "./InventoryShipping";
import { SeoStatus } from "./SeoStatus";
import "../seller.css";

const ICON_MAP: Record<string, React.ReactNode> = {
  Package: <Package size={18} />,
  ImageIcon: <ImageIcon size={18} />,
  Layers: <Layers size={18} />,
  DollarSign: <DollarSign size={18} />,
  Truck: <Truck size={18} />,
  Search: <SearchIcon size={18} />
};

export function ProductForm({ productId }: { productId?: string }) {
  const router = useRouter();
  const { step, formData, updateField, nextStep, prevStep, generateVariants } = useProductForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/seller/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, productId }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Product saved successfully!");
        router.push("/seller");
      } else {
        alert(data.error || "Something went wrong.");
      }
    } catch (error) {
      console.error("Submission failed", error);
      alert("Failed to submit form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveDraft = async () => {
    updateField("status", "draft");
    await handleSubmit();
  };

  return (
    <div className="seller-page">
      <header className="seller-header">
        <div>
          <h1 className="seller-title">{productId ? "Edit Product" : "Add New Product"}</h1>
          <p className="text-muted-foreground mt-1">
            {productId ? `Editing product #${productId}` : "Get your product ready for millions of shoppers."}
          </p>
        </div>
        <div className="flex gap-3">
          <button type="button" className="btn-secondary" onClick={saveDraft} disabled={isSubmitting}>
            Save Draft
          </button>
          <button type="button" className="btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : productId ? "Save Changes" : "Publish Product"}
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="progress-steps">
        {STEPS.map((s) => (
          <div 
            key={s.id} 
            className={`step-item ${step === s.id ? 'step-item--active' : ''} ${step > s.id ? 'step-item--completed' : ''}`}
          >
            <div className="step-dot">
              {step > s.id ? <Check size={16} /> : s.id}
            </div>
            <span className="step-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="form-card relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {step === 1 && <BasicInfo data={formData} onChange={updateField} />}
            {step === 2 && <MediaUpload data={formData} onChange={updateField} />}
            {step === 3 && <VariantMatrix data={formData} onChange={updateField} onGenerate={generateVariants} />}
            {step === 4 && <PricingData data={formData} onChange={updateField} />}
            {step === 5 && <InventoryShipping data={formData} onChange={updateField} />}
            {step === 6 && <SeoStatus data={formData} onChange={updateField} />}
          </motion.div>
        </AnimatePresence>

        <div className="form-nav">
          <button 
            type="button"
            className="btn-secondary" 
            onClick={prevStep} 
            disabled={step === 1}
            style={{ opacity: step === 1 ? 0 : 1 }}
          >
            Back
          </button>
          {step < STEPS.length ? (
            <button type="button" className="btn-primary flex items-center gap-2" onClick={nextStep}>
              Next Step
              <ChevronRight size={16} />
            </button>
          ) : (
            <button type="button" className="btn-primary flex items-center gap-2" onClick={handleSubmit} disabled={isSubmitting}>
              <Check size={16} />
              {productId ? "Update Product" : "Publish Product"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
