import apiService from './apiService';

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title?: string;
  comment?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface CreateReviewData {
  productId: string;
  rating: number;
  title?: string;
  comment?: string;
}

export interface UpdateReviewData {
  rating?: number;
  title?: string;
  comment?: string;
}

class ReviewService {
  // Get reviews for a product
  async getProductReviews(
    productId: string,
    params: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    } = {}
  ): Promise<{
    success: boolean;
    data?: {
      reviews: Review[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
      averageRating: number;
      totalReviews: number;
    };
    error?: string;
  }> {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const response = await apiService.request<{
        reviews: Review[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          pages: number;
        };
        averageRating: number;
        totalReviews: number;
      }>(`/reviews/product/${productId}?${queryParams.toString()}`);
      
      return response;
    } catch (error) {
      console.error('Failed to get product reviews:', error);
      return { success: false, error: 'Failed to get product reviews' };
    }
  }

  // Get user's reviews
  async getUserReviews(
    params: {
      page?: number;
      limit?: number;
    } = {}
  ): Promise<{
    success: boolean;
    data?: {
      reviews: Review[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    };
    error?: string;
  }> {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());

      const response = await apiService.request<{
        reviews: Review[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          pages: number;
        };
      }>(`/reviews/user?${queryParams.toString()}`);
      
      return response;
    } catch (error) {
      console.error('Failed to get user reviews:', error);
      return { success: false, error: 'Failed to get user reviews' };
    }
  }

  // Create a review
  async createReview(reviewData: CreateReviewData): Promise<{
    success: boolean;
    data?: { review: Review };
    error?: string;
  }> {
    try {
      const response = await apiService.request<{ review: Review }>('/reviews', {
        method: 'POST',
        body: JSON.stringify(reviewData)
      });
      
      return response;
    } catch (error) {
      console.error('Failed to create review:', error);
      return { success: false, error: 'Failed to create review' };
    }
  }

  // Update a review
  async updateReview(
    reviewId: string,
    reviewData: UpdateReviewData
  ): Promise<{
    success: boolean;
    data?: { review: Review };
    error?: string;
  }> {
    try {
      const response = await apiService.request<{ review: Review }>(`/reviews/${reviewId}`, {
        method: 'PUT',
        body: JSON.stringify(reviewData)
      });
      
      return response;
    } catch (error) {
      console.error('Failed to update review:', error);
      return { success: false, error: 'Failed to update review' };
    }
  }

  // Delete a review
  async deleteReview(reviewId: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const response = await apiService.request(`/reviews/${reviewId}`, {
        method: 'DELETE'
      });
      
      return response;
    } catch (error) {
      console.error('Failed to delete review:', error);
      return { success: false, error: 'Failed to delete review' };
    }
  }

  // Get review statistics for a product
  async getReviewStats(productId: string): Promise<{
    success: boolean;
    data?: ReviewStats;
    error?: string;
  }> {
    try {
      const response = await apiService.request<ReviewStats>(`/reviews/stats/${productId}`);
      
      return response;
    } catch (error) {
      console.error('Failed to get review stats:', error);
      return { success: false, error: 'Failed to get review stats' };
    }
  }

  // Check if user can review a product
  async canUserReview(productId: string): Promise<{
    success: boolean;
    data?: { canReview: boolean; hasReviewed: boolean };
    error?: string;
  }> {
    try {
      // Check if user has already reviewed
      const userReviewsResponse = await this.getUserReviews({ limit: 1000 });
      
      if (!userReviewsResponse.success || !userReviewsResponse.data) {
        return { success: false, error: 'Failed to check review status' };
      }

      const hasReviewed = userReviewsResponse.data.reviews.some(
        review => review.productId === productId
      );

      return {
        success: true,
        data: {
          canReview: !hasReviewed,
          hasReviewed
        }
      };
    } catch (error) {
      console.error('Failed to check if user can review:', error);
      return { success: false, error: 'Failed to check review status' };
    }
  }
}

export default new ReviewService();
