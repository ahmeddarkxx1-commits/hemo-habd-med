"use client";

import { useState } from "react";
import { Star, Loader2 } from "lucide-react";

interface Review {
  _id?: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export default function ProductReviews({ productId, initialReviews = [] }: { productId: string; initialReviews?: Review[] }) {
  const safeInitialReviews = Array.isArray(initialReviews) ? initialReviews : [];
  const [reviews, setReviews] = useState<Review[]>(safeInitialReviews);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    userName: "",
    rating: 5,
    comment: ""
  });

  const safeReviews = Array.isArray(reviews) ? reviews : [];
  
  const averageRating = safeReviews.length > 0 
    ? (safeReviews.reduce((acc, r) => acc + r.rating, 0) / safeReviews.length).toFixed(1)
    : "5.0";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userName || !formData.comment) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        const newReviews = Array.isArray(data.data) ? data.data : (data.reviews ? data.reviews : []);
        setReviews(newReviews);
        setShowForm(false);
        setFormData({ userName: "", rating: 5, comment: "" });
      } else {
        alert("فشل إضافة التقييم: " + data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-24 pt-16 border-t border-sand-200">
      <h2 className="font-serif text-3xl font-semibold mb-8 text-foreground">تقييمات العملاء</h2>
      <div className="flex flex-col md:flex-row gap-12">
        {/* Rating Summary */}
        <div className="w-full md:w-1/3 bg-sand-50 p-8 rounded-2xl flex flex-col items-center justify-center text-center h-fit">
          <span className="text-5xl font-bold text-foreground mb-2">{averageRating}</span>
          <div className="flex gap-1 text-rose-500 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} size={20} fill={star <= Number(averageRating) ? "currentColor" : "none"} strokeWidth={star <= Number(averageRating) ? 0 : 2} />
            ))}
          </div>
          <span className="text-foreground/60 text-sm">بناءً على {safeReviews.length} تقييم</span>
        </div>

        {/* Reviews List */}
        <div className="w-full md:w-2/3 space-y-8">
          {safeReviews.length === 0 ? (
            <p className="text-foreground/60 text-center py-8">لا توجد تقييمات حتى الآن. كن أول من يقيّم هذا المنتج!</p>
          ) : (
            safeReviews.map((review, i) => (
              <div key={review._id || i} className="border-b border-sand-100 pb-8 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-foreground">{review.userName}</h4>
                    <div className="flex gap-1 text-rose-500 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={14} fill={star <= review.rating ? "currentColor" : "none"} strokeWidth={star <= review.rating ? 0 : 2} />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-foreground/50">
                    {new Date(review.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
                <p className="text-foreground/80 mt-3 text-sm leading-relaxed">{review.comment}</p>
              </div>
            ))
          )}

          {!showForm ? (
            <button 
              onClick={() => setShowForm(true)}
              className="w-full py-4 border-2 border-foreground text-foreground rounded-full font-medium hover:bg-foreground hover:text-white transition-colors"
            >
              كتابة تقييم
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="bg-sand-50 p-6 rounded-2xl space-y-4">
              <h3 className="font-semibold text-lg mb-4">أضف تقييمك</h3>
              
              <div>
                <label className="block text-sm mb-2 text-foreground/80">الاسم</label>
                <input 
                  type="text" 
                  required
                  value={formData.userName}
                  onChange={(e) => setFormData({...formData, userName: e.target.value})}
                  className="w-full bg-white border border-sand-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-rose-300"
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-foreground/80">التقييم</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({...formData, rating: star})}
                      className="text-rose-500 hover:scale-110 transition-transform"
                    >
                      <Star size={24} fill={star <= formData.rating ? "currentColor" : "none"} strokeWidth={star <= formData.rating ? 0 : 2} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2 text-foreground/80">رأيك في المنتج</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.comment}
                  onChange={(e) => setFormData({...formData, comment: e.target.value})}
                  className="w-full bg-white border border-sand-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-rose-300 resize-none"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 bg-foreground text-white rounded-xl py-3 font-medium hover:bg-rose-500 transition-colors flex justify-center items-center gap-2"
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                  إرسال التقييم
                </button>
                <button 
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 border border-sand-200 rounded-xl font-medium hover:bg-white transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
