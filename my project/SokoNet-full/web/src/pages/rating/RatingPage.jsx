/**
 * Rating Page
 * Allows a user to rate another user after job completion
 */

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function RatingPage() {
  const { userId } = useParams();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submitRating = async () => {
    if (rating === 0) return;

    try {
      await axios.post('/api/ratings', {
        workerId: userId,
        rating,
        review
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Rating error:', error);
      alert('Failed to submit rating');
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Thank you!</h1>
          <p className="text-gray-600">Your feedback has been recorded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Rate Your Worker</h1>
        <div className="mb-6">
          <p className="text-gray-600">Leave a star rating and optional review for user ID {userId}.</p>
        </div>

        <div className="mb-6">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                className={`text-4xl ${value <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <textarea
            rows="5"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Write your review..."
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={submitRating}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          disabled={rating === 0}
        >
          Submit Rating
        </button>
      </div>
    </div>
  );
}