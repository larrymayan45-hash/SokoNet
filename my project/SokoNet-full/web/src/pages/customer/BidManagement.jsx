/**
 * Bid Management Page
 * Allows customers to view and manage all bids on their jobs
 */

import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiUser, FiMessageSquare, FiCheck, FiX } from 'react-icons/fi';
import axios from 'axios';

export default function BidManagementPage() {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAllBids();
  }, []);

  const fetchAllBids = async () => {
    try {
      const res = await axios.get('/api/bids/my-jobs');
      setBids(res.data.bids);
    } catch (error) {
      console.error('Error fetching bids:', error);
    } finally {
      setLoading(false);
    }
  };

  const acceptBid = async (bidId) => {
    try {
      await axios.post(`/api/bids/${bidId}/accept`);
      fetchAllBids(); // Refresh bids
    } catch (error) {
      console.error('Error accepting bid:', error);
    }
  };

  const rejectBid = async (bidId) => {
    try {
      await axios.post(`/api/bids/${bidId}/reject`);
      fetchAllBids(); // Refresh bids
    } catch (error) {
      console.error('Error rejecting bid:', error);
    }
  };

  const filteredBids = bids.filter(bid => {
    if (filter === 'all') return true;
    return bid.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Bid Management</h1>
          <p className="text-gray-600">Review and manage bids on your jobs</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex gap-4">
            {['all', 'pending', 'accepted', 'rejected'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'All Bids' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Bids List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">Loading bids...</div>
          ) : filteredBids.length > 0 ? (
            filteredBids.map((bid) => (
              <div key={bid._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <FiUser className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Job: {bid.jobId?.title || 'Unknown Job'}
                      </h3>
                      <p className="text-gray-600">Worker ID: {bid.workerId}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-500">
                          Rating: {bid.workerRating || 'New'}
                        </span>
                        <span className="text-sm text-gray-500">
                          Jobs: {bid.workerJobsCompleted || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      KES {bid.amount}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(bid.status)}`}>
                      {bid.status}
                    </span>
                  </div>
                </div>

                {bid.proposal && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Proposal:</h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{bid.proposal}</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Bid placed: {new Date(bid.createdAt).toLocaleDateString()}
                  </div>

                  {bid.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => acceptBid(bid._id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                      >
                        <FiCheck className="w-4 h-4" />
                        Accept
                      </button>
                      <button
                        onClick={() => rejectBid(bid._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                      >
                        <FiX className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No bids found in this category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}