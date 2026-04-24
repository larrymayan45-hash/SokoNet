/**
 * Job Details Page
 * Shows detailed job information, bids, and progress
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiMapPin, FiClock, FiUser, FiTrendingUp, FiMessageSquare } from 'react-icons/fi';
import axios from 'axios';

export default function JobDetailsPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobDetails();
    fetchBids();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      const res = await axios.get(`/api/jobs/details/${jobId}`);
      setJob(res.data.job);
    } catch (error) {
      console.error('Error fetching job:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBids = async () => {
    try {
      const res = await axios.get(`/api/bids/job/${jobId}`);
      setBids(res.data.bids);
    } catch (error) {
      console.error('Error fetching bids:', error);
    }
  };

  const acceptBid = async (bidId) => {
    try {
      await axios.post(`/api/bids/${bidId}/accept`);
      fetchJobDetails(); // Refresh job status
    } catch (error) {
      console.error('Error accepting bid:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'posted': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!job) {
    return <div className="min-h-screen flex items-center justify-center">Job not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{job.title}</h1>
              <p className="text-gray-600">{job.description}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(job.status)}`}>
              {job.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <FiMapPin className="w-4 h-4" />
              {job.city}, {job.address}
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FiTrendingUp className="w-4 h-4" />
              KES {job.budget?.min} - {job.budget?.max}
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FiClock className="w-4 h-4" />
              {new Date(job.createdAt).toLocaleDateString()}
            </div>
          </div>

          {job.requiredSkills && job.requiredSkills.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold text-gray-800 mb-2">Required Skills:</h3>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map((skill, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Progress Tracking */}
        {job.status !== 'posted' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Job Progress</h2>
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{job.progressPercentage || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${job.progressPercentage || 0}%` }}
                ></div>
              </div>
            </div>

            {job.milestones && job.milestones.length > 0 && (
              <div className="space-y-2">
                {job.milestones.map((milestone, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${milestone.completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className={milestone.completed ? 'text-green-700' : 'text-gray-600'}>
                      {milestone.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bids Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Bids ({bids.length})</h2>

          {bids.length > 0 ? (
            <div className="space-y-4">
              {bids.map((bid) => (
                <div key={bid._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FiUser className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Worker {bid.workerId}</h3>
                        <p className="text-sm text-gray-600">
                          Rating: {bid.workerRating || 'New'} | Completed: {bid.workerJobsCompleted || 0} jobs
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">KES {bid.amount}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(bid.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {bid.proposal && (
                    <p className="text-gray-700 mb-3">{bid.proposal}</p>
                  )}

                  {bid.status === 'pending' && job.status === 'posted' && (
                    <button
                      onClick={() => acceptBid(bid._id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                      Accept Bid
                    </button>
                  )}

                  {bid.status === 'accepted' && (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      Accepted
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No bids yet. Workers will bid on your job soon.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}