"use client";

import { useState } from "react";
import {
  TrendingUp, DollarSign, ShoppingCart, Star,
  ArrowUp, ArrowDown
} from "lucide-react";
import "@/components/seller/seller.css";

/* tiny sparkline built from SVG */
function Sparkline({ values, color = "#4f46e5" }: { values: number[]; color?: string }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const w = 120, h = 40, pad = 4;
  const pts = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline
        points={`${pad},${h} ${pts} ${w - pad},${h}`}
        fill={color}
        opacity="0.08"
        strokeLinecap="round"
      />
    </svg>
  );
}

const REVENUE_DATA  = [12400, 14200, 13800, 15600, 16200, 14900, 17800, 19200, 18400, 21000, 22500, 24800];
const ORDERS_DATA   = [88, 102, 95, 118, 130, 112, 143, 160, 151, 175, 189, 210];
const VISITORS_DATA = [3200, 3600, 3400, 4100, 4500, 3900, 4800, 5200, 4900, 5600, 5900, 6400];

const TOP_PRODUCTS = [
  { title: "Sony WH-1000XM5",           sales: 128, revenue: 44799,  pct: 92 },
  { title: "Apple AirPods Pro",          sales: 211, revenue: 52539,  pct: 100 },
  { title: "Logitech MX Master 3S",      sales: 87,  revenue: 8699,   pct: 41 },
  { title: "Bose QuietComfort 45",       sales: 74,  revenue: 20719,  pct: 35 },
  { title: "Samsung 65\" 4K QLED TV",   sales: 19,  revenue: 22800,  pct: 9  },
];

function MetricCard({
  label, value, sub, trend, data, color
}: {
  label: string; value: string; sub: string; trend: number; data: number[]; color: string
}) {
  const up = trend >= 0;
  return (
    <div className="form-card !p-6 flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-muted-foreground mb-1">{label}</p>
        <p className="text-3xl font-black mb-1">{value}</p>
        <div className={`flex items-center gap-1 text-xs font-bold ${up ? "text-emerald-500" : "text-red-500"}`}>
          {up ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
          {Math.abs(trend)}% {up ? "up" : "down"} vs last month
        </div>
        <p className="text-xs text-muted-foreground mt-1">{sub}</p>
      </div>
      <Sparkline values={data} color={color} />
    </div>
  );
}

export default function SellerAnalyticsPage() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d" | "1y">("30d");

  return (
    <div className="seller-page">
      <header className="seller-header">
        <div>
          <h1 className="seller-title">Analytics</h1>
          <p className="text-muted-foreground mt-1">Track your store performance over time.</p>
        </div>
        <div className="flex gap-1.5 bg-muted p-1 rounded-xl">
          {(["7d", "30d", "90d", "1y"] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                period === p ? "bg-card shadow text-foreground" : "text-muted-foreground"
              }`}
            >
              {p === "7d" ? "7 Days" : p === "30d" ? "30 Days" : p === "90d" ? "90 Days" : "1 Year"}
            </button>
          ))}
        </div>
      </header>

      {/* KPI Cards */}
      <div className="form-grid mb-8">
        <MetricCard label="Total Revenue"   value="$24,800"  sub="Gross sales this period"  trend={10.2} data={REVENUE_DATA}  color="#4f46e5" />
        <MetricCard label="Total Orders"    value="210"      sub="Successfully completed"   trend={11.1} data={ORDERS_DATA}   color="#0ea5e9" />
        <MetricCard label="Store Visitors"  value="6,400"    sub="Unique visitors"          trend={8.5}  data={VISITORS_DATA} color="#10b981" />
        <MetricCard label="Avg. Order Value" value="$118.10" sub="Per transaction"          trend={-2.3} data={REVENUE_DATA.map((v, i) => v / ORDERS_DATA[i])} color="#f59e0b" />
      </div>

      {/* Top Products */}
      <div className="form-card">
        <h2 className="text-xl font-black mb-6">Top Products by Revenue</h2>
        <div className="flex flex-col gap-5">
          {TOP_PRODUCTS.map((p, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-2xl font-black w-6 text-muted-foreground opacity-30">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between mb-1.5">
                  <p className="text-sm font-semibold truncate">{p.title}</p>
                  <p className="text-sm font-bold ml-4 shrink-0">
                    ${p.revenue.toLocaleString()}
                  </p>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${p.pct}%`, background: "linear-gradient(to right, #4f46e5, #7c3aed)" }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{p.sales} units sold</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
