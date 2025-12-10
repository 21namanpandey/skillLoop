import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { FaLink, FaEthereum, FaChartBar, FaExternalLinkAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const BlockchainStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchBlockchainStats();
  }, []);

  const fetchBlockchainStats = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/sessions/blockchain/stats');
      setStats(response.stats);
    } catch (error) {
      console.error('Error fetching blockchain stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
          <FaEthereum className="text-purple-600 text-xl" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Blockchain Stats</h2>
          <p className="text-sm text-gray-500">Your verified session records</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Total Sessions on Blockchain */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <FaChartBar className="text-blue-600 mr-2" />
              <span className="font-medium">Total Sessions on Blockchain</span>
            </div>
            <span className="text-2xl font-bold text-blue-600">{stats?.totalSessions || 0}</span>
          </div>
          <p className="text-sm text-gray-500">
            Total service sessions recorded on Ethereum blockchain
          </p>
        </div>

        {/* Your Sessions */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <FaLink className="text-green-600 mr-2" />
              <span className="font-medium">Your Verified Sessions</span>
            </div>
            <span className="text-2xl font-bold text-green-600">
              {stats?.userSessions?.length || 0}
            </span>
          </div>
          
          {stats?.userSessions?.length > 0 ? (
            <div className="mt-3">
              <p className="text-sm text-gray-500 mb-2">Your session indices on blockchain:</p>
              <div className="flex flex-wrap gap-2">
                {stats.userSessions.map((index, i) => (
                  <span 
                    key={i} 
                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                  >
                    #{index}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              {user?.walletAddress 
                ? "No sessions recorded on blockchain yet"
                : "Connect wallet to log sessions to blockchain"}
            </p>
          )}
        </div>

        {/* Wallet Status */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Wallet Status</p>
              <p className="text-sm text-gray-500">
                {user?.walletAddress 
                  ? `Connected: ${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}`
                  : "Not connected"}
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm ${user?.walletAddress ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {user?.walletAddress ? 'Connected' : 'Not Connected'}
            </div>
          </div>
          
          {!user?.walletAddress && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">
                Add your Ethereum wallet address in Profile Settings to enable blockchain logging
              </p>
              <a
                href="/profile"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm"
              >
                Go to Profile Settings
                <FaExternalLinkAlt className="ml-1" size={12} />
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 pt-6 border-t">
        <p className="text-xs text-gray-500">
          All confirmed sessions are permanently recorded on the Ethereum Sepolia testnet for transparency and verification.
        </p>
      </div>
    </div>
  );
};

export default BlockchainStats;