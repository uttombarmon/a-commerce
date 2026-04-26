"use client";

import { useState } from "react";
import { X, Star, Upload, Image as ImageIcon, Camera } from "lucide-react";
import Image from "next/image";

export function ReviewFormModal({ 
  isOpen, 
  onClose,
  productId,
  productTitle
}: { 
  isOpen: boolean; 
  onClose: () => void;
  productId: string | number;
  productTitle: string;
}) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleImageUpload = () => {
    if (images.length >= 5) {
      alert("Maximum 5 photos allowed.");
      return;
    }
    // Mock upload
    const mockUrl = `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?w=200`;
    setImages([...images, mockUrl]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a star rating.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          rating,
          title,
          comment: body,
          pros,
          cons,
          images
        })
      });
      
      const data = await res.json();
      if (data.success) {
        alert("Review submitted successfully! It may take a few moments to appear.");
        onClose();
        // Reset form
        setRating(0);
        setTitle("");
        setBody("");
        setPros("");
        setCons("");
        setImages([]);
      } else {
        alert(data.error || "Failed to submit review");
      }
    } catch (error) {
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-border p-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold">Write a Review</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Product</p>
            <p className="font-bold">{productTitle}</p>
          </div>

          <div>
            <label className="block font-bold mb-2">Overall Rating *</label>
            <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1 transition-transform hover:scale-110"
                  onMouseEnter={() => setHoverRating(star)}
                  onClick={() => setRating(star)}
                >
                  <Star 
                    size={32} 
                    className={`${(hoverRating || rating) >= star ? "fill-brand text-brand" : "text-muted-foreground opacity-30"}`} 
                  />
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Click to rate</p>
          </div>

          <div>
            <label className="block font-bold mb-2">Review Title *</label>
            <input 
              required
              type="text" 
              className="w-full p-3 rounded-xl border border-border focus:ring-2 focus:ring-brand focus:outline-none"
              placeholder="Summarize your experience..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-bold mb-2">Review Body *</label>
            <textarea 
              required
              className="w-full p-3 rounded-xl border border-border focus:ring-2 focus:ring-brand focus:outline-none min-h-[120px]"
              placeholder="What did you like or dislike? What should other shoppers know?"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold mb-2 text-emerald-700">Pros (Optional)</label>
              <textarea 
                className="w-full p-3 rounded-xl border border-border focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="List the pros..."
                value={pros}
                onChange={(e) => setPros(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-bold mb-2 text-rose-700">Cons (Optional)</label>
              <textarea 
                className="w-full p-3 rounded-xl border border-border focus:ring-2 focus:ring-rose-500 focus:outline-none"
                placeholder="List the cons..."
                value={cons}
                onChange={(e) => setCons(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block font-bold mb-2 flex justify-between">
              <span>Add Photos (Optional)</span>
              <span className="text-sm font-normal text-muted-foreground">{images.length}/5</span>
            </label>
            <div className="flex gap-4 flex-wrap">
              {images.map((img, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-border group">
                  <Image src={img} alt="Upload preview" fill className="object-cover" />
                  <button 
                    type="button" 
                    onClick={() => removeImage(i)}
                    className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <button 
                  type="button" 
                  onClick={handleImageUpload}
                  className="w-20 h-20 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:bg-muted hover:text-brand hover:border-brand transition-colors"
                >
                  <Camera size={24} />
                </button>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-border flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-3 font-bold rounded-xl border border-border hover:bg-muted"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-6 py-3 font-bold rounded-xl bg-brand text-white hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
