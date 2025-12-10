import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaUser, 
  FaCalendarAlt, 
  FaClock, 
  FaCheckCircle,
  FaLink
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const SessionCard = ({ session, onConfirm }) => {
  const { user } = useAuth();

  // Helper function to safely get ID
  const getSafeId = (obj) => {
    if (!obj) return null;
    return obj._id || obj.id || null;
  };

  // Helper function to compare IDs
  const compareIds = (id1, id2) => {
    if (!id1 || !id2) return false;
    return String(id1) === String(id2);
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'scheduled':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: <FaCalendarAlt />,
          label: 'Scheduled'
        };
      case 'completed_pending_confirmation':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          icon: <FaClock />,
          label: 'Pending Confirmation'
        };
      case 'completed_confirmed':
        return {
          color: 'bg-green-100 text-green-800',
          icon: <FaCheckCircle />,
          label: 'Completed'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: <FaClock />,
          label: 'Unknown'
        };
    }
  };

  const getRole = () => {
    const providerId = getSafeId(session.providerId);
    const userId = getSafeId(user);
    return compareIds(providerId, userId) ? 'Provider' : 'Client';
  };

  const getOtherUser = () => {
    return getRole() === 'Provider' ? session.clientId : session.providerId;
  };

  const canConfirm = () => {
    if (!session || !user) return false;
    
    if (session.status === 'scheduled') {
      // Either party can mark scheduled session as complete
      return true;
    }
    
    if (session.status === 'completed_pending_confirmation') {
      const role = getRole();
      if (role === 'Provider' && !session.providerConfirmed) return true;
      if (role === 'Client' && !session.clientConfirmed) return true;
    }
    
    return false;
  };

  const statusConfig = getStatusConfig(session.status);
  const role = getRole();
  const otherUser = getOtherUser();
  const showConfirmButton = canConfirm();

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{session.serviceName}</h3>
          <div className="flex items-center space-x-2">
            <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-sm">
              {session.category}
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${statusConfig.color}`}>
              {statusConfig.icon}
              <span className="ml-2">{statusConfig.label}</span>
            </span>
            {session.onChainTxHash && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                <FaLink size={10} className="mr-1" />
                On-chain
              </span>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-lg font-bold text-primary-600">{session.plannedHours || 1} hr</div>
          <div className="text-sm text-gray-500">Planned</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
            <FaUser className="text-gray-600" />
          </div>
          <div>
            <p className="font-medium">{otherUser?.name || 'Unknown User'}</p>
            <p className="text-sm text-gray-500">
              {role === 'Provider' ? 'Your client' : 'Your provider'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Your Role</p>
            <p className="font-medium">{role}</p>
          </div>
          <div>
            <p className="text-gray-500">Created</p>
            <p className="font-medium">
              {new Date(session.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Confirmation Status Display */}
        {session.status === 'completed_pending_confirmation' && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm font-medium mb-1">Confirmation Status:</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className={session.providerConfirmed ? 'text-green-600' : 'text-gray-500'}>
                Provider: {session.providerConfirmed ? '✓ Confirmed' : 'Pending'}
              </div>
              <div className={session.clientConfirmed ? 'text-green-600' : 'text-gray-500'}>
                Client: {session.clientConfirmed ? '✓ Confirmed' : 'Pending'}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <Link
          to={`/sessions/${getSafeId(session)}`}
          className="text-primary-600 hover:text-primary-700 font-medium text-sm"
        >
          View Details →
        </Link>

        <div className="flex space-x-2">
          {showConfirmButton && (
            <button
              onClick={() => onConfirm(getSafeId(session))}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              {session.status === 'scheduled' ? 'Mark Complete' : 'Confirm'}
            </button>
          )}
          
          {session.onChainTxHash && (
            <a
              href={`https://sepolia.etherscan.io/tx/${session.onChainTxHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
            >
              View TX
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionCard;