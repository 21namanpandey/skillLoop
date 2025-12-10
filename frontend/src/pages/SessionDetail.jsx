import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { 
  FaArrowLeft,
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaLink,
  FaExternalLinkAlt,
  FaCopy,
  FaCheck,
  FaHourglassHalf,
  FaStar,
  FaExclamationTriangle
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import ReviewModal from '../components/ReviewModal';
import DisputeModal from '../components/DisputeModal';

// Blockchain Transaction Card Component
const BlockchainTransactionCard = ({ session }) => {
  if (!session.onChainTxHash) return null;

  const isSepolia = session.blockchainNetwork === 'sepolia';
  const explorerUrl = isSepolia 
    ? `https://sepolia.etherscan.io/tx/${session.onChainTxHash}`
    : '#';

  return (
    <div className="mt-6 border-t pt-6">
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        {isSepolia && !session.isMockBlockchain ? (
          <FaCheckCircle className="text-green-500 mr-2" />
        ) : (
          <FaClock className="text-yellow-500 mr-2" />
        )}
        Blockchain Verification
      </h3>
      
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <p className="font-medium">
              {session.isMockBlockchain 
                ? 'Mock Transaction (Development Mode)'
                : `Verified on ${session.blockchainNetwork}`}
            </p>
            
            {session.onChainTxHash && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Transaction Hash:</p>
                <div className="flex items-center bg-white p-2 rounded mt-1">
                  <code className="text-sm font-mono break-all flex-1">
                    {session.onChainTxHash}
                  </code>
                  <button
                    onClick={() => navigator.clipboard.writeText(session.onChainTxHash)}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    <FaCopy />
                  </button>
                </div>
              </div>
            )}
            
            {session.blockchainError && (
              <div className="mt-2 text-red-600 text-sm">
                Error: {session.blockchainError}
              </div>
            )}
          </div>
          
          {isSepolia && !session.isMockBlockchain && (
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FaExternalLinkAlt className="mr-2" />
              View on Etherscan
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const SessionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [isTestnet, setIsTestnet] = useState(false);

  // Helper functions
  const getSafeId = (obj) => {
    if (!obj) return null;
    return obj._id || obj.id || null;
  };

  const compareIds = (id1, id2) => {
    if (!id1 || !id2) return false;
    return String(id1) === String(id2);
  };

  useEffect(() => {
    fetchSession();
    // Check if we're on testnet
    setIsTestnet(import.meta.env.VITE_NETWORK === 'sepolia' || process.env.VITE_NETWORK === 'sepolia');
  }, [id]);

  useEffect(() => {
    if (session && user) {
      checkReviewStatus();
    }
  }, [session, user]);

  const fetchSession = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get(`/sessions/${id}`);
      setSession(response.session);
    } catch (error) {
      console.error('Error fetching session:', error);
      toast.error('Failed to load session details');
    } finally {
      setLoading(false);
    }
  };

  const checkReviewStatus = async () => {
    try {
      const response = await axiosClient.get(`/reviews/check/${id}`);
      setHasReviewed(response.hasReviewed);
      
      // Can review if session is completed and user hasn't reviewed yet
      const sessionCompleted = session?.status === 'completed_confirmed';
      const isParticipant = compareIds(getSafeId(session?.providerId), getSafeId(user)) || 
                           compareIds(getSafeId(session?.clientId), getSafeId(user));
      
      setCanReview(sessionCompleted && !response.hasReviewed && isParticipant);
    } catch (error) {
      console.error('Error checking review:', error);
    }
  };

  const handleConfirm = async () => {
    try {
      setConfirming(true);
      await axiosClient.put(`/sessions/${id}/confirm`);
      toast.success('Session confirmed successfully!');
      fetchSession(); // Refresh session data
    } catch (error) {
      console.error('Error confirming session:', error);
      toast.error('Failed to confirm session');
    } finally {
      setConfirming(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const getStatusInfo = (status) => {
    const config = {
      scheduled: { 
        color: 'bg-blue-100 text-blue-800', 
        icon: <FaCalendarAlt />, 
        label: 'Scheduled',
        description: 'The session is scheduled and waiting to begin.',
        showAction: true,
        actionText: 'Mark as Completed'
      },
      completed_pending_confirmation: { 
        color: 'bg-yellow-100 text-yellow-800', 
        icon: <FaHourglassHalf />, 
        label: 'Pending Confirmation',
        description: 'Session completed, waiting for both parties to confirm.',
        showAction: true,
        actionText: 'Confirm Completion'
      },
      completed_confirmed: { 
        color: 'bg-green-100 text-green-800', 
        icon: <FaCheckCircle />, 
        label: 'Completed & Confirmed',
        description: 'Session completed and confirmed by both parties.',
        showAction: false,
        actionText: ''
      }
    };
    
    return config[status] || config.scheduled;
  };

  const getRole = () => {
    if (!session || !user) return 'Client';
    const providerId = getSafeId(session.providerId);
    const userId = getSafeId(user);
    return compareIds(providerId, userId) ? 'Provider' : 'Client';
  };

  const canConfirm = () => {
    if (!session || !user) return false;
    
    // If scheduled, anyone can mark as completed
    if (session.status === 'scheduled') return true;
    
    // If pending confirmation, check who hasn't confirmed
    if (session.status === 'completed_pending_confirmation') {
      const role = getRole();
      if (role === 'Provider' && !session.providerConfirmed) return true;
      if (role === 'Client' && !session.clientConfirmed) return true;
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

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Session not found</h2>
          <button
            onClick={() => navigate('/sessions')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Sessions
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(session.status);
  const showConfirmButton = canConfirm();
  const isCompleted = session.status === 'completed_confirmed';
  const role = getRole();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/sessions')}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Back to Sessions
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{session.serviceName}</h1>
              <div className="flex items-center space-x-4 flex-wrap gap-2">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {session.category}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${statusInfo.color}`}>
                  {statusInfo.icon}
                  <span className="ml-2">{statusInfo.label}</span>
                </span>
                {session.onChainTxHash && !session.isMockBlockchain && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                    <FaLink size={12} className="mr-1" />
                    Verified on Sepolia
                  </span>
                )}
                {session.onChainTxHash && session.isMockBlockchain && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                    <FaLink size={12} className="mr-1" />
                    Local Blockchain
                  </span>
                )}
                {isTestnet && !session.onChainTxHash && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                    <FaLink size={12} className="mr-1" />
                    Ready for Sepolia
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 md:mt-0 flex space-x-3">
              {showConfirmButton && (
                <button
                  onClick={handleConfirm}
                  disabled={confirming}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium flex items-center"
                >
                  {confirming ? (
                    <>
                      <FaHourglassHalf className="mr-2 animate-spin" />
                      Confirming...
                    </>
                  ) : (
                    <>
                      <FaCheck className="mr-2" />
                      {statusInfo.actionText}
                    </>
                  )}
                </button>
              )}
              
              {canReview && (
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 font-medium flex items-center"
                >
                  <FaStar className="mr-2" />
                  Leave Review
                </button>
              )}
              
              {isCompleted && (
                <button
                  onClick={() => setShowDisputeModal(true)}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 font-medium flex items-center"
                >
                  <FaExclamationTriangle className="mr-2" />
                  Raise Dispute
                </button>
              )}
            </div>
          </div>

          <p className="text-gray-600">{statusInfo.description}</p>
          
          {/* Testnet Status Alert */}
          {session.status === 'completed_pending_confirmation' && 
           !session.onChainTxHash && 
           (session.providerId?.walletAddress && session.clientId?.walletAddress) && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <FaLink className="text-blue-500 mr-3" />
                <div>
                  <p className="font-medium text-blue-800">Ready for Blockchain</p>
                  <p className="text-sm text-blue-600">
                    Both parties have wallet addresses. This session will be logged to Sepolia testnet when confirmed.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {hasReviewed && (
            <div className="mt-3 inline-flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
              <FaStar className="mr-1" />
              You've already reviewed this session
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Session Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Service Details */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Service Details</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Service Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Service Name</p>
                      <p className="font-medium">{session.serviceName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="font-medium">{session.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Planned Hours</p>
                      <p className="font-medium">{session.plannedHours || 1} hours</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Your Role</p>
                      <p className="font-medium capitalize">{role}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Timeline</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Created</p>
                      <p className="font-medium">
                        {new Date(session.createdAt).toLocaleDateString()} at{' '}
                        {new Date(session.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    {session.scheduledAt && (
                      <div>
                        <p className="text-sm text-gray-500">Scheduled For</p>
                        <p className="font-medium">
                          {new Date(session.scheduledAt).toLocaleDateString()} at{' '}
                          {new Date(session.scheduledAt).toLocaleTimeString()}
                        </p>
                      </div>
                    )}
                    {session.updatedAt && (
                      <div>
                        <p className="text-sm text-gray-500">Last Updated</p>
                        <p className="font-medium">
                          {new Date(session.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Add Blockchain Transaction Card here */}
              <BlockchainTransactionCard session={session} />
            </div>

            {/* Participants */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Participants</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Provider */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <FaUser className="text-blue-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Provider</h3>
                      <p className="text-sm text-blue-600">Service Provider</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">{session.providerId?.name}</p>
                    <p className="text-sm text-gray-600">{session.providerId?.email}</p>
                    {session.providerId?.location && (
                      <p className="text-sm text-gray-500">{session.providerId.location}</p>
                    )}
                    {session.providerId?.walletAddress && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm text-gray-500">Wallet Address</p>
                          {isTestnet && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                              Sepolia
                            </span>
                          )}
                        </div>
                        <div className="flex items-center bg-gray-50 p-2 rounded">
                          <code className="text-xs truncate flex-1">
                            {session.providerId.walletAddress}
                          </code>
                          <button
                            onClick={() => copyToClipboard(session.providerId.walletAddress)}
                            className="ml-2 text-gray-500 hover:text-gray-700"
                          >
                            <FaCopy />
                          </button>
                        </div>
                        {!session.providerId.walletAddress.startsWith('0x') && (
                          <p className="text-xs text-red-500 mt-1">Invalid Ethereum address</p>
                        )}
                      </div>
                    )}
                    {session.providerConfirmed && (
                      <div className="flex items-center text-green-600">
                        <FaCheckCircle className="mr-2" />
                        <span className="text-sm">Confirmed completion</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Client */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <FaUser className="text-green-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Client</h3>
                      <p className="text-sm text-green-600">Service Receiver</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">{session.clientId?.name}</p>
                    <p className="text-sm text-gray-600">{session.clientId?.email}</p>
                    {session.clientId?.location && (
                      <p className="text-sm text-gray-500">{session.clientId.location}</p>
                    )}
                    {session.clientId?.walletAddress && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm text-gray-500">Wallet Address</p>
                          {isTestnet && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                              Sepolia
                            </span>
                          )}
                        </div>
                        <div className="flex items-center bg-gray-50 p-2 rounded">
                          <code className="text-xs truncate flex-1">
                            {session.clientId.walletAddress}
                          </code>
                          <button
                            onClick={() => copyToClipboard(session.clientId.walletAddress)}
                            className="ml-2 text-gray-500 hover:text-gray-700"
                          >
                            <FaCopy />
                          </button>
                        </div>
                        {!session.clientId.walletAddress.startsWith('0x') && (
                          <p className="text-xs text-red-500 mt-1">Invalid Ethereum address</p>
                        )}
                      </div>
                    )}
                    {session.clientConfirmed && (
                      <div className="flex items-center text-green-600">
                        <FaCheckCircle className="mr-2" />
                        <span className="text-sm">Confirmed completion</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Status & Blockchain */}
          <div className="space-y-8">
            {/* Status Panel */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Session Status</h2>
              
              <div className="space-y-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg ${statusInfo.color}`}>
                    {statusInfo.icon}
                    <span className="ml-2 font-semibold">{statusInfo.label}</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{statusInfo.description}</p>
                </div>

                {/* Confirmation Status */}
                {(session.status === 'completed_pending_confirmation' || session.status === 'completed_confirmed') && (
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Confirmation Status</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {session.providerConfirmed ? (
                            <FaCheckCircle className="text-green-500 mr-2" />
                          ) : (
                            <FaTimesCircle className="text-gray-300 mr-2" />
                          )}
                          <span>Provider Confirmed</span>
                        </div>
                        <span className={`px-2 py-1 rounded text-sm ${
                          session.providerConfirmed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {session.providerConfirmed ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {session.clientConfirmed ? (
                            <FaCheckCircle className="text-green-500 mr-2" />
                          ) : (
                            <FaTimesCircle className="text-gray-300 mr-2" />
                          )}
                          <span>Client Confirmed</span>
                        </div>
                        <span className={`px-2 py-1 rounded text-sm ${
                          session.clientConfirmed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {session.clientConfirmed ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Session ID */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Session ID</h3>
                  <div className="flex items-center bg-gray-50 p-2 rounded">
                    <code className="text-sm truncate flex-1">{session._id}</code>
                    <button
                      onClick={() => copyToClipboard(session._id)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      <FaCopy />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Blockchain Information - Simplified */}
            {session.onChainTxHash && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <FaLink className="text-purple-600 mr-2" />
                  <h2 className="text-xl font-bold text-gray-900">
                    {session.isMockBlockchain ? "Local Blockchain" : "Blockchain Record"}
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className={`border rounded-lg p-4 ${session.isMockBlockchain ? 'bg-yellow-50' : 'bg-green-50'}`}>
                    <div className="flex items-center mb-2">
                      <div className={`w-3 h-3 rounded-full mr-2 ${session.isMockBlockchain ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                      <span className={`font-semibold ${session.isMockBlockchain ? 'text-yellow-700' : 'text-green-700'}`}>
                        {session.isMockBlockchain ? 'Local Development' : 'Verified on Sepolia'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {session.isMockBlockchain 
                        ? "This is a local development transaction for testing."
                        : "This session is permanently recorded on Ethereum Sepolia testnet."}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Transaction Hash</p>
                      <div className="flex items-center bg-gray-50 p-2 rounded">
                        <code className="text-xs truncate flex-1">{session.onChainTxHash}</code>
                        <button
                          onClick={() => copyToClipboard(session.onChainTxHash)}
                          className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                          <FaCopy />
                        </button>
                      </div>
                    </div>

                    {!session.isMockBlockchain && (
                      <a
                        href={`https://sepolia.etherscan.io/tx/${session.onChainTxHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <FaExternalLinkAlt className="mr-2" />
                        View on Etherscan
                      </a>
                    )}

                    {session.isMockBlockchain && (
                      <div className="text-center text-sm text-yellow-600">
                        Local development mode - not on real blockchain
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Session Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Actions</h2>
              <div className="space-y-3">
                {showConfirmButton && (
                  <button
                    onClick={handleConfirm}
                    disabled={confirming}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
                  >
                    {confirming ? 'Confirming...' : statusInfo.actionText}
                  </button>
                )}

                {canReview && (
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="w-full bg-yellow-600 text-white py-3 rounded-lg hover:bg-yellow-700 font-medium"
                  >
                    <FaStar className="inline mr-2" />
                    Leave Review
                  </button>
                )}

                {isCompleted && (
                  <button
                    onClick={() => setShowDisputeModal(true)}
                    className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-medium"
                  >
                    <FaExclamationTriangle className="inline mr-2" />
                    Raise Dispute
                  </button>
                )}

                <button
                  onClick={() => navigate('/sessions')}
                  className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 font-medium"
                >
                  Back to Sessions
                </button>

                {isCompleted && session.onChainTxHash && (
                  <div className="space-y-2">
                    <button
                      onClick={() => copyToClipboard(session.onChainTxHash)}
                      className={`w-full py-3 rounded-lg font-medium ${
                        session.isMockBlockchain 
                          ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                      }`}
                    >
                      <FaCopy className="inline mr-2" />
                      Copy Transaction Hash
                    </button>
                    {session.isMockBlockchain ? (
                      <p className="text-xs text-center text-yellow-600">
                        Local development transaction
                      </p>
                    ) : (
                      <p className="text-xs text-center text-purple-600">
                        Real Sepolia transaction
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showReviewModal && (
        <ReviewModal
          session={session}
          onClose={() => setShowReviewModal(false)}
          onReviewSubmitted={() => {
            setHasReviewed(true);
            setShowReviewModal(false);
            toast.success('Review submitted successfully!');
          }}
        />
      )}

      {showDisputeModal && (
        <DisputeModal
          session={session}
          onClose={() => setShowDisputeModal(false)}
        />
      )}
    </div>
  );
};

export default SessionDetail;