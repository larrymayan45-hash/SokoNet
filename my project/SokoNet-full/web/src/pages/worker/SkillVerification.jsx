/**
 * Skill Verification Page
 * Workers can upload proof and request verification for their skills
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiUpload, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

export default function SkillVerificationPage() {
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSkillSuggestions();
  }, []);

  const fetchSkillSuggestions = async () => {
    try {
      const res = await axios.get('/api/jobs/skills-to-learn');
      setSkills(res.data.suggestions || []);
    } catch (error) {
      console.error('Error fetching skill suggestions:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSkill || !proofFile) {
      return alert('Please select a skill and upload proof.');
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('skill', selectedSkill);
      formData.append('proof', proofFile);

      await axios.post('/api/skills/verify', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Verification request submitted.');
      setSelectedSkill('');
      setProofFile(null);
    } catch (error) {
      console.error('Skill verification error:', error);
      alert('Could not submit verification request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Skill Verification</h1>
          <p className="text-gray-600">Upload evidence to build trust and get verified.</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Skill</label>
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a skill</option>
                {skills.map((skill) => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Proof</label>
              <label className="flex items-center gap-3 p-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg cursor-pointer">
                <FiUpload className="text-blue-600 text-xl" />
                <span>{proofFile ? proofFile.name : 'Choose an image or video proof'}</span>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => setProofFile(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Verification'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <FiCheckCircle className="text-blue-600" />
              <span className="font-semibold text-gray-800">Why verify?</span>
            </div>
            <p className="text-gray-600">
              Verified skills boost trust, increase bid acceptance, and unlock premium opportunity streams.
            </p>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 rounded-lg text-yellow-800 border border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <FiAlertTriangle />
              <span className="font-semibold">Tip</span>
            </div>
            <p>Upload clear evidence such as a clean service invoice, work photo, or product label.</p>
          </div>
        </div>
      </div>
    </div>
  );
}