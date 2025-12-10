import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { 
  FaCheckCircle, 
  FaClock, 
  FaCalendarAlt, 
  FaUser, 
  FaLink,
  FaExternalLinkAlt,
  FaCheck,
  FaTimes
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/sessions/my');
      setSessions(response.sessions || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async (sessionId) => {
    try {
      await axiosClient.put(`/sessions/${sessionId}/confirm`);
      toast.success('Session marked as completed!');
      fetchSessions();
    } catch (error) {
      console.error('Error marking session complete:', error);
      toast.error('Failed to mark session complete');
    }
  };

  const getFilteredSessions = () => {
    switch (filter) {
      case 'scheduled':
        return sessions.filter(s => s.status === 'scheduled');
      case 'pending':
        return sessions.filter(s => s.status === 'completed_pending_confirmation');
      case 'completed':
        return sessions.filter(s => s.status === 'completed_confirmed');
      default:
        return sessions;
    }
  };

  const getStatusInfo = (status) => {
    const config = {
      scheduled: { 
        color: 'bg-blue-100 text-blue-800', 
        icon: <FaCalendarAlt />, 
        label: 'Scheduled',
        action: 'Mark as Completed'
      },
      completed_pending_confirmation: { 
        color: 'bg-yellow-100 text-yellow-800', 
        icon: <FaClock />, 
        label: 'Pending Confirmation',
        action: 'Confirm Completion'
      },
      completed_confirmed: { 
        color: 'bg-green-100 text-green-800', 
        icon: <FaCheckCircle />, 
        label: 'Completed',
        action: null
      }
    };
    
    return config[status] || config.scheduled;
  };

  const getUserRole = (session) => {
    // You'll need to get current user ID from auth context
    // For now, we'll assume it's passed in session
    return session.userRole || 'client'; // This should come from backend
  };

  const canMarkComplete = (session) => {
    const role = getUserRole(session);
    if (session.status === 'scheduled') {
      return true; // Either party can mark as completed initially
    }
    if (session.status === 'completed_pending_confirmation') {
      // Check who hasn't confirmed yet
      if (role === 'provider' && !session.providerConfirmed) return true;
      if (role === 'client' && !session.clientConfirmed) return true;
    }
    return false;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const filteredSessions = getFilteredSessions();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Sessions</h1>
          <p className="text-gray-600">Manage your service exchange sessions</p>
        </div>

        {/* Stats and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{sessions.length}</div>
                <div className="text-sm text-gray-500">Total Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {sessions.filter(s => s.status === 'completed_confirmed').length}
                </div>
                <div className="text-sm text-gray-500">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {sessions.filter(s => s.status === 'completed_pending_confirmation').length}
                </div>
                <div className="text-sm text-gray-500">Pending</div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Sessions</option>
                <option value="scheduled">Scheduled</option>
                <option value="pending">Pending Confirmation</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Quick filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              All ({sessions.length})
            </button>
            <button
              onClick={() => setFilter('scheduled')}
              className={`px-4 py-2 rounded-lg ${filter === 'scheduled' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`}
            >
              Scheduled ({sessions.filter(s => s.status === 'scheduled').length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg ${filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-yellow-100 text-yellow-700'}`}
            >
              Pending ({sessions.filter(s => s.status === 'completed_pending_confirmation').length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg ${filter === 'completed' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'}`}
            >
              Completed ({sessions.filter(s => s.status === 'completed_confirmed').length})
            </button>
          </div>
        </div>

        {/* Sessions List */}
        <div>
          {filteredSessions.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No sessions found</h3>
              <p className="text-gray-500 mb-6">
                {filter === 'all' 
                  ? "You don't have any sessions yet. Start by requesting a service!"
                  : `No ${filter} sessions found`}
              </p>
              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  View All Sessions
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredSessions.map((session) => {
                const statusInfo = getStatusInfo(session.status);
                const otherUser = session.providerId?._id === session.userId ? session.clientId : session.providerId;
                const showCompleteButton = canMarkComplete(session);

                return (
                  <div key={session._id} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{session.serviceName}</h3>
                            <p className="text-gray-600">{session.category}</p>
                          </div>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${statusInfo.color}`}>
                            {statusInfo.icon}
                            <span className="ml-2">{statusInfo.label}</span>
                          </span>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Planned Hours</p>
                            <p className="font-medium">{session.plannedHours || 1} hours</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Created</p>
                            <p className="font-medium">
                              {new Date(session.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">With</p>
                            <p className="font-medium">{otherUser?.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Role</p>
                            <p className="font-medium">
                              {session.providerId?._id === session.userId ? 'Provider' : 'Client'}
                            </p>
                          </div>
                        </div>

                        {/* Confirmation Status */}
                        {session.status === 'completed_pending_confirmation' && (
                          <div className="mb-4 p-4 bg-yellow-50 rounded-lg">
                            <h4 className="font-medium mb-2">Confirmation Status</h4>
                            <div className="flex items-center space-x-6">
                              <div className="flex items-center">
                                {session.providerConfirmed ? (
                                  <FaCheck className="text-green-500 mr-2" />
                                ) : (
                                  <FaTimes className="text-gray-300 mr-2" />
                                )}
                                <span>Provider: {session.providerConfirmed ? 'Confirmed' : 'Pending'}</span>
                              </div>
                              <div className="flex items-center">
                                {session.clientConfirmed ? (
                                  <FaCheck className="text-green-500 mr-2" />
                                ) : (
                                  <FaTimes className="text-gray-300 mr-2" />
                                )}
                                <span>Client: {session.clientConfirmed ? 'Confirmed' : 'Pending'}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Blockchain Info */}
                        {session.onChainTxHash && (
                          <div className="mb-4 p-4 bg-purple-50 rounded-lg">
                            <div className="flex items-center">
                              <FaLink className="text-purple-600 mr-2" />
                              <span className="font-medium text-purple-700">Logged on Blockchain</span>
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                              <div className="text-sm text-gray-600">
                                Transaction: {session.onChainTxHash.slice(0, 20)}...
                              </div>
                              <a
                                href={`https://sepolia.etherscan.io/tx/${session.onChainTxHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 flex items-center text-sm"
                              >
                                View on Explorer
                                <FaExternalLinkAlt className="ml-1" size={12} />
                              </a>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-6 lg:mt-0 lg:ml-6 flex flex-col space-y-3 min-w-[200px]">
                        <Link
                          to={`/sessions/${session._id}`}
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center"
                        >
                          View Details
                        </Link>
                        
                        {showCompleteButton && (
                          <button
                            onClick={() => handleMarkComplete(session._id)}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                          >
                            {statusInfo.action}
                          </button>
                        )}
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

export default Sessions;