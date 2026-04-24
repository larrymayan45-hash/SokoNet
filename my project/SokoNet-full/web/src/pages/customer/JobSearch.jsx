/**
 * Job Search Page
 * Allows customers to search for services and convert to jobs
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiMapPin, FiFilter } from 'react-icons/fi';
import axios from 'axios';

export default function JobSearchPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    'plumbing', 'cleaning', 'delivery', 'handyman',
    'beauty', 'tutoring', 'transport', 'custom'
  ];

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (category) params.append('category', category);
      if (location) params.append('location', location);

      const res = await axios.get(`/api/jobs/search?${params}`);
      setResults(res.data.jobs);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const convertToJob = async (service) => {
    try {
      const jobData = {
        title: service.title,
        description: service.description,
        category: service.category,
        location: {
          latitude: service.location?.coordinates[1] || 0,
          longitude: service.location?.coordinates[0] || 0,
          address: service.address,
          city: service.city
        },
        budget: service.budget
      };

      const res = await axios.post('/api/jobs', jobData);
      navigate(`/customer/job/${res.data.job._id}`);
    } catch (error) {
      console.error('Job creation error:', error);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [category]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Find Services</h1>
          <p className="text-gray-600">Search for service providers in your area</p>
        </div>

        {/* Search Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="What service do you need?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            onClick={handleSearch}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FiSearch className="inline mr-2" />
            Search
          </button>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : results.length > 0 ? (
            results.map((service) => (
              <div key={service._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{service.title}</h3>
                    <p className="text-gray-600 mt-1">{service.description}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {service.category}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiMapPin className="w-4 h-4" />
                    {service.city}
                  </div>
                  <div className="text-gray-600">
                    Budget: KES {service.budget?.min} - {service.budget?.max}
                  </div>
                </div>

                <button
                  onClick={() => convertToJob(service)}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Convert to Job
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No services found. Try adjusting your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}