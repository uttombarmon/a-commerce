"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingCart, BarChart2,
  Star, Settings, ChevronRight, Store, HelpCircle
} from "lucide-react";
import "@/components/seller/seller.css";

const NAV_ITEMS = [
  { href: "/seller",           icon: <LayoutDashboard size={18} />, label: "Dashboard" },
  { href: "/seller/products",  icon: <Package size={18} />,         label: "Products"  },
  { href: "/seller/orders",    icon: <ShoppingCart size={18} />,    label: "Orders"    },
  { href: "/seller/analytics", icon: <BarChart2 size={18} />,       label: "Analytics" },
  { href: "/seller/reviews",   icon: <Star size={18} />,            label: "Reviews"   },
  { href: "/seller/settings",  icon: <Settings size={18} />,        label: "Settings"  },
];

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="seller-layout">
      {/* ── Sidebar ─────────────────────────────── */}
      <aside className="seller-sidebar">
        {/* Shop identity */}
        <div className="seller-sidebar__brand">
          <div className="seller-sidebar__avatar">
            <Store size={20} />
          </div>
          <div>
            <p className="font-bold text-sm">My Shop</p>
            <p className="text-xs text-muted-foreground">seller@acommerce.com</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="seller-sidebar__nav">
          {NAV_ITEMS.map(item => {
            const active = pathname === item.href || (item.href !== "/seller" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`seller-nav-item ${active ? "seller-nav-item--active" : ""}`}
              >
                {item.icon}
                {item.label}
                {active && <ChevronRight size={14} className="ml-auto opacity-50" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="seller-sidebar__footer">
          <button className="seller-nav-item w-full">
            <HelpCircle size={18} />
            Help & Support
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────── */}
      <main className="seller-main">
        {children}
      </main>
    </div>
  );
}
