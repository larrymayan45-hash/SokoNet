/**
 * Job Bidding Page
 * Worker can submit a bid for a job
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiDollarSign, FiClock, FiMapPin } from 'react-icons/fi';
import axios from 'axios';

export default function JobBiddingPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [message, setMessage] = useState('');
  const [duration, setDuration] = useState('2 days');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const fetchJob = async () => {
    try {
      const res = await axios.get(`/api/jobs/details/${jobId}`);
      setJob(res.data.job);
    } catch (error) {
      console.error('Error fetching job:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitBid = async () => {
    try {
      await axios.post('/api/bids', {
        jobId,
        bidAmount,
        proposedDuration: duration,
        message
      });
      alert('Bid submitted successfully');
      navigate('/worker/my-bids');
    } catch (error) {
      console.error('Bid error:', error);
      alert('Failed to submit bid.');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate(-1)} className="text-blue-600 mb-4 flex items-center gap-2">
          <FiChevronLeft /> Back
        </button>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-semibold text-gray-800 mb-3">{job?.title}</h1>
          <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
            <span className="flex items-center gap-1"><FiMapPin />{job?.city}</span>
            <span className="flex items-center gap-1"><FiDollarSign />KES {job?.budget?.max}</span>
            <span className="flex items-center gap-1"><FiClock />{job?.urgency}</span>
          </div>
          <p className="text-gray-700 mb-6">{job?.description}</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Your Bid Amount (KES)</label>
              <input
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                type="number"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 1500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Proposed Duration</label>
              <input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="4"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Tell the customer why you are the best fit"
              />
            </div>

            <button
              onClick={submitBid}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Submit Bid
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}