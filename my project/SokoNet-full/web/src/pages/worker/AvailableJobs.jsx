/**
 * Available Jobs Page
 * Lists jobs that workers can bid on
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiTrendingUp, FiClock } from 'react-icons/fi';
import axios from 'axios';

export default function AvailableJobsPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAvailableJobs();
  }, []);

  const fetchAvailableJobs = async () => {
    setLoading(true);
    try {
      const position = await getCurrentPosition();
      const res = await axios.get(`/api/jobs/nearby?latitude=${position.latitude}&longitude=${position.longitude}&radius=10`);
      setJobs(res.data.jobs);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => resolve(coords),
        (err) => reject(err),
        { enableHighAccuracy: true }
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Available Jobs</h1>
          <p className="text-gray-600">Browse nearby service requests and place your bid.</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {loading ? (
            <p className="text-gray-500">Loading jobs...</p>
          ) : jobs.length > 0 ? (
            <div className="space-y-4">
              {jobs.map(job => (
                <div
                  key={job._id}
                  className="border rounded-lg p-4 hover:bg-blue-50 transition cursor-pointer"
                  onClick={() => navigate(`/worker/job/${job._id}/bid`)}
                >
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
                    <span className="text-sm text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                      {job.urgency}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{job.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2"><FiMapPin />{job.city}</div>
                    <div className="flex items-center gap-2"><FiTrendingUp />KES {job.budget?.max}</div>
                    <div className="flex items-center gap-2"><FiClock />{new Date(job.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No available jobs near you right now.</p>
          )}
        </div>
      </div>
    </div>
  );
}