import React, { useState } from 'react';
import { FaStar, FaTimes } from 'react-icons/fa';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-hot-toast';

const ReviewModal = ({ session, onClose, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const tags = [
    "punctual", "high-quality", "good_communication", 
    "skilled", "reliable", "friendly", "professional",
    "fast", "detailed", "helpful"
  ];

  const getSafeId = (obj) => {
    if (!obj) return null;
    return obj._id || obj.id || null;
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    try {
      setSubmitting(true);
      await axiosClient.post('/reviews', {
        sessionId: getSafeId(session),
        rating,
        comment,
        tags: selectedTags
      });
      
      toast.success('Review submitted successfully!');
      onReviewSubmitted();
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Rate Your Experience</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <FaTimes size={24} />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-gray-700 mb-2">Service: <span className="font-semibold">{session.serviceName}</span></p>
            <p className="text-gray-600 text-sm">Your feedback helps improve the community</p>
          </div>

          {/* Star Rating */}
          <div className="mb-6">
            <p className="text-gray-700 mb-3">How would you rate this service?</p>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-3xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  <FaStar />
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {rating === 5 ? 'Excellent' : 
               rating === 4 ? 'Good' : 
               rating === 3 ? 'Average' : 
               rating === 2 ? 'Poor' : 
               rating === 1 ? 'Very Poor' : 'Select a rating'}
            </p>
          </div>

          {/* Tags */}
          <div className="mb-6">
            <p className="text-gray-700 mb-3">Select tags that apply:</p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    if (selectedTags.includes(tag)) {
                      setSelectedTags(selectedTags.filter(t => t !== tag));
                    } else {
                      setSelectedTags([...selectedTags, tag]);
                    }
                  }}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Additional comments (optional):</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Share details about your experience..."
              maxLength="500"
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {comment.length}/500
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || rating === 0}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;