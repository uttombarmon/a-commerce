import { CreditCard } from "lucide-react";
import type { ProductDetail } from "@/types/product";

interface PricingSectionProps {
  price: number;
  comparePrice?: number;
  emiMonthly?: number;
}

export function PricingSection({ price, comparePrice, emiMonthly }: PricingSectionProps) {
  const discount =
    comparePrice && comparePrice > price
      ? Math.round(((comparePrice - price) / comparePrice) * 100)
      : null;

  return (
    <div className="pdp-pricing">
      {/* Main price row */}
      <div className="pdp-pricing__row">
        <span className="pdp-pricing__price">${price.toFixed(2)}</span>
        {discount && (
          <span className="pdp-pricing__badge">-{discount}% OFF</span>
        )}
      </div>

      {/* Compare / original */}
      {comparePrice && comparePrice > price && (
        <div className="pdp-pricing__compare-row">
          <span className="pdp-pricing__compare-label">M.R.P.:</span>
          <span className="pdp-pricing__compare">${comparePrice.toFixed(2)}</span>
          <span className="pdp-pricing__savings">
            You save: ${(comparePrice - price).toFixed(2)} ({discount}%)
          </span>
        </div>
      )}

      {/* Tax line */}
      <p className="pdp-pricing__tax">Inclusive of all taxes</p>

      {/* EMI */}
      {emiMonthly && (
        <div className="pdp-pricing__emi">
          <CreditCard size={14} className="flex-shrink-0" />
          <span>
            From <strong>${emiMonthly}/mo</strong> with 0% APR financing.{" "}
            <a href="#" className="pdp-pricing__emi-link">Learn more</a>
          </span>
        </div>
      )}
    </div>
  );
}
