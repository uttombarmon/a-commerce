"use client";

import { useState, useEffect } from "react";
import { Check, X, ShieldAlert, Star } from "lucide-react";

interface PendingReview {
  id: string;
  productId: string;
  productTitle: string;
  authorName: string;
  rating: number;
  title: string;
  comment: string;
  status: string;
  date: string;
}

export default function AdminReviewsModeration() {
  const [reviews, setReviews] = useState<PendingReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/reviews/pending") // Fetching from the GET endpoint we made
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setReviews(data.reviews);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleModeration = async (id: string, status: "approved" | "rejected") => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setReviews(reviews.filter(r => r.id !== id));
      }
    } catch (error) {
      alert("Failed to moderate review.");
    }
  };

  if (loading) return <div className="p-8">Loading moderation queue...</div>;

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
          <ShieldAlert size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Review Moderation Queue</h1>
          <p className="text-muted-foreground">Approve or reject pending product reviews.</p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-border">
          <ShieldAlert size={48} className="mx-auto text-muted-foreground opacity-20 mb-4" />
          <h3 className="text-xl font-bold">Queue is Empty</h3>
          <p className="text-muted-foreground">All pending reviews have been moderated.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review.id} className="bg-white border border-border rounded-2xl p-6 shadow-sm flex gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold px-2 py-1 bg-amber-100 text-amber-800 rounded-full">PENDING</span>
                  <span className="text-sm text-muted-foreground">{review.date}</span>
                </div>
                <h3 className="font-bold text-lg mb-1">{review.title}</h3>
                <div className="flex text-brand mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className={i < review.rating ? "fill-brand" : "text-muted-foreground opacity-30"} />
                  ))}
                </div>
                <p className="text-gray-700 text-sm mb-4">"{review.comment}"</p>
                <div className="text-xs text-muted-foreground">
                  <span className="font-bold">Product:</span> {review.productTitle} <br/>
                  <span className="font-bold">Author:</span> {review.authorName}
                </div>
              </div>
              <div className="flex flex-col gap-2 w-32 shrink-0">
                <button 
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 font-bold rounded-xl hover:bg-emerald-200 transition-colors"
                  onClick={() => handleModeration(review.id, "approved")}
                >
                  <Check size={16} /> Approve
                </button>
                <button 
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-800 font-bold rounded-xl hover:bg-red-200 transition-colors"
                  onClick={() => handleModeration(review.id, "rejected")}
                >
                  <X size={16} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
