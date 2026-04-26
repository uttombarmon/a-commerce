"use client";

import { useState } from "react";
import { Star, ThumbsUp, ThumbsDown, BadgeCheck, Camera } from "lucide-react";
import Image from "next/image";
import type { ProductReview, RatingBreakdown } from "@/types/product";
import { ReviewFormModal } from "./ReviewFormModal";

// ─── Rating Overview ──────────────────────────────────────────────────────────

function RatingOverview({
  rating,
  totalReviews,
  breakdown,
}: {
  rating: number;
  totalReviews: number;
  breakdown: RatingBreakdown[];
}) {
  return (
    <div className="pdp-reviews__overview">
      {/* Big score */}
      <div className="pdp-reviews__score-block">
        <span className="pdp-reviews__score-num">{rating.toFixed(1)}</span>
        <div className="pdp-reviews__score-stars" aria-label={`${rating} out of 5 stars`} role="img">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={18}
              className={i < Math.round(rating) ? "pdp-star--full" : "pdp-star--empty"}
            />
          ))}
        </div>
        <span className="pdp-reviews__score-total">{totalReviews.toLocaleString()} reviews</span>
      </div>

      {/* Bars */}
      <div className="pdp-reviews__bars">
        {breakdown.map((b) => (
          <div key={b.stars} className="pdp-reviews__bar-row" aria-label={`${b.stars} stars: ${b.pct}%`}>
            <span className="pdp-reviews__bar-label">{b.stars}★</span>
            <div className="pdp-reviews__bar-track" role="progressbar" aria-valuenow={b.pct} aria-valuemin={0} aria-valuemax={100}>
              <div
                className="pdp-reviews__bar-fill"
                style={{ width: `${b.pct}%` }}
              />
            </div>
            <span className="pdp-reviews__bar-pct">{b.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Single Review Card ───────────────────────────────────────────────────────

function ReviewCard({ review }: { review: ProductReview }) {
  const [helpful, setHelpful] = useState(review.helpful);
  const [voted, setVoted] = useState<"up" | "down" | null>(null);

  function vote(dir: "up" | "down") {
    if (voted) return;
    setVoted(dir);
    if (dir === "up") setHelpful((h) => h + 1);
  }

  const initials = review.authorName.slice(0, 2).toUpperCase();

  return (
    <div className="pdp-review-card">
      {/* Author */}
      <div className="pdp-review-card__header">
        <div className="pdp-review-card__avatar" aria-hidden="true">
          {initials}
        </div>
        <div className="pdp-review-card__author-info">
          <div className="pdp-review-card__author-row">
            <span className="pdp-review-card__name">{review.authorName}</span>
            {review.verified && (
              <span className="pdp-review-card__verified">
                <BadgeCheck size={12} />
                Verified Purchase
              </span>
            )}
          </div>
          <span className="pdp-review-card__date">{review.date}</span>
        </div>
      </div>

      {/* Stars */}
      <div className="pdp-review-card__stars" aria-label={`${review.rating} out of 5`} role="img">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={13}
            className={i < review.rating ? "pdp-star--full" : "pdp-star--empty"}
          />
        ))}
      </div>

      {/* Title + body */}
      <h4 className="pdp-review-card__title">{review.title}</h4>
      <p className="pdp-review-card__body">{review.body}</p>

      {/* Pros & Cons */}
      {(review.pros || review.cons) && (
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-3">
          {review.pros && (
            <div className="bg-emerald-50 text-emerald-800 p-2 rounded">
              <span className="font-bold block mb-1">Pros</span>
              {review.pros}
            </div>
          )}
          {review.cons && (
            <div className="bg-rose-50 text-rose-800 p-2 rounded">
              <span className="font-bold block mb-1">Cons</span>
              {review.cons}
            </div>
          )}
        </div>
      )}

      {/* Review images */}
      {review.images && review.images.length > 0 && (
        <div className="pdp-review-card__images">
          {review.images.map((src, i) => (
            <div key={i} className="pdp-review-card__image-wrap">
              <Image src={src} alt={`Review image ${i + 1}`} fill className="object-cover rounded-lg" sizes="80px" />
            </div>
          ))}
        </div>
      )}

      {/* Helpful row */}
      <div className="pdp-review-card__helpful">
        <span className="pdp-review-card__helpful-label">Helpful?</span>
        <button
          onClick={() => vote("up")}
          disabled={!!voted}
          className={`pdp-review-card__vote ${voted === "up" ? "pdp-review-card__vote--active" : ""}`}
          aria-label={`Mark as helpful (${helpful} people found this helpful)`}
        >
          <ThumbsUp size={13} />
          <span>{helpful}</span>
        </button>
        <button
          onClick={() => vote("down")}
          disabled={!!voted}
          className={`pdp-review-card__vote ${voted === "down" ? "pdp-review-card__vote--active" : ""}`}
          aria-label="Mark as not helpful"
        >
          <ThumbsDown size={13} />
        </button>
      </div>

      {/* Seller Response */}
      {review.sellerResponse && (
        <div className="mt-4 bg-muted p-4 rounded-xl border-l-4 border-brand">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Response from Seller</p>
          <p className="text-sm">{review.sellerResponse}</p>
        </div>
      )}
    </div>
  );
}

// ─── Main Reviews Section ─────────────────────────────────────────────────────

type FilterType = "all" | "verified" | "photos";

export function ReviewsSection({
  productId = "1",
  productTitle = "Product",
  rating,
  totalReviews,
  breakdown,
  reviews,
}: {
  productId?: string | number;
  productTitle?: string;
  rating: number;
  totalReviews: number;
  breakdown: RatingBreakdown[];
  reviews: ProductReview[];
}) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<"recent" | "helpful" | "highest">("recent");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const PER_PAGE = 3;

  const filtered = reviews.filter((r) => {
    if (filter === "verified") return r.verified;
    if (filter === "photos") return (r.images?.length ?? 0) > 0;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "helpful") return b.helpful - a.helpful;
    if (sortBy === "highest") return b.rating - a.rating;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const paginated = sorted.slice(0, page * PER_PAGE);
  const hasMore = paginated.length < sorted.length;

  return (
    <div className="pdp-reviews" id="reviews">
      <div className="flex justify-between items-start mb-6">
        <RatingOverview rating={rating} totalReviews={totalReviews} breakdown={breakdown} />
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-brand text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
        >
          Write a Review
        </button>
      </div>

      <ReviewFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        productId={productId} 
        productTitle={productTitle} 
      />

      {/* Filter and Sort bar */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="pdp-reviews__filters" role="group" aria-label="Filter reviews">
        {(["all", "verified", "photos"] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => { setFilter(f); setPage(1); }}
            className={`pdp-reviews__filter ${filter === f ? "pdp-reviews__filter--active" : ""}`}
            aria-pressed={filter === f}
          >
            {f === "all" && "All Reviews"}
            {f === "verified" && <><BadgeCheck size={13} /> Verified</>}
            {f === "photos" && <><Camera size={13} /> With Photos</>}
          </button>
        ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-muted-foreground">Sort By:</span>
          <select 
            className="p-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="recent">Most Recent</option>
            <option value="helpful">Most Helpful</option>
            <option value="highest">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Review cards */}
      <div className="pdp-reviews__list">
        {paginated.map((r) => (
          <ReviewCard key={r.id} review={r} />
        ))}
        {filtered.length === 0 && (
          <p className="pdp-reviews__empty">No reviews match this filter.</p>
        )}
      </div>

      {/* Pagination */}
      {hasMore && (
        <button
          onClick={() => setPage((p) => p + 1)}
          className="pdp-reviews__load-more"
        >
          Load More Reviews
        </button>
      )}
    </div>
  );
}
