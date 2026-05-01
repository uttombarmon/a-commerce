"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Routes that should NOT show the public navbar and footer
  // Admin and Seller dashboards have their own navigation systems
  const isDashboard = pathname.startsWith('/admin') || 
                      pathname.startsWith('/seller');

  // Account pages should still have the public navbar for easy navigation back to the shop
  // but they need to handle the padding.
  
  if (isDashboard) {
    return <div className="flex-grow flex flex-col">{children}</div>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow flex flex-col pt-20 md:pt-28">
        {children}
      </main>
      <Footer />
    </>
  );
}
