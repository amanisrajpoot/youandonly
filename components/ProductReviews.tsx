import React, { useState, useEffect } from 'react';
import { StarIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';
import reviewService, { Review, ReviewStats, CreateReviewData } from '../services/reviewService';

interface ProductReviewsProps {
  productId: string;
  productName: string;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, productName }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [sortBy, setSortBy] = useState<'createdAt' | 'rating'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Review form state
  const [reviewForm, setReviewForm] = useState<CreateReviewData>({
    productId,
    rating: 5,
    title: '',
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadReviews();
    loadStats();
    if (user) {
      checkCanReview();
    }
  }, [productId, user, currentPage, sortBy, sortOrder]);

  const loadReviews = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await reviewService.getProductReviews(productId, {
        page: currentPage,
        limit: 10,
        sortBy,
        sortOrder
      });
      
      if (response.success && response.data) {
        setReviews(response.data.reviews);
        setTotalPages(response.data.pagination.pages);
      } else {
        setError(response.error || 'Failed to load reviews');
      }
    } catch (err) {
      setError('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await reviewService.getReviewStats(productId);
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Failed to load review stats:', err);
    }
  };

  const checkCanReview = async () => {
    if (!user) return;
    
    try {
      const response = await reviewService.canUserReview(productId);
      if (response.success && response.data) {
        setCanReview(response.data.canReview);
        setHasReviewed(response.data.hasReviewed);
      }
    } catch (err) {
      console.error('Failed to check review status:', err);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please log in to write a review');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await reviewService.createReview(reviewForm);
      
      if (response.success) {
        setShowReviewForm(false);
        setReviewForm({
          productId,
          rating: 5,
          title: '',
          comment: ''
        });
        setCanReview(false);
        setHasReviewed(true);
        loadReviews();
        loadStats();
      } else {
        setError(response.error || 'Failed to submit review');
      }
    } catch (err) {
      setError('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5'
    };

    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderRatingDistribution = () => {
    if (!stats) return null;

    return (
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution];
          const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
          
          return (
            <div key={rating} className="flex items-center space-x-2">
              <span className="text-body-sm text-secondary w-2">{rating}</span>
              <StarIcon className="w-3 h-3 text-yellow-400 fill-current" />
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-body-sm text-secondary w-8">{count}</span>
            </div>
          );
        })}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-heading-3 text-primary">Customer Reviews</h3>
        {user && canReview && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Review Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <div className="flex items-center space-x-4 mb-4">
              <div className="text-3xl font-bold text-primary">
                {stats.averageRating.toFixed(1)}
              </div>
              <div>
                {renderStars(Math.round(stats.averageRating), 'lg')}
                <p className="text-body-sm text-secondary mt-1">
                  Based on {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-heading-4 text-primary mb-3">Rating Distribution</h4>
            {renderRatingDistribution()}
          </div>
        </div>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <div className="border border-light rounded-lg p-6 mb-6">
          <h4 className="text-heading-4 text-primary mb-4">Write a Review</h4>
          <form onSubmit={handleSubmitReview}>
            <div className="mb-4">
              <label className="block text-body-sm font-medium text-primary mb-2">
                Rating *
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                    className="focus:outline-none"
                  >
                    <StarIcon
                      className={`w-6 h-6 ${
                        star <= reviewForm.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-body-sm font-medium text-primary mb-2">
                Title (optional)
              </label>
              <input
                type="text"
                value={reviewForm.title}
                onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="Summarize your experience"
                maxLength={100}
              />
            </div>

            <div className="mb-6">
              <label className="block text-body-sm font-medium text-primary mb-2">
                Comment (optional)
              </label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                className="w-full px-3 py-2 border border-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                rows={4}
                placeholder="Share your thoughts about this product"
                maxLength={1000}
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-accent hover:bg-accent-hover text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="bg-gray-200 hover:bg-gray-300 text-primary px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-error/10 border border-error text-error px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Sort Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <label className="text-body-sm font-medium text-primary">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'createdAt' | 'rating')}
            className="px-3 py-1 border border-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
          >
            <option value="createdAt">Date</option>
            <option value="rating">Rating</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            className="px-3 py-1 border border-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-body-lg text-secondary">No reviews yet</p>
          <p className="text-body-sm text-muted mt-2">
            Be the first to review this product!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-body-sm font-semibold text-primary">
                      {review.user.firstName[0]}{review.user.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-body-sm font-semibold text-primary">
                      {review.user.firstName} {review.user.lastName}
                    </p>
                    <div className="flex items-center space-x-2">
                      {renderStars(review.rating, 'sm')}
                      <span className="text-body-sm text-muted">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                      {review.isVerified && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {review.title && (
                <h5 className="text-heading-5 text-primary font-semibold mb-2">
                  {review.title}
                </h5>
              )}

              {review.comment && (
                <p className="text-body text-secondary leading-relaxed">
                  {review.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-8">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-light rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <span className="px-4 py-2 text-body-sm text-secondary">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-light rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
