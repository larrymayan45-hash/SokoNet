/**
 * Earnings Dashboard
 * Shows worker earnings insights and performance
 */

import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiDollarSign, FiClock, FiShield } from 'react-icons/fi';
import axios from 'axios';

export default function EarningsDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get('/api/dashboard/income');
      setDashboard(res.data.dashboard);
    } catch (error) {
      console.error('Error fetching earnings dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Earnings</h1>
          <p className="text-gray-600">Review your income and trust metrics.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <FiDollarSign className="text-green-600 text-2xl" />
              <div>
                <div className="text-sm text-gray-500">Total Earnings</div>
                <div className="text-2xl font-semibold text-gray-800">KES {dashboard?.totalEarnings || 0}</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <FiTrendingUp className="text-blue-600 text-2xl" />
              <div>
                <div className="text-sm text-gray-500">This Month</div>
                <div className="text-2xl font-semibold text-gray-800">KES {dashboard?.thisMonthEarnings || 0}</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <FiShield className="text-purple-600 text-2xl" />
              <div>
                <div className="text-sm text-gray-500">Escrow Balance</div>
                <div className="text-2xl font-semibold text-gray-800">KES {dashboard?.escrowBalance || 0}</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <FiClock className="text-yellow-600 text-2xl" />
              <div>
                <div className="text-sm text-gray-500">Completed Jobs</div>
                <div className="text-2xl font-semibold text-gray-800">{dashboard?.completedJobs || 0}</div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">Loading dashboard...</div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <div className="text-sm text-gray-500">Average Rating</div>
                <div className="text-3xl font-semibold text-gray-800">{dashboard?.averageRating?.toFixed(1) || '0.0'}</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-sm text-gray-500">Trust Score</div>
                <div className="text-3xl font-semibold text-gray-800">{dashboard?.trustScore || 0}</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-sm text-gray-500">Active Jobs</div>
                <div className="text-3xl font-semibold text-gray-800">{dashboard?.completedJobs || 0}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}