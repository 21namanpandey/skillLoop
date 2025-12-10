import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import { 
  FaChartBar, 
  FaClock, 
  FaCheckCircle, 
  FaExchangeAlt,
  FaArrowRight,
  FaStar
} from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalSessions: 0,
    completedSessions: 0,
    pendingRequests: 0,
    blockchainSessions: 0
  });
  const [recentSessions, setRecentSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [sessionsResponse, requestsResponse] = await Promise.all([
        axiosClient.get('/sessions/my'),
        axiosClient.get('/requests/incoming')
      ]);

      const sessions = sessionsResponse.sessions || [];
      const requests = requestsResponse.requests || [];

      const completedSessions = sessions.filter(s => 
        s.status === 'completed_confirmed'
      ).length;

      const blockchainSessions = sessions.filter(s => 
        s.onChainTxHash
      ).length;

      setStats({
        totalSessions: sessions.length,
        completedSessions,
        pendingRequests: requests.filter(r => r.status === 'pending').length,
        blockchainSessions
      });

      setRecentSessions(sessions.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your SkillLoop account
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaExchangeAlt className="text-blue-600 text-xl" />
              </div>
              <span className="text-2xl font-bold">{stats.totalSessions}</span>
            </div>
            <h3 className="font-semibold text-gray-700">Total Sessions</h3>
            <p className="text-sm text-gray-500">All your service exchanges</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FaCheckCircle className="text-green-600 text-xl" />
              </div>
              <span className="text-2xl font-bold">{stats.completedSessions}</span>
            </div>
            <h3 className="font-semibold text-gray-700">Completed</h3>
            <p className="text-sm text-gray-500">Successfully finished sessions</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FaClock className="text-yellow-600 text-xl" />
              </div>
              <span className="text-2xl font-bold">{stats.pendingRequests}</span>
            </div>
            <h3 className="font-semibold text-gray-700">Pending Requests</h3>
            <p className="text-sm text-gray-500">Awaiting your response</p>
          </div>

          <Link to="/blockchain-stats" className="block">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FaChartBar className="text-purple-600 text-xl" />
                </div>
                <span className="text-2xl font-bold">{stats.blockchainSessions}</span>
              </div>
              <h3 className="font-semibold text-gray-700">On Blockchain</h3>
              <p className="text-sm text-gray-500">Immutable records</p>
              <div className="mt-2 text-xs text-purple-600">
                View details →
              </div>
            </div>
          </Link>
          </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/browse"
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                    <FaExchangeAlt className="text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium">Browse Services</p>
                    <p className="text-sm text-gray-500">Find skills to exchange</p>
                  </div>
                </div>
                <FaArrowRight className="text-gray-400" />
              </Link>

              <Link
                to="/requests"
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                    <FaClock className="text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium">View Requests</p>
                    <p className="text-sm text-gray-500">
                      {stats.pendingRequests} pending requests
                    </p>
                  </div>
                </div>
                <FaArrowRight className="text-gray-400" />
              </Link>

              <Link
                to="/reviews"
                className="flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <FaStar className="text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">View Reviews</p>
                    <p className="text-sm text-gray-500">Check your ratings</p>
                  </div>
                </div>
                <FaArrowRight className="text-purple-400" />
              </Link>
            </div>
          </div>

          {/* Profile Status */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Status</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Profile Completeness</span>
                  <span className="text-sm font-medium">
                    {user?.skillsOffer?.length > 0 && user?.bio ? '100%' : '50%'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full" 
                    style={{ width: user?.skillsOffer?.length > 0 && user?.bio ? '100%' : '50%' }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Services Offered:</span>{' '}
                  {user?.skillsOffer?.length || 0}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Total Hours Provided:</span>{' '}
                  {user?.totalHoursProvided || 0}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Wallet Connected:</span>{' '}
                  {user?.walletAddress ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Recent Sessions</h2>
            <Link
              to="/sessions"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View All
            </Link>
          </div>

          {recentSessions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No sessions yet</p>
              <Link
                to="/browse"
                className="inline-block mt-2 text-primary-600 hover:text-primary-700"
              >
                Start by browsing services
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      With
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentSessions.map((session) => (
                    <tr key={session._id}>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{session.serviceName}</p>
                          <p className="text-sm text-gray-500">{session.category}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm">
                            {session.providerId._id === user?.id 
                              ? `To: ${session.clientId.name}`
                              : `From: ${session.providerId.name}`
                            }
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                          session.status === 'completed_confirmed'
                            ? 'bg-green-100 text-green-800'
                            : session.status === 'completed_pending_confirmation'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {session.status.replace(/_/g, ' ')}
                        </span>
                        {session.onChainTxHash && (
                          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                            On-chain
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(session.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;