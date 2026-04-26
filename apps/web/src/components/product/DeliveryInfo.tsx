import { Truck, RotateCcw, ShieldCheck, Clock } from "lucide-react";

interface DeliveryInfoProps {
  estimatedDelivery: string;
  freeShipping: boolean;
  freeShippingThreshold: number;
  returnDays: number;
}

export function DeliveryInfo({
  estimatedDelivery,
  freeShipping,
  freeShippingThreshold,
  returnDays,
}: DeliveryInfoProps) {
  return (
    <div className="pdp-delivery">
      {/* Estimated delivery */}
      <div className="pdp-delivery__row">
        <div className="pdp-delivery__icon pdp-delivery__icon--brand">
          <Truck size={16} />
        </div>
        <div className="pdp-delivery__content">
          <span className="pdp-delivery__label">
            {freeShipping
              ? freeShippingThreshold === 0
                ? "Free Delivery"
                : `Free delivery over $${freeShippingThreshold}`
              : "Standard Shipping"}
          </span>
          <span className="pdp-delivery__value">Get it by {estimatedDelivery}</span>
        </div>
      </div>

      <div className="pdp-delivery__divider" aria-hidden="true" />

      {/* Returns */}
      <div className="pdp-delivery__row">
        <div className="pdp-delivery__icon pdp-delivery__icon--green">
          <RotateCcw size={16} />
        </div>
        <div className="pdp-delivery__content">
          <span className="pdp-delivery__label">Free Returns</span>
          <span className="pdp-delivery__value">{returnDays}-day hassle-free return policy</span>
        </div>
      </div>

      <div className="pdp-delivery__divider" aria-hidden="true" />

      {/* Security */}
      <div className="pdp-delivery__row">
        <div className="pdp-delivery__icon pdp-delivery__icon--amber">
          <ShieldCheck size={16} />
        </div>
        <div className="pdp-delivery__content">
          <span className="pdp-delivery__label">Secure Payment</span>
          <span className="pdp-delivery__value">256-bit SSL encrypted checkout</span>
        </div>
      </div>
    </div>
  );
}
