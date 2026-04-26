import { ProductForm } from "@/components/seller/ProductForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add New Product — ACommerce Seller Central",
  description: "Create and publish a new product to the ACommerce marketplace.",
};

export default function NewProductPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <ProductForm />
    </div>
  );
}
