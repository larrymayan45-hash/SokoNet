/**
 * Work Progress Page
 * Shows current job progress and milestones for workers
 */

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiCheckCircle, FiClock, FiTrendingUp } from 'react-icons/fi';
import axios from 'axios';

export default function WorkProgressPage() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const fetchJob = async () => {
    try {
      const res = await axios.get(`/api/jobs/details/${jobId}`);
      setJob(res.data.job);
    } catch (error) {
      console.error('Error fetching job progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (progress) => {
    try {
      await axios.put(`/api/jobs/${jobId}/status`, {
        status: progress === 100 ? 'completed' : 'in-progress',
        progressPercentage: progress,
        notes: `Progress updated to ${progress}%`
      });
      fetchJob();
    } catch (error) {
      console.error('Update progress error:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Work Progress</h1>
        <p className="text-gray-600 mb-6">Manage task completion and milestone updates.</p>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Progress</span>
            <span className="font-semibold text-gray-800">{job?.progressPercentage || 0}%</span>
          </div>
          <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
            <div
              className="h-3 bg-blue-600"
              style={{ width: `${job?.progressPercentage || 0}%` }}
            />
          </div>
        </div>

        {job?.milestones && job.milestones.length > 0 && (
          <div className="space-y-4 mb-6">
            {job.milestones.map((milestone, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-800">{milestone.title}</h3>
                    <p className="text-sm text-gray-600">{milestone.percentage}%</p>
                  </div>
                  <div className="text-sm font-semibold text-gray-700">
                    {milestone.completed ? 'Completed' : 'Open'}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{milestone.description || 'No description provided.'}</p>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-3">
          {[25, 50, 75, 100].map((progress) => (
            <button
              key={progress}
              onClick={() => updateProgress(progress)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Mark {progress}% Complete
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}