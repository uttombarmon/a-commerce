import Image from "next/image";

export function BannerAds() {
  return (
    <section className="py-12 px-4 md:px-6 max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Banner 1 */}
        <div className="relative h-[280px] md:h-[320px] rounded-3xl overflow-hidden group cursor-pointer border border-border shadow-md">
          {/* Mesh gradient background */}
          <div className="absolute inset-0 bg-[#E0E7FF] dark:bg-[#1e1b4b] z-0" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-400 rounded-full blur-[80px] opacity-50 translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400 rounded-full blur-[80px] opacity-30 -translate-x-1/3 translate-y-1/3" />
          
          <div className="absolute inset-0 p-10 flex flex-col justify-center z-20">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold tracking-wider text-xs uppercase mb-2">Smart Home</span>
            <h3 className="text-primary font-bold text-3xl md:text-4xl mb-3 tracking-tight leading-tight group-hover:scale-105 transition-transform origin-left">
              Appliance<br/>Upgrade
            </h3>
            <p className="text-muted-foreground mb-6 max-w-[60%] text-sm">Save up to $500 on select large appliances</p>
            <span className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full w-max text-sm font-semibold shadow-xl hover:bg-primary/90 transition-colors">
              Explore Home
            </span>
          </div>
          <Image 
            src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=600&auto=format&fit=crop" 
            alt="Appliances" 
            fill 
            className="absolute right-0 top-0 h-full w-auto object-cover opacity-60 mix-blend-overlay z-10 transition-transform duration-700 group-hover:scale-110" 
          />
        </div>
        
        {/* Banner 2 */}
        <div className="relative h-[280px] md:h-[320px] rounded-3xl overflow-hidden group cursor-pointer border border-border shadow-md">
          {/* Mesh gradient background */}
          <div className="absolute inset-0 bg-[#Fce7f3] dark:bg-[#4c1d95] z-0" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-400 rounded-full blur-[80px] opacity-40 translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full blur-[80px] opacity-30 -translate-x-1/3 translate-y-1/3" />
          
          <div className="absolute inset-0 p-10 flex flex-col justify-center z-20">
            <span className="text-pink-600 dark:text-pink-400 font-bold tracking-wider text-xs uppercase mb-2">Back to School</span>
            <h3 className="text-primary font-bold text-3xl md:text-4xl mb-3 tracking-tight leading-tight group-hover:scale-105 transition-transform origin-left">
              Empower<br/>Your Setup
            </h3>
            <p className="text-muted-foreground mb-6 max-w-[60%] text-sm">Laptops, backpacks, and daily essentials</p>
            <span className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full w-max text-sm font-semibold shadow-xl hover:bg-primary/90 transition-colors">
              Shop Essentials
            </span>
          </div>
          <Image 
            src="https://images.unsplash.com/photo-1503694978374-8a2fa686963a?q=80&w=600&auto=format&fit=crop" 
            alt="School" 
            fill 
            className="absolute right-0 top-0 h-full w-auto object-cover opacity-60 mix-blend-overlay z-10 transition-transform duration-700 group-hover:scale-110" 
          />
        </div>

      </div>
    </section>
  );
}

export function BrandStrip() {
  const brands = ["Samsung", "Apple", "Sony", "Nike", "Adidas", "LG", "Microsoft", "Dell", "HP", "Canon"];
  
  return (
    <section className="py-16 bg-surface overflow-hidden my-8">
      <div className="max-w-7xl mx-auto px-4 mb-8 text-center">
        <h3 className="text-muted-foreground font-semibold text-xs tracking-[0.2em] uppercase">Trusted by industry leaders</h3>
      </div>
      <div className="relative flex overflow-x-hidden">
        {/* Gradient fades for smooth edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-surface to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-surface to-transparent z-10" />
        
        <div className="animate-marquee flex whitespace-nowrap">
          {brands.map((brand, i) => (
            <span key={i} className="text-2xl md:text-4xl font-extrabold text-muted-foreground/30 hover:text-foreground transition-colors cursor-default mx-12 md:mx-20">
              {brand}
            </span>
          ))}
        </div>
        <div className="animate-marquee flex whitespace-nowrap absolute top-0">
          {brands.map((brand, i) => (
            <span key={`clone-${i}`} className="text-2xl md:text-4xl font-extrabold text-muted-foreground/30 hover:text-foreground transition-colors cursor-default mx-12 md:mx-20">
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
