/**
 * Profile Page
 * Shows profile details and quick account actions
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/users/profile');
      setProfile(res.data.user);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center">No profile found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700">
            {profile.firstName?.charAt(0) || 'U'}
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">{profile.firstName} {profile.lastName}</h1>
            <p className="text-gray-600">{profile.email || profile.phone}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-sm uppercase tracking-wide text-gray-500">User Type</h2>
              <p className="text-gray-800 font-semibold">{profile.userType}</p>
            </div>
            <div>
              <h2 className="text-sm uppercase tracking-wide text-gray-500">Location</h2>
              <p className="text-gray-800">{profile.city}, {profile.region}</p>
              <p className="text-gray-600">{profile.address}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h2 className="text-sm uppercase tracking-wide text-gray-500">Trust Score</h2>
              <p className="text-gray-800 font-semibold">{profile.trustScore || 0}</p>
            </div>
            <div>
              <h2 className="text-sm uppercase tracking-wide text-gray-500">Earnings</h2>
              <p className="text-gray-800">KES {profile.totalEarnings?.toLocaleString() || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}