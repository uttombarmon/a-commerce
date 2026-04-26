import { ProductForm } from "@/components/seller/product-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Product — ACommerce Seller Central",
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // In production: fetch product by ID from DB
  return (
    <div className="bg-slate-50 min-h-screen">
      <ProductForm productId={id} />
    </div>
  );
}
