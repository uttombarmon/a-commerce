import { useState } from "react";
import { FormState, Option } from "./types";

const initialState: FormState = {
  title: "",
  description: "",
  brand: "",
  category: "",
  images: [],
  options: [],
  variants: [],
  basePrice: 0,
  comparePrice: 0,
  costPrice: 0,
  bulkPricing: [],
  trackInventory: true,
  globalStock: 0,
  lowStockThreshold: 5,
  globalSku: "",
  globalBarcode: "",
  weight: 0,
  dimensions: { l: 0, w: 0, h: 0 },
  slug: "",
  metaTitle: "",
  metaDescription: "",
  status: "draft",
};

export function useProductForm(initialData?: Partial<FormState>) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormState>({ ...initialState, ...initialData });

  const nextStep = () => setStep((s) => Math.min(s + 1, 6));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      
      // Auto-generate slug if title changes and slug hasn't been manually edited heavily
      if (field === "title" && (!prev.slug || prev.slug === generateSlug(prev.title))) {
        newData.slug = generateSlug(value as string);
      }
      
      return newData;
    });
  };

  const generateVariants = (options: Option[]) => {
    if (options.length === 0) {
      updateField("variants", []);
      return;
    }
    
    // Simple Cartesian product
    let combos: string[][] = [[]];
    options.forEach((opt) => {
      const nextCombos: string[][] = [];
      combos.forEach((combo) => {
        opt.values.forEach((val) => {
          nextCombos.push([...combo, val]);
        });
      });
      combos = nextCombos;
    });

    const newVariants = combos.map((c) => ({
      name: c.join(" / "),
      price: formData.basePrice,
      stock: 0,
      sku: `${formData.brand.toUpperCase() || "SKU"}-${c.join("-").toUpperCase()}`.replace(/\s+/g, ""),
    }));
    updateField("variants", newVariants);
  };

  return {
    step,
    formData,
    updateField,
    nextStep,
    prevStep,
    generateVariants,
    setFormData,
  };
}

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
