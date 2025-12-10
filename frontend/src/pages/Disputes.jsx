import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { 
  FaExclamationTriangle, 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle,
  FaArrowLeft,
  FaFileAlt,
  FaUser
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const Disputes = () => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/disputes/my');
      setDisputes(response.disputes || []);
    } catch (error) {
      console.error('Error fetching disputes:', error);
      toast.error('Failed to load disputes');
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const config = {
      open: { 
        color: 'bg-yellow-100 text-yellow-800', 
        icon: <FaClock />, 
        label: 'Open',
        description: 'Waiting for review'
      },
      under_review: { 
        color: 'bg-blue-100 text-blue-800', 
        icon: <FaFileAlt />, 
        label: 'Under Review',
        description: 'Being reviewed by our team'
      },
      resolved: { 
        color: 'bg-green-100 text-green-800', 
        icon: <FaCheckCircle />, 
        label: 'Resolved',
        description: 'Dispute has been resolved'
      },
      dismissed: { 
        color: 'bg-red-100 text-red-800', 
        icon: <FaTimesCircle />, 
        label: 'Dismissed',
        description: 'Dispute was dismissed'
      }
    };
    return config[status] || config.open;
  };

  const getReasonLabel = (reason) => {
    const reasons = {
      poor_quality: 'Poor Quality Work',
      not_completed: 'Service Not Completed',
      time_mismatch: 'Time Mismatch',
      other: 'Other Issue'
    };
    return reasons[reason] || reason;
  };

  const filteredDisputes = disputes.filter(dispute => {
    if (filter === 'all') return true;
    return dispute.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
              <FaExclamationTriangle className="text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Disputes</h1>
              <p className="text-gray-600">Manage your service disputes</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{disputes.length}</div>
            <div className="text-sm text-gray-600">Total Disputes</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {disputes.filter(d => d.status === 'open').length}
            </div>
            <div className="text-sm text-gray-600">Open</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {disputes.filter(d => d.status === 'under_review').length}
            </div>
            <div className="text-sm text-gray-600">Under Review</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {disputes.filter(d => d.status === 'resolved').length}
            </div>
            <div className="text-sm text-gray-600">Resolved</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              All ({disputes.length})
            </button>
            <button
              onClick={() => setFilter('open')}
              className={`px-4 py-2 rounded-lg ${filter === 'open' ? 'bg-yellow-600 text-white' : 'bg-yellow-100 text-yellow-700'}`}
            >
              Open ({disputes.filter(d => d.status === 'open').length})
            </button>
            <button
              onClick={() => setFilter('under_review')}
              className={`px-4 py-2 rounded-lg ${filter === 'under_review' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`}
            >
              Under Review ({disputes.filter(d => d.status === 'under_review').length})
            </button>
            <button
              onClick={() => setFilter('resolved')}
              className={`px-4 py-2 rounded-lg ${filter === 'resolved' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'}`}
            >
              Resolved ({disputes.filter(d => d.status === 'resolved').length})
            </button>
            <button
              onClick={() => setFilter('dismissed')}
              className={`px-4 py-2 rounded-lg ${filter === 'dismissed' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700'}`}
            >
              Dismissed ({disputes.filter(d => d.status === 'dismissed').length})
            </button>
          </div>

          {/* Disputes List */}
          {filteredDisputes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">✅</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {filter === 'all' ? 'No disputes found' : `No ${filter} disputes`}
              </h3>
              <p className="text-gray-500 mb-6">
                {filter === 'all' 
                  ? "You haven't raised or been involved in any disputes"
                  : `No disputes with status "${filter}" found`}
              </p>
              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  View All Disputes
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredDisputes.map((dispute) => {
                const statusConfig = getStatusConfig(dispute.status);
                const isRaisedByMe = true; // You'd compare with current user ID

                return (
                  <div key={dispute._id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">
                              {dispute.sessionId?.serviceName}
                            </h3>
                            <p className="text-gray-600">{dispute.sessionId?.category}</p>
                          </div>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${statusConfig.color}`}>
                            {statusConfig.icon}
                            <span className="ml-2">{statusConfig.label}</span>
                          </span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Reason</p>
                            <p className="font-medium">{getReasonLabel(dispute.reason)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Raised By</p>
                            <p className="font-medium">{dispute.raisedBy?.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Against</p>
                            <p className="font-medium">{dispute.against?.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Raised On</p>
                            <p className="font-medium">
                              {new Date(dispute.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="mb-4">
                          <p className="text-sm text-gray-500 mb-2">Description</p>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-700">{dispute.description}</p>
                          </div>
                        </div>

                        {/* Evidence */}
                        {dispute.evidence?.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-500 mb-2">Evidence ({dispute.evidence.length})</p>
                            <div className="flex flex-wrap gap-2">
                              {dispute.evidence.map((item, idx) => (
                                <a
                                  key={idx}
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
                                >
                                  <FaFileAlt className="mr-2" size={12} />
                                  {item.type} #{idx + 1}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Resolution */}
                        {dispute.status === 'resolved' && dispute.resolution && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h4 className="font-semibold text-green-800 mb-2">Resolution</h4>
                            <p className="text-green-700 mb-2">
                              <strong>Decision:</strong> {dispute.resolution.decision?.replace('_', ' ')}
                            </p>
                            {dispute.resolution.moderatorNotes && (
                              <p className="text-green-700">
                                <strong>Notes:</strong> {dispute.resolution.moderatorNotes}
                              </p>
                            )}
                            <p className="text-sm text-green-600 mt-2">
                              Resolved on {new Date(dispute.resolution.resolvedAt).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col space-y-3 min-w-[200px]">
                        <Link
                          to={`/disputes/${dispute._id}`}
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center"
                        >
                          View Details
                        </Link>
                        
                        <Link
                          to={`/sessions/${dispute.sessionId?._id}`}
                          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium text-center"
                        >
                          View Session
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Disputes;