import { HeroBento } from "@/components/home/HeroBento";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FlashSale } from "@/components/home/FlashSale";
import { FeaturedProducts, NewArrivals } from "@/components/home/FeaturedProducts";
import { BannerAds, BrandStrip } from "@/components/home/BannerAds";

export default function Home() {
  return (
    <div className="w-full pb-8 bg-background">
      {/* 1. Hero Section - Bento Grid */}
      <HeroBento />
      
      {/* 2. Top Categories (Sleek Pills) */}
      <CategoryGrid />
      
      <div className="flex flex-col gap-6 md:gap-10 mt-8">
        {/* 3. Flash Sales (Urgency - Glassmorphic) */}
        <FlashSale />
        
        {/* 4. Promotional Banners (Mesh Gradient) */}
        <BannerAds />
        
        {/* 5. Main Featured Grid (Clean, borderless) */}
        <FeaturedProducts />
        
        {/* 6. New Arrivals */}
        <NewArrivals />
        
        {/* 7. Brands Marquee */}
        <BrandStrip />
      </div>
    </div>
  );
}
