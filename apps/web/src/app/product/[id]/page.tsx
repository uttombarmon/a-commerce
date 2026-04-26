import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMockProduct, RELATED_PRODUCTS } from "@/lib/mock-products";
import { ImageGallery } from "@/components/product/ImageGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { PricingSection } from "@/components/product/PricingSection";
import { VariantSelector } from "@/components/product/VariantSelector";
import { ActionButtons } from "@/components/product/ActionButtons";
import { DeliveryInfo } from "@/components/product/DeliveryInfo";
import { SellerCard } from "@/components/product/SellerCard";
import { ProductTabs } from "@/components/product/ProductTabs";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import "../../pdp-combined.css";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = getMockProduct(id);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.title} — ACommerce`,
    description: `Buy ${product.title} from ${product.seller.name}. ${product.rating}★ rating. Free shipping available.`,
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getMockProduct(id);
  if (!product) notFound();

  return (
    <div className="pdp-page">
      {/* ── Top grid: image + sidebar ────────────────────────────── */}
      <div className="pdp-layout">
        {/* Left: Image Gallery */}
        <div className="pdp-layout__gallery">
          <ImageGallery images={product.images} productTitle={product.title} />
        </div>

        {/* Centre: Product core info */}
        <div className="pdp-layout__main">
          <ProductInfo product={product} />

          <div className="pdp-layout__divider" aria-hidden="true" />

          <PricingSection
            price={product.price}
            comparePrice={product.comparePrice}
            emiMonthly={product.emiMonthly}
          />

          <div className="pdp-layout__divider" aria-hidden="true" />

          <VariantSelector
            colors={product.colors}
            sizes={product.sizes}
          />

          <ActionButtons
            outOfStock={product.outOfStock}
            productId={product.id}
          />
        </div>

        {/* Right sidebar: Delivery + Seller */}
        <aside className="pdp-layout__sidebar">
          <DeliveryInfo
            estimatedDelivery={product.estimatedDelivery}
            freeShipping={product.freeShipping ?? true}
            freeShippingThreshold={product.freeShippingThreshold}
            returnDays={product.returnDays}
          />
          <SellerCard seller={product.seller} />
        </aside>
      </div>

      {/* ── Tabs: Description / Specs / Reviews / Q&A ─────────── */}
      <div className="pdp-tabs-wrapper">
        <ProductTabs product={product} />
      </div>

      {/* ── Related Products ─────────────────────────────────────── */}
      <div className="pdp-related-wrapper">
        <RelatedProducts products={RELATED_PRODUCTS} />
      </div>
    </div>
  );
}
