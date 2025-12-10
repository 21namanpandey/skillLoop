import React from 'react';
import { FaUser, FaCalendarAlt, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const RequestCard = ({ request, type, onAccept, onReject, onCancel }) => {
  const getUserInfo = () => {
    if (type === 'incoming') {
      return {
        name: request.requesterId?.name,
        email: request.requesterId?.email,
        role: 'Requester'
      };
    } else {
      return {
        name: request.providerId?.name,
        email: request.providerId?.email,
        role: 'Provider'
      };
    }
  };

  const getStatusIcon = () => {
    switch (request.status) {
      case 'pending':
        return <FaClock className="text-yellow-500" />;
      case 'accepted':
        return <FaCheckCircle className="text-green-500" />;
      case 'rejected':
        return <FaTimesCircle className="text-red-500" />;
      case 'cancelled':
        return <FaTimesCircle className="text-gray-500" />;
      default:
        return <FaClock className="text-yellow-500" />;
    }
  };

  const getStatusColor = () => {
    switch (request.status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const userInfo = getUserInfo();

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
            <FaUser className="text-primary-600 text-xl" />
          </div>
          <div>
            <h3 className="font-bold text-lg">{userInfo.name}</h3>
            <p className="text-sm text-gray-500">{userInfo.email}</p>
            <p className="text-xs text-primary-600 mt-1">{userInfo.role}</p>
          </div>
        </div>
        <div className="flex items-center">
          {getStatusIcon()}
          <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold text-gray-900 mb-2">{request.serviceName}</h4>
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs mr-3">
            {request.category}
          </span>
          <FaCalendarAlt className="mr-1" size={12} />
          <span>{new Date(request.createdAt).toLocaleDateString()}</span>
        </div>
        {request.message && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700">{request.message}</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <div className="text-sm text-gray-500">
          Requested {new Date(request.createdAt).toLocaleDateString()}
        </div>
        
        <div className="flex space-x-2">
          {request.status === 'pending' && type === 'incoming' && (
            <>
              <button
                onClick={() => onAccept(request._id)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                Accept
              </button>
              <button
                onClick={() => onReject(request._id)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Reject
              </button>
            </>
          )}
          
          {request.status === 'pending' && type === 'outgoing' && (
            <button
              onClick={() => onCancel(request._id)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
          )}
          
          {request.status === 'accepted' && (
            <button
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
              onClick={() => alert('Navigate to sessions')}
            >
              View Session
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestCard;