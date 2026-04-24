/**
 * My Bids Page
 * Shows worker bids and current bid status
 */

import React, { useState, useEffect } from 'react';
import { FiArrowRightCircle, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';
import axios from 'axios';

export default function MyBidsPage() {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBids();
  }, []);

  const fetchBids = async () => {
    try {
      const res = await axios.get('/api/bids/my-bids');
      setBids(res.data.bids);
    } catch (error) {
      console.error('Error fetching bids:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Bids</h1>
          <p className="text-gray-600">Track all bids you have placed and their status.</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {loading ? (
            <p className="text-gray-500">Loading bids...</p>
          ) : bids.length > 0 ? (
            <div className="space-y-4">
              {bids.map((bid) => (
                <div key={bid._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">{bid.jobId?.title || 'Job request'}</h2>
                      <p className="text-sm text-gray-600">Bid: KES {bid.bidAmount}</p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      {bid.status === 'pending' && <span className="text-yellow-600">Pending</span>}
                      {bid.status === 'accepted' && <span className="text-green-600">Accepted</span>}
                      {bid.status === 'rejected' && <span className="text-red-600">Rejected</span>}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2"><FiClock />{new Date(bid.createdAt).toLocaleDateString()}</div>
                    <div className="flex items-center gap-2"><FiArrowRightCircle />{bid.proposedDuration || 'N/A'}</div>
                    {bid.status === 'accepted' && (
                      <div className="flex items-center gap-2"><FiCheckCircle />Accepted</div>
                    )}
                    {bid.status === 'rejected' && (
                      <div className="flex items-center gap-2"><FiXCircle />Rejected</div>
                    )}
                  </div>
                  {bid.message && <p className="text-sm text-gray-700 mt-3">"{bid.message}"</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">You have not placed any bids yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}