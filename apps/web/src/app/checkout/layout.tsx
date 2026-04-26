import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Simple Header for Checkout */}
      <header className="bg-white border-b border-border py-4 px-6 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-brand text-white rounded-full flex items-center justify-center font-bold text-xl">
              A
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              ACommerce Checkout
            </span>
          </Link>
          
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 px-3 py-1.5 rounded-full">
            <ShieldCheck size={16} />
            Secure Server
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {children}
      </main>
    </div>
  );
}
