import { useState, useEffect } from "react";
import { submitReview, getMyReview, getCourseReviews } from "../../services/reviewService.js";
import axiosInstance from "../../services/axiosInstance.js";
import Spinner from "../ui/Spinner.jsx";
import StarRating from "../ui/StarRating.jsx";

export default function ReviewSection({ courseId, user, enrolled, cardClass = "bg-white dark:bg-surface rounded-xl shadow-sm border border-neutral-200 dark:border-border p-6" }) {
  const [myReview, setMyReview] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;
    let cancelled = false;

    async function fetchAverageRating() {
      try {
        const res = await axiosInstance.get(`/api/courses/${courseId}/reviews/average-rating`);
        const rating = res.data?.data ?? res.data;
        if (!cancelled && typeof rating === "number") setAverageRating(rating);
      } catch {
        // non-critical
      }
    }

    async function fetchReviews() {
      try {
        const allReviewsRes = await getCourseReviews(courseId);
        if (cancelled) return;
        const allReviews = allReviewsRes.data?.content || allReviewsRes.data || [];
        setReviews(Array.isArray(allReviews) ? allReviews : []);
      } catch {
        // non-critical
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (enrolled) {
      getMyReview(courseId)
        .then((res) => {
          if (cancelled) return;
          if (res.data) setMyReview(res.data);
        })
        .catch(() => {});
    }

    fetchAverageRating();
    fetchReviews();
    return () => { cancelled = true; };
  }, [courseId, enrolled]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (reviewRating === 0) {
      setReviewError("Please select a rating");
      return;
    }
    setSubmittingReview(true);
    setReviewError("");
    try {
      const res = await submitReview(courseId, {
        rating: reviewRating,
        comment: reviewComment,
      });
      setMyReview(res.data);
      setReviewRating(0);
      setReviewComment("");
    } catch (err) {
      setReviewError(err.response?.data?.message || "Failed to submit review");
      setSubmittingReview(false);
      return;
    }
    try {
      const allReviewsRes = await getCourseReviews(courseId);
      const allReviews = allReviewsRes.data?.content || allReviewsRes.data || [];
      setReviews(Array.isArray(allReviews) ? allReviews : []);
    } catch {
      // refresh of review list is non-critical
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="space-y-6">
      {averageRating !== null && (
        <div className={cardClass}>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">Course Rating</h2>
          <div className="flex items-center gap-3">
            <StarRating rating={Math.round(averageRating)} size="lg" filledColor="text-amber-400" />
            <span className="text-2xl font-bold text-neutral-900 dark:text-white">{averageRating.toFixed(1)}</span>
            <span className="text-sm text-muted">/ 5</span>
          </div>
        </div>
      )}

      {loading && reviews.length === 0 && <Spinner size="lg" className="py-10" />}

      {enrolled && !myReview && (
        <div className={cardClass}>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">Rate This Course</h2>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Your Rating</label>
              <StarRating rating={reviewRating} size="xl" interactive onRate={setReviewRating} filledColor="text-level-intermediate" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Comment (optional)</label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your thoughts about this course..."
                rows={3}
                maxLength={1000}
                className="w-full px-4 py-2.5 border border-neutral-300 dark:border-border rounded-lg focus:ring-2 focus:ring-accent outline-none bg-white dark:bg-surface text-neutral-900 dark:text-white transition-colors duration-150 resize-none"
              />
            </div>
            {reviewError && (
              <p className="text-sm text-level-advanced">{reviewError}</p>
            )}
            <button
              type="submit"
              disabled={submittingReview}
              className="bg-accent hover:bg-accent/80 text-white font-medium px-5 py-2.5 rounded-lg transition-colors duration-150 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submittingReview ? <Spinner size="sm" /> : "Submit Review"}
            </button>
          </form>
        </div>
      )}

      {myReview && (
        <div className={cardClass}>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">Your Review</h2>
          <div className="flex items-start gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-accent/80 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user?.name?.charAt(0).toUpperCase() || "?"}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-neutral-900 dark:text-white text-sm">{user?.name}</span>
                <span className="text-xs text-muted">
                  {new Date(myReview.createdAt).toLocaleDateString()}
                </span>
              </div>
              <StarRating rating={myReview.rating} size="md" filledColor="text-level-intermediate" />
              {myReview.comment && (
                <p className="text-sm text-neutral-600 dark:text-muted">{myReview.comment}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {reviews.length > 0 && (
        <div className={cardClass}>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">
            Reviews ({reviews.length})
          </h2>
          <div className="space-y-4 divide-y divide-neutral-100 dark:divide-border">
            {reviews.map((review) => (
              <div key={review.id} className="flex items-start gap-3 pt-4 first:pt-0">
                <div className="w-9 h-9 rounded-full bg-accent/80 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {review.studentName?.charAt(0).toUpperCase() || "?"}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-neutral-900 dark:text-white text-sm">{review.studentName}</span>
                    <span className="text-xs text-muted">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <StarRating rating={review.rating} size="sm" filledColor="text-level-intermediate" />
                  {review.comment && (
                    <p className="text-sm text-neutral-600 dark:text-muted">{review.comment}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
