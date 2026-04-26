"use client";

import { useState } from "react";
import { Star, MessageSquare, Search, Filter } from "lucide-react";
import "@/components/seller/seller.css";

// Mock Data
const MOCK_REVIEWS = [
  {
    id: "1",
    productTitle: "Sony WH-1000XM5 Wireless Headphones",
    authorName: "John Doe",
    rating: 4,
    title: "Great sound, but...",
    body: "The sound quality is amazing, but the headband gets uncomfortable after a few hours of use.",
    date: "2024-03-10",
    sellerResponse: null,
  },
  {
    id: "2",
    productTitle: "Bose QuietComfort Earbuds II",
    authorName: "Jane Smith",
    rating: 5,
    title: "Best ANC ever",
    body: "Noise cancellation is out of this world.",
    date: "2024-03-08",
    sellerResponse: "Thank you Jane! We're glad you love the ANC.",
  }
];

export default function SellerReviewsPage() {
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleReply = async (reviewId: string) => {
    if (!responseText.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/seller/reviews/${reviewId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: responseText })
      });
      if (res.ok) {
        setReviews(reviews.map(r => r.id === reviewId ? { ...r, sellerResponse: responseText } : r));
        setReplyingTo(null);
        setResponseText("");
      }
    } catch (e) {
      alert("Failed to submit response.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="seller-page">
      <header className="seller-header">
        <div>
          <h1 className="seller-title">Product Reviews</h1>
          <p className="text-muted-foreground mt-1">Manage and respond to customer reviews.</p>
        </div>
      </header>

      <div className="form-card !p-0">
        <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
          <div className="search-bar" style={{ maxWidth: 300, margin: 0 }}>
            <Search className="search-bar__icon" size={16} />
            <input type="text" className="search-bar__input !bg-white" placeholder="Search reviews..." />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-border bg-white rounded-lg text-sm font-bold">
            <Filter size={16} /> Filter
          </button>
        </div>

        <div className="divide-y divide-border">
          {reviews.map(review => (
            <div key={review.id} className="p-6 hover:bg-muted/10 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg">{review.title}</h3>
                  <p className="text-xs font-bold text-brand">{review.productTitle}</p>
                </div>
                <span className="text-sm text-muted-foreground">{review.date}</span>
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                <div className="flex text-brand">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className={i < review.rating ? "fill-brand" : "text-muted-foreground opacity-30"} />
                  ))}
                </div>
                <span className="text-sm font-semibold text-muted-foreground">by {review.authorName}</span>
              </div>

              <p className="text-sm text-gray-700 mb-4">{review.body}</p>

              {review.sellerResponse ? (
                <div className="bg-muted p-4 rounded-xl border-l-4 border-brand">
                  <p className="text-xs font-bold uppercase tracking-wider mb-1 text-muted-foreground">Your Response</p>
                  <p className="text-sm">{review.sellerResponse}</p>
                </div>
              ) : replyingTo === review.id ? (
                <div className="mt-4">
                  <textarea 
                    className="form-textarea w-full mb-2 bg-white" 
                    placeholder="Write your response..."
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                  />
                  <div className="flex justify-end gap-2">
                    <button className="px-4 py-2 rounded-lg font-bold border border-border" onClick={() => setReplyingTo(null)}>Cancel</button>
                    <button className="btn-primary !py-2" disabled={submitting} onClick={() => handleReply(review.id)}>
                      {submitting ? "Submitting..." : "Post Response"}
                    </button>
                  </div>
                </div>
              ) : (
                <button className="text-sm font-bold text-brand hover:underline flex items-center gap-1" onClick={() => setReplyingTo(review.id)}>
                  <MessageSquare size={14} /> Respond to Review
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
