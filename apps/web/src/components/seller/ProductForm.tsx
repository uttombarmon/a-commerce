"use client";

import { useState, useCallback } from "react";
import { 
  Package, Image as ImageIcon, Layers, DollarSign, 
  Truck, Search as SeoIcon, Check, ChevronRight, 
  Plus, X, GripVertical, Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import "./seller.css";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface FormState {
  // Step 1
  title: string;
  description: string;
  brand: string;
  category: string;
  slug: string;
  // Step 2
  images: string[];
  // Step 3
  options: { type: string; values: string[] }[];
  variants: { name: string; price: number; stock: number; sku: string }[];
  // Step 4
  basePrice: number;
  comparePrice: number;
  costPrice: number;
  // Step 5
  weight: number;
  dimensions: { l: number; w: number; h: number };
  status: string;
}

const STEPS = [
  { id: 1, label: "Basic Info", icon: <Package size={18} /> },
  { id: 2, label: "Media", icon: <ImageIcon size={18} /> },
  { id: 3, label: "Variants", icon: <Layers size={18} /> },
  { id: 4, label: "Pricing", icon: <DollarSign size={18} /> },
  { id: 5, label: "Shipping", icon: <Truck size={18} /> },
];

export function ProductForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormState>({
    title: "",
    description: "",
    brand: "",
    category: "",
    slug: "",
    images: [],
    options: [],
    variants: [],
    basePrice: 0,
    comparePrice: 0,
    costPrice: 0,
    weight: 0,
    dimensions: { l: 0, w: 0, h: 0 },
    status: "draft",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextStep = () => setStep(s => Math.min(s + 1, 5));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const updateField = (field: keyof FormState, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/seller/products", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        alert("Product published successfully!");
        // Redirect or reset
      }
    } catch (error) {
      console.error("Submission failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="seller-page">
      <header className="seller-header">
        <div>
          <h1 className="seller-title">Add New Product</h1>
          <p className="text-muted-foreground mt-1">Get your product ready for millions of shoppers.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary" disabled={isSubmitting}>Save Draft</button>
          <button className="btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Publishing..." : "Publish Product"}
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
      <div className="form-card">
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
            {step === 3 && <VariantMatrix data={formData} onChange={updateField} />}
            {step === 4 && <PricingData data={formData} onChange={updateField} />}
            {step === 5 && <ShippingData data={formData} onChange={updateField} />}
          </motion.div>
        </AnimatePresence>

        <div className="form-nav">
          <button 
            className="btn-secondary" 
            onClick={prevStep} 
            disabled={step === 1}
            style={{ opacity: step === 1 ? 0 : 1 }}
          >
            Back
          </button>
          <button className="btn-primary flex items-center gap-2" onClick={nextStep}>
            {step === 5 ? "Finish" : "Next Step"}
            {step < 5 && <ChevronRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── STEP 1: BASIC INFO ──────────────────────────────────────────────────────

function BasicInfo({ data, onChange }: { data: FormState, onChange: any }) {
  return (
    <div className="form-grid">
      <div className="form-field form-field--full">
        <label className="form-label">Product Title</label>
        <input 
          type="text" 
          className="form-input" 
          placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
          value={data.title}
          onChange={(e) => onChange("title", e.target.value)}
        />
      </div>
      <div className="form-field form-field--full">
        <label className="form-label">Description</label>
        <textarea 
          className="form-textarea h-40" 
          placeholder="Tell shoppers about your product..."
          value={data.description}
          onChange={(e) => onChange("description", e.target.value)}
        />
      </div>
      <div className="form-field">
        <label className="form-label">Brand</label>
        <input 
          type="text" 
          className="form-input" 
          placeholder="e.g. Sony"
          value={data.brand}
          onChange={(e) => onChange("brand", e.target.value)}
        />
      </div>
      <div className="form-field">
        <label className="form-label">Category</label>
        <select 
          className="form-select"
          value={data.category}
          onChange={(e) => onChange("category", e.target.value)}
        >
          <option value="">Select Category</option>
          <option value="electronics">Electronics</option>
          <option value="fashion">Fashion</option>
          <option value="home">Home & Kitchen</option>
        </select>
      </div>
    </div>
  );
}

// ─── STEP 2: MEDIA UPLOAD ─────────────────────────────────────────────────────

function MediaUpload({ data, onChange }: { data: FormState, onChange: any }) {
  const mockUpload = () => {
    const urls = [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800"
    ];
    onChange("images", [...data.images, urls[Math.floor(Math.random() * urls.length)]]);
  };

  return (
    <div>
      <div className="upload-zone" onClick={mockUpload}>
        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
          <Plus className="text-brand" />
        </div>
        <div className="text-center">
          <p className="font-bold">Click to upload images</p>
          <p className="text-xs text-muted-foreground mt-1">Drag and drop up to 8 images (JPG, PNG, WEBP)</p>
        </div>
      </div>

      <div className="image-preview-grid">
        {data.images.map((url, i) => (
          <div key={i} className="image-preview group">
            <img src={url} alt="" />
            <button 
              className="image-preview__remove opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onChange("images", data.images.filter((_, idx) => idx !== i));
              }}
            >
              <X size={12} />
            </button>
            {i === 0 && (
              <div className="absolute bottom-2 left-2 bg-brand text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                Main
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── STEP 3: VARIANTS ─────────────────────────────────────────────────────────

function VariantMatrix({ data, onChange }: { data: FormState, onChange: any }) {
  const [optionType, setOptionType] = useState("");
  const [optionValues, setOptionValues] = useState("");

  const addOption = () => {
    if (!optionType || !optionValues) return;
    const values = optionValues.split(",").map(v => v.trim());
    const newOptions = [...data.options, { type: optionType, values }];
    onChange("options", newOptions);
    generateVariants(newOptions);
    setOptionType("");
    setOptionValues("");
  };

  const generateVariants = (options: any[]) => {
    if (options.length === 0) return;
    
    // Simple Cartesian product simulation
    let combos: string[][] = [[]];
    options.forEach(opt => {
      const nextCombos: string[][] = [];
      combos.forEach(combo => {
        opt.values.forEach((val: string) => {
          nextCombos.push([...combo, val]);
        });
      });
      combos = nextCombos;
    });

    const newVariants = combos.map(c => ({
      name: c.join(" / "),
      price: data.basePrice,
      stock: 0,
      sku: `${data.brand.toUpperCase()}-${c.join("-").toUpperCase()}`
    }));
    onChange("variants", newVariants);
  };

  return (
    <div>
      <div className="bg-muted/50 p-6 rounded-2xl border border-dashed border-border mb-8">
        <h4 className="text-sm font-bold mb-4">Add Product Options</h4>
        <div className="flex gap-4">
          <input 
            className="form-input !bg-surface" 
            placeholder="Option Type (e.g. Color)" 
            value={optionType}
            onChange={(e) => setOptionType(e.target.value)}
          />
          <input 
            className="form-input !bg-surface" 
            placeholder="Values (comma separated: Red, Blue)" 
            value={optionValues}
            onChange={(e) => setOptionValues(e.target.value)}
          />
          <button className="btn-primary !py-2" onClick={addOption}>Add</button>
        </div>
      </div>

      {data.options.length > 0 && (
        <div className="mb-8 flex gap-4 flex-wrap">
          {data.options.map((opt, i) => (
            <div key={i} className="chip">
              <span className="opacity-50 mr-1">{opt.type}:</span> {opt.values.join(", ")}
              <X size={12} className="ml-2 cursor-pointer" onClick={() => onChange("options", data.options.filter((_, idx) => idx !== i))} />
            </div>
          ))}
        </div>
      )}

      {data.variants.length > 0 && (
        <div className="overflow-x-auto">
          <table className="variant-matrix-table">
            <thead>
              <tr>
                <th>Variant</th>
                <th>Price ($)</th>
                <th>Stock</th>
                <th>SKU</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.variants.map((v, i) => (
                <tr key={i}>
                  <td className="font-bold text-sm">{v.name}</td>
                  <td><input type="number" className="form-input !py-1 w-24" defaultValue={v.price} /></td>
                  <td><input type="number" className="form-input !py-1 w-20" defaultValue={v.stock} /></td>
                  <td><input type="text" className="form-input !py-1 w-40" defaultValue={v.sku} /></td>
                  <td><Trash2 size={16} className="text-red-400 cursor-pointer" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── STEP 4: PRICING ──────────────────────────────────────────────────────────

function PricingData({ data, onChange }: { data: FormState, onChange: any }) {
  return (
    <div className="form-grid">
      <div className="form-field">
        <label className="form-label">Base Price ($)</label>
        <input 
          type="number" 
          className="form-input" 
          value={data.basePrice}
          onChange={(e) => onChange("basePrice", parseFloat(e.target.value))}
        />
      </div>
      <div className="form-field">
        <label className="form-label">Compare-at Price ($)</label>
        <input 
          type="number" 
          className="form-input" 
          value={data.comparePrice}
          onChange={(e) => onChange("comparePrice", parseFloat(e.target.value))}
        />
      </div>
      <div className="form-field">
        <label className="form-label">Cost per item ($)</label>
        <input 
          type="number" 
          className="form-input" 
          value={data.costPrice}
          onChange={(e) => onChange("costPrice", parseFloat(e.target.value))}
        />
        <p className="text-[10px] text-muted-foreground">Customers won't see this.</p>
      </div>
      <div className="form-field flex flex-row items-center gap-3 bg-muted/30 p-4 rounded-xl">
        <input type="checkbox" className="w-4 h-4" />
        <div>
          <p className="text-sm font-bold">Charge tax on this product</p>
          <p className="text-xs text-muted-foreground">Standard 8% sales tax will be applied.</p>
        </div>
      </div>
    </div>
  );
}

// ─── STEP 5: SHIPPING ─────────────────────────────────────────────────────────

function ShippingData({ data, onChange }: { data: FormState, onChange: any }) {
  return (
    <div className="form-grid">
      <div className="form-field">
        <label className="form-label">Weight (kg)</label>
        <input 
          type="number" 
          className="form-input" 
          value={data.weight}
          onChange={(e) => onChange("weight", parseFloat(e.target.value))}
        />
      </div>
      <div className="form-field flex gap-2">
        <div className="flex-1">
          <label className="form-label">Length</label>
          <input type="number" className="form-input" />
        </div>
        <div className="flex-1">
          <label className="form-label">Width</label>
          <input type="number" className="form-input" />
        </div>
        <div className="flex-1">
          <label className="form-label">Height</label>
          <input type="number" className="form-input" />
        </div>
      </div>
      <div className="form-field form-field--full border-t border-border pt-6 mt-4">
        <label className="form-label">SEO Preview</label>
        <div className="p-6 bg-white border border-border rounded-2xl">
          <p className="text-blue-700 text-lg hover:underline cursor-pointer truncate">
            {data.title || "Product Title Preview"} | ACommerce Marketplace
          </p>
          <p className="text-green-800 text-sm mb-1">
            https://acommerce.com/products/{data.title.toLowerCase().replace(/ /g, "-") || "url-slug"}
          </p>
          <p className="text-gray-600 text-xs line-clamp-2">
            {data.description || "Enter a description to see how your product will look in search engine results."}
          </p>
        </div>
      </div>
    </div>
  );
}
