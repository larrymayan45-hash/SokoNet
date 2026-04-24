/**
 * Payment Page
 * Handles escrow payments and payment management
 */

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiCreditCard, FiShield, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';
import axios from 'axios';

export default function PaymentPage() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [escrow, setEscrow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (jobId) {
      fetchJobAndEscrow();
    }
  }, [jobId]);

  const fetchJobAndEscrow = async () => {
    try {
      const [jobRes, escrowRes] = await Promise.all([
        axios.get(`/api/jobs/details/${jobId}`),
        axios.get(`/api/escrow/job/${jobId}`)
      ]);
      setJob(jobRes.data.job);
      setEscrow(escrowRes.data.escrow);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const initiatePayment = async () => {
    setProcessing(true);
    try {
      const res = await axios.post('/api/payments/initiate', {
        jobId,
        amount: job.finalPrice || job.budget.max,
        paymentMethod: 'mpesa'
      });

      // Simulate M-Pesa STK push
      alert(`M-Pesa payment initiated. Check your phone for STK push. Reference: ${res.data.reference}`);

      fetchJobAndEscrow(); // Refresh data
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const releaseMilestone = async (milestoneIndex) => {
    try {
      await axios.post(`/api/escrow/${escrow._id}/release-milestone`, {
        milestoneIndex
      });
      fetchJobAndEscrow(); // Refresh data
    } catch (error) {
      console.error('Milestone release error:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment & Escrow</h1>
          <p className="text-gray-600">Secure payment handling for your job</p>
        </div>

        {job && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Job Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-800">{job.title}</h3>
                <p className="text-gray-600">{job.description}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  KES {job.finalPrice || job.budget?.max || 'TBD'}
                </div>
                <div className="text-sm text-gray-500">Final Amount</div>
              </div>
            </div>
          </div>
        )}

        {/* Escrow Status */}
        {escrow ? (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <FiShield className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-bold text-gray-800">Escrow Protection</h2>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Escrow Status</span>
                <span className="font-semibold capitalize">{escrow.status}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Total Amount</span>
                <span className="font-semibold">KES {escrow.totalAmount}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Released</span>
                <span className="font-semibold">KES {escrow.releasedAmount || 0}</span>
              </div>
            </div>

            {/* Milestones */}
            {escrow.milestones && escrow.milestones.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800">Payment Milestones</h3>
                {escrow.milestones.map((milestone, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-800">{milestone.title}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 font-semibold">KES {milestone.amount}</span>
                        {milestone.released ? (
                          <FiCheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <button
                            onClick={() => releaseMilestone(index)}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
                          >
                            Release
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{milestone.description}</p>
                    <div className="text-xs text-gray-500 mt-1">
                      Due: {new Date(milestone.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Payment Initiation */
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <FiCreditCard className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-800 mb-2">Initiate Payment</h2>
              <p className="text-gray-600 mb-6">
                Secure your job by placing funds in escrow. Payment will be released to the worker as work progresses.
              </p>

              <button
                onClick={initiatePayment}
                disabled={processing}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {processing ? 'Processing...' : 'Pay with M-Pesa'}
              </button>

              <div className="mt-4 text-sm text-gray-500">
                <FiShield className="inline w-4 h-4 mr-1" />
                Protected by SokoNet Escrow System
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}