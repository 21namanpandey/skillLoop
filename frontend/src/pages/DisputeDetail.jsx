import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { 
  FaArrowLeft,
  FaExclamationTriangle,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaFileAlt,
  FaUser,
  FaCalendarAlt,
  FaLink
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const DisputeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dispute, setDispute] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDispute();
  }, [id]);

  const fetchDispute = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get(`/disputes/${id}`);
      setDispute(response.dispute);
    } catch (error) {
      console.error('Error fetching dispute:', error);
      toast.error('Failed to load dispute details');
      navigate('/disputes');
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const config = {
      open: { 
        color: 'bg-yellow-100 text-yellow-800', 
        icon: <FaClock />, 
        label: 'Open'
      },
      under_review: { 
        color: 'bg-blue-100 text-blue-800', 
        icon: <FaFileAlt />, 
        label: 'Under Review'
      },
      resolved: { 
        color: 'bg-green-100 text-green-800', 
        icon: <FaCheckCircle />, 
        label: 'Resolved'
      },
      dismissed: { 
        color: 'bg-red-100 text-red-800', 
        icon: <FaTimesCircle />, 
        label: 'Dismissed'
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!dispute) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Dispute not found</h2>
          <button
            onClick={() => navigate('/disputes')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Disputes
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(dispute.status);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/disputes')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Disputes
          </button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <FaExclamationTriangle className="text-red-600 text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dispute #{dispute._id.slice(-6)}</h1>
                <p className="text-gray-600">Service: {dispute.sessionId?.serviceName}</p>
              </div>
            </div>
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-lg ${statusConfig.color}`}>
              {statusConfig.icon}
              <span className="ml-2 font-semibold">{statusConfig.label}</span>
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Dispute Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Service Details</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Service Name</p>
                      <p className="font-medium">{dispute.sessionId?.serviceName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="font-medium">{dispute.sessionId?.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Session ID</p>
                      <p className="font-medium text-sm">{dispute.sessionId?._id?.slice(-8)}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Dispute Details</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Reason</p>
                      <p className="font-medium">{getReasonLabel(dispute.reason)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Raised On</p>
                      <p className="font-medium">
                        {new Date(dispute.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Updated</p>
                      <p className="font-medium">
                        {new Date(dispute.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">{dispute.description}</p>
              </div>
            </div>

            {/* Participants */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Participants</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <FaUser className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold">Raised By</h3>
                      <p className="text-sm text-blue-600">Complainant</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">{dispute.raisedBy?.name}</p>
                    <p className="text-sm text-gray-600">{dispute.raisedBy?.email}</p>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                      <FaUser className="text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-bold">Against</h3>
                      <p className="text-sm text-red-600">Respondent</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">{dispute.against?.name}</p>
                    <p className="text-sm text-gray-600">{dispute.against?.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Evidence */}
            {dispute.evidence?.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Evidence ({dispute.evidence.length})
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {dispute.evidence.map((item, idx) => (
                    <a
                      key={idx}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center mb-2">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                          <FaFileAlt className="text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium">Evidence #{idx + 1}</p>
                          <p className="text-sm text-gray-500 capitalize">{item.type}</p>
                        </div>
                      </div>
                      {item.description && (
                        <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Status & Actions */}
          <div className="space-y-8">
            {/* Status Panel */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Status & Timeline</h2>
              
              <div className="space-y-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg ${statusConfig.color}`}>
                    {statusConfig.icon}
                    <span className="ml-2 font-semibold">{statusConfig.label}</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    {dispute.status === 'open' && 'Waiting for our team to review'}
                    {dispute.status === 'under_review' && 'Our team is currently reviewing'}
                    {dispute.status === 'resolved' && 'This dispute has been resolved'}
                    {dispute.status === 'dismissed' && 'This dispute was dismissed'}
                  </p>
                </div>

                {/* Timeline */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Timeline</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <FaCalendarAlt className="text-blue-600 text-xs" />
                      </div>
                      <div>
                        <p className="font-medium">Dispute Raised</p>
                        <p className="text-sm text-gray-500">
                          {new Date(dispute.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    {dispute.updatedAt && dispute.updatedAt !== dispute.createdAt && (
                      <div className="flex items-start">
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                          <FaCalendarAlt className="text-gray-600 text-xs" />
                        </div>
                        <div>
                          <p className="font-medium">Last Updated</p>
                          <p className="text-sm text-gray-500">
                            {new Date(dispute.updatedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {dispute.resolution?.resolvedAt && (
                      <div className="flex items-start">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                          <FaCheckCircle className="text-green-600 text-xs" />
                        </div>
                        <div>
                          <p className="font-medium">Resolved</p>
                          <p className="text-sm text-gray-500">
                            {new Date(dispute.resolution.resolvedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dispute ID */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Dispute ID</h3>
                  <div className="flex items-center bg-gray-50 p-2 rounded">
                    <code className="text-sm truncate flex-1">{dispute._id}</code>
                  </div>
                </div>
              </div>
            </div>

            {/* Resolution (if resolved) */}
            {dispute.status === 'resolved' && dispute.resolution && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <FaCheckCircle className="text-green-600 mr-2" />
                  <h2 className="text-xl font-bold text-gray-900">Resolution</h2>
                </div>

                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="font-semibold text-green-700">Decision Made</span>
                    </div>
                    <p className="text-green-800 font-medium capitalize">
                      {dispute.resolution.decision?.replace(/_/g, ' ')}
                    </p>
                  </div>

                  {dispute.resolution.moderatorNotes && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Moderator Notes</p>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-700">{dispute.resolution.moderatorNotes}</p>
                      </div>
                    </div>
                  )}

                  {dispute.resolution.resolvedBy && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Resolved By</p>
                      <p className="font-medium">{dispute.resolution.resolvedBy?.name}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate(`/sessions/${dispute.sessionId?._id}`)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
                >
                  View Session
                </button>

                <button
                  onClick={() => navigate('/disputes')}
                  className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 font-medium"
                >
                  Back to Disputes
                </button>

                {dispute.status === 'open' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      <FaClock className="inline mr-1" />
                      This dispute is pending review by our team.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisputeDetail;