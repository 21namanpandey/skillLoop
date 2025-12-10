import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import { 
  FaStar, 
  FaUser, 
  FaCalendarAlt, 
  FaArrowLeft,
  FaComment,
  FaThumbsUp,
  FaTag
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const Reviews = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('received');
  const [reviewsGiven, setReviewsGiven] = useState([]);
  const [reviewsReceived, setReviewsReceived] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    distribution: []
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/reviews/my');
      
      setReviewsGiven(response.reviewsGiven || []);
      setReviewsReceived(response.reviewsReceived || []);
      
      // Calculate stats from received reviews
      if (response.reviewsReceived?.length > 0) {
        const total = response.reviewsReceived.length;
        const average = response.reviewsReceived.reduce((sum, r) => sum + r.rating, 0) / total;
        
        const distribution = [1,2,3,4,5].map(star => ({
          star,
          count: response.reviewsReceived.filter(r => r.rating === star).length,
          percentage: (response.reviewsReceived.filter(r => r.rating === star).length / total * 100).toFixed(1)
        }));
        
        setStats({
          averageRating: average.toFixed(1),
          totalReviews: total,
          distribution
        });
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const reviewsToShow = activeTab === 'given' ? reviewsGiven : reviewsReceived;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reviews</h1>
          <p className="text-gray-600">Manage your reviews and ratings</p>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="text-4xl font-bold text-yellow-600 mb-2">{stats.averageRating}</div>
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar 
                    key={i} 
                    className={i < Math.floor(stats.averageRating) ? "text-yellow-400" : "text-gray-300"} 
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">Average Rating</p>
            </div>
            
            <div className="text-center p-4">
              <div className="text-4xl font-bold text-blue-600 mb-2">{stats.totalReviews}</div>
              <div className="text-6xl mb-2">⭐</div>
              <p className="text-sm text-gray-600">Total Reviews</p>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold mb-3">Rating Distribution</h3>
              <div className="space-y-2">
                {stats.distribution.map((item) => (
                  <div key={item.star} className="flex items-center">
                    <div className="w-12 text-sm">{item.star} stars</div>
                    <div className="flex-1 ml-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-400 h-2 rounded-full" 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-12 text-right text-sm">{item.count}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('received')}
                className={`flex-1 py-4 px-6 text-center font-medium text-sm ${
                  activeTab === 'received'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FaThumbsUp className="inline mr-2" />
                Reviews Received
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                  {reviewsReceived.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('given')}
                className={`flex-1 py-4 px-6 text-center font-medium text-sm ${
                  activeTab === 'given'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FaComment className="inline mr-2" />
                Reviews Given
                <span className="ml-2 bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                  {reviewsGiven.length}
                </span>
              </button>
            </nav>
          </div>

          {/* Reviews List */}
          <div className="p-6">
            {reviewsToShow.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">
                  {activeTab === 'received' ? '📭' : '📤'}
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {activeTab === 'received' ? 'No reviews received yet' : 'No reviews given yet'}
                </h3>
                <p className="text-gray-500">
                  {activeTab === 'received' 
                    ? 'Complete more sessions to receive reviews'
                    : 'Review your completed sessions to help others'}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviewsToShow.map((review) => (
                  <div key={review._id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <FaUser className="text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-bold">
                              {activeTab === 'received' ? review.reviewerId?.name : review.reviewedId?.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {review.sessionId?.serviceName} • {review.sessionId?.category}
                            </p>
                          </div>
                        </div>
                        
                        {/* Rating Stars */}
                        <div className="flex items-center mb-3">
                          {[...Array(5)].map((_, i) => (
                            <FaStar 
                              key={i} 
                              className={i < review.rating ? "text-yellow-400" : "text-gray-300"} 
                            />
                          ))}
                          <span className="ml-2 text-sm font-medium">
                            {review.rating}.0
                          </span>
                          <span className="ml-3 text-sm text-gray-500">
                            <FaCalendarAlt className="inline mr-1" />
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                          {review.isVerified && (
                            <span className="ml-3 inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                              Verified
                            </span>
                          )}
                        </div>
                        
                        {/* Review Comment */}
                        {review.comment && (
                          <div className="mb-4">
                            <p className="text-gray-700">{review.comment}</p>
                          </div>
                        )}
                        
                        {/* Tags */}
                        {review.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {review.tags.map((tag, idx) => (
                              <span 
                                key={idx} 
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                              >
                                <FaTag className="mr-1" size={10} />
                                {tag.replace('_', ' ')}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4 md:mt-0 md:ml-4">
                        <Link
                          to={`/sessions/${review.sessionId?._id}`}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          View Session →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;