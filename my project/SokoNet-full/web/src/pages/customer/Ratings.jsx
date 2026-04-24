/**
 * Ratings Page
 * Allows customers to rate completed jobs and workers
 */

import React, { useState, useEffect } from 'react';
import { FiStar, FiUser, FiMessageSquare } from 'react-icons/fi';
import axios from 'axios';

export default function RatingsPage() {
  const [completedJobs, setCompletedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  useEffect(() => {
    fetchCompletedJobs();
  }, []);

  const fetchCompletedJobs = async () => {
    try {
      const res = await axios.get('/api/jobs/my-jobs?status=completed');
      setCompletedJobs(res.data.jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitRating = async () => {
    if (!selectedJob || rating === 0) return;

    try {
      await axios.post('/api/ratings', {
        jobId: selectedJob._id,
        workerId: selectedJob.acceptedWorkerId,
        rating,
        review
      });

      setSelectedJob(null);
      setRating(0);
      setReview('');
      fetchCompletedJobs(); // Refresh list
    } catch (error) {
      console.error('Rating submission error:', error);
    }
  };

  const StarRating = ({ value, onChange, readonly = false }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !readonly && onChange(star)}
            className={`text-2xl ${star <= value ? 'text-yellow-400' : 'text-gray-300'} ${readonly ? 'cursor-default' : 'cursor-pointer hover:text-yellow-400'} transition`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Rate Your Experience</h1>
          <p className="text-gray-600">Help improve SokoNet by rating completed jobs</p>
        </div>

        {/* Rating Modal */}
        {selectedJob && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Rate Job: {selectedJob.title}</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <StarRating value={rating} onChange={setRating} />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Review (Optional)</label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Share your experience..."
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={submitRating}
                  disabled={rating === 0}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  Submit Rating
                </button>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Completed Jobs List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Completed Jobs</h2>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : completedJobs.length > 0 ? (
            <div className="space-y-4">
              {completedJobs.map((job) => (
                <div key={job._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">{job.title}</h3>
                      <p className="text-gray-600 text-sm">{job.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <FiUser className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-500">Worker ID: {job.acceptedWorkerId}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 mb-2">
                        Completed: {new Date(job.completedAt).toLocaleDateString()}
                      </div>
                      {job.customerRating ? (
                        <div className="flex items-center gap-2">
                          <StarRating value={job.customerRating.rating} readonly />
                          <span className="text-sm text-gray-600">Rated</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedJob(job)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
                        >
                          Rate Job
                        </button>
                      )}
                    </div>
                  </div>

                  {job.customerRating && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <FiMessageSquare className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Your Review</span>
                      </div>
                      <p className="text-sm text-gray-600">{job.customerRating.review}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No completed jobs to rate yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}