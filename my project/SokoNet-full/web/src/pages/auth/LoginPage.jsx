/**
 * Login Page
 * Supports password login and OTP login by email or phone
 */

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthCtx } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthCtx);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('password');

  const isEmail = identifier.includes('@');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'password') {
        if (!identifier || !password) {
          toast.error('Identifier and password are required');
          return;
        }

        const res = await axios.post('/api/users/login', {
          identifier,
          password
        });

        login(res.data.token);
        toast.success('Welcome back!');
        navigate(res.data.user.userType === 'worker' ? '/worker/dashboard' : '/customer/dashboard');
      } else {
        if (!identifier) {
          toast.error('Email or phone is required for OTP');
          return;
        }

        const payload = isEmail ? { email: identifier } : { phone: identifier };
        await axios.post('/api/users/send-otp', payload);
        localStorage.setItem('authContact', identifier);
        localStorage.setItem('authContactType', isEmail ? 'email' : 'phone');
        navigate('/verify-otp');
        toast.success('OTP sent successfully');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Sign in to SokoNet</h1>
          <p className="text-gray-600">Choose password login or OTP verification.</p>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setMode('password')}
            className={`px-4 py-2 rounded-lg font-semibold ${mode === 'password' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            type="button"
          >
            Password
          </button>
          <button
            onClick={() => setMode('otp')}
            className={`px-4 py-2 rounded-lg font-semibold ${mode === 'otp' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            type="button"
          >
            OTP
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email or Phone</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="you@example.com or +254 700 123456"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          {mode === 'password' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Processing...' : mode === 'password' ? 'Login' : 'Send OTP'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="text-blue-600 hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
