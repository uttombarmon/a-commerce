import Link from "next/link";
import { Star, BadgeCheck, ExternalLink, Clock } from "lucide-react";
import type { Seller } from "@/types/product";

export function SellerCard({ seller }: { seller: Seller }) {
  const initials = seller.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="pdp-seller">
      <div className="pdp-seller__header">
        <div className="pdp-seller__avatar" aria-hidden="true">
          {initials}
        </div>
        <div className="pdp-seller__info">
          <div className="pdp-seller__name-row">
            <span className="pdp-seller__name">{seller.name}</span>
            {seller.verified && (
              <span className="pdp-seller__verified" aria-label="Verified seller">
                <BadgeCheck size={14} />
                Verified
              </span>
            )}
          </div>
          <div className="pdp-seller__meta">
            <span className="pdp-seller__rating">
              <Star size={12} className="pdp-seller__star" />
              {seller.rating.toFixed(1)}
            </span>
            <span className="pdp-seller__dot" aria-hidden="true">·</span>
            <span className="pdp-seller__feedback">{seller.positiveRate}% positive feedback</span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="pdp-seller__stats">
        <div className="pdp-seller__stat">
          <span className="pdp-seller__stat-val">{seller.responseRate}%</span>
          <span className="pdp-seller__stat-label">Response Rate</span>
        </div>
        <div className="pdp-seller__stat">
          <span className="pdp-seller__stat-val">{seller.reviewCount.toLocaleString()}</span>
          <span className="pdp-seller__stat-label">Reviews</span>
        </div>
        <div className="pdp-seller__stat">
          <span className="pdp-seller__stat-val">Since {seller.joinedYear}</span>
          <span className="pdp-seller__stat-label">Member</span>
        </div>
      </div>

      {/* Response time */}
      <div className="pdp-seller__response">
        <Clock size={13} />
        <span>Responds {seller.responseTime}</span>
      </div>

      <Link href="#" className="pdp-seller__visit">
        Visit Store
        <ExternalLink size={13} />
      </Link>
    </div>
  );
}
