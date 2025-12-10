// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import axiosClient from '../api/axiosClient';
// import { 
//   FaArrowLeft, 
//   FaEthereum, 
//   FaLink, 
//   FaChartBar, 
//   FaExternalLinkAlt,
//   FaCheckCircle,
//   FaHistory,
//   FaUserCheck
// } from 'react-icons/fa';
// import ReputationBadge from '../components/ReputationBadge';

// const BlockchainStats = () => {
//   const { user } = useAuth();
//   const [stats, setStats] = useState(null);
//   const [reputation, setReputation] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   const fetchStats = async () => {
//     try {
//       setLoading(true);
      
//       // Fetch blockchain stats
//       const blockchainResponse = await axiosClient.get('/sessions/blockchain/stats');
      
//       // Fetch reputation
//       const reputationResponse = await axiosClient.get(`/reviews/reputation/${user?.id}`);
      
//       setStats(blockchainResponse.stats || { totalSessions: 0, userSessions: [] });
//       setReputation(reputationResponse.reputation || { points: 0, level: 'Novice' });
//     } catch (error) {
//       console.error('Error fetching stats:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-8">
//         <div className="container mx-auto px-4">
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="container mx-auto px-4">
//         {/* Header */}
//         <div className="mb-8">
//           <Link
//             to="/dashboard"
//             className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
//           >
//             <FaArrowLeft className="mr-2" />
//             Back to Dashboard
//           </Link>
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Blockchain & Reputation</h1>
//           <p className="text-gray-600">
//             Your verified service history and reputation scores
//           </p>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid lg:grid-cols-3 gap-8">
//           {/* Left Column - Reputation */}
//           <div className="lg:col-span-2 space-y-8">
//             {/* Reputation Card */}
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <div className="flex items-center">
//                   <div className="w-12 h-12 bg-linear-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center mr-3">
//                     <FaChartBar className="text-purple-600 text-xl" />
//                   </div>
//                   <div>
//                     <h2 className="text-xl font-bold text-gray-900">Your Reputation</h2>
//                     <p className="text-sm text-gray-500">Earned through quality service</p>
//                   </div>
//                 </div>
//                 <ReputationBadge 
//                   level={reputation?.level || 'Novice'} 
//                   points={reputation?.points || 0}
//                   showDetails={true}
//                   size="lg"
//                 />
//               </div>

//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//                 <div className="bg-blue-50 p-4 rounded-lg">
//                   <div className="flex items-center mb-2">
//                     <FaCheckCircle className="text-blue-600 mr-2" />
//                     <span className="font-semibold">Sessions</span>
//                   </div>
//                   <div className="text-2xl font-bold">{user?.totalSessions || 0}</div>
//                   <div className="text-sm text-gray-600">Completed</div>
//                 </div>

//                 <div className="bg-green-50 p-4 rounded-lg">
//                   <div className="flex items-center mb-2">
//                     <FaUserCheck className="text-green-600 mr-2" />
//                     <span className="font-semibold">Rating</span>
//                   </div>
//                   <div className="text-2xl font-bold">{user?.rating || 0}</div>
//                   <div className="text-sm text-gray-600">Average</div>
//                 </div>

//                 <div className="bg-yellow-50 p-4 rounded-lg">
//                   <div className="flex items-center mb-2">
//                     <FaHistory className="text-yellow-600 mr-2" />
//                     <span className="font-semibold">Hours</span>
//                   </div>
//                   <div className="text-2xl font-bold">{user?.totalHoursProvided || 0}</div>
//                   <div className="text-sm text-gray-600">Provided</div>
//                 </div>

//                 <div className="bg-purple-50 p-4 rounded-lg">
//                   <div className="flex items-center mb-2">
//                     <FaEthereum className="text-purple-600 mr-2" />
//                     <span className="font-semibold">On Chain</span>
//                   </div>
//                   <div className="text-2xl font-bold">{stats?.userSessions?.length || 0}</div>
//                   <div className="text-sm text-gray-600">Verified</div>
//                 </div>
//               </div>

//               <div className="border-t pt-6">
//                 <h3 className="font-semibold mb-3">How to earn more points:</h3>
//                 <ul className="space-y-2 text-sm text-gray-600">
//                   <li className="flex items-start">
//                     <span className="text-green-500 mr-2">+10</span>
//                     <span>Complete a service session</span>
//                   </li>
//                   <li className="flex items-start">
//                     <span className="text-green-500 mr-2">+15</span>
//                     <span>Give a positive review (4-5 stars)</span>
//                   </li>
//                   <li className="flex items-start">
//                     <span className="text-green-500 mr-2">+20</span>
//                     <span>Receive a positive review</span>
//                   </li>
//                   <li className="flex items-start">
//                     <span className="text-green-500 mr-2">+25</span>
//                     <span>Log session on blockchain</span>
//                   </li>
//                 </ul>
//               </div>
//             </div>

//             {/* Blockchain Sessions */}
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <div className="flex items-center mb-6">
//                 <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
//                   <FaLink className="text-blue-600" />
//                 </div>
//                 <div>
//                   <h2 className="text-xl font-bold text-gray-900">Blockchain Sessions</h2>
//                   <p className="text-sm text-gray-500">Your permanently recorded sessions</p>
//                 </div>
//               </div>

//               {stats?.userSessions?.length > 0 ? (
//                 <div className="space-y-4">
//                   {stats.userSessions.map((sessionIndex, idx) => (
//                     <div key={idx} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
//                       <div className="flex justify-between items-center">
//                         <div>
//                           <p className="font-medium">Session #{sessionIndex}</p>
//                           <p className="text-sm text-gray-500">
//                             Index on blockchain: {sessionIndex}
//                           </p>
//                         </div>
//                         <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
//                           Verified
//                         </span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-8">
//                   <div className="text-gray-400 text-5xl mb-4">🔗</div>
//                   <h3 className="text-lg font-semibold text-gray-700 mb-2">No blockchain sessions yet</h3>
//                   <p className="text-gray-500 mb-4">
//                     Complete sessions and confirm them to record on blockchain
//                   </p>
//                   {!user?.walletAddress && (
//                     <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 inline-block">
//                       <p className="text-sm text-yellow-800">
//                         Add your wallet address in profile to enable blockchain logging
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Right Column - Blockchain Info */}
//           <div className="space-y-8">
//             {/* Blockchain Stats Card */}
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <div className="flex items-center mb-6">
//                 <div className="w-10 h-10 bg-linear-to-r from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center mr-3">
//                   <FaEthereum className="text-blue-600 text-xl" />
//                 </div>
//                 <div>
//                   <h2 className="text-xl font-bold text-gray-900">Blockchain Network</h2>
//                   <p className="text-sm text-gray-500">Ethereum Sepolia Testnet</p>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <div className="flex justify-between items-center py-3 border-b">
//                   <span className="text-gray-600">Total Network Sessions</span>
//                   <span className="font-bold text-blue-600">{stats?.totalSessions || 0}</span>
//                 </div>
                
//                 <div className="flex justify-between items-center py-3 border-b">
//                   <span className="text-gray-600">Your Sessions</span>
//                   <span className="font-bold text-green-600">{stats?.userSessions?.length || 0}</span>
//                 </div>
                
//                 <div className="flex justify-between items-center py-3 border-b">
//                   <span className="text-gray-600">Wallet Status</span>
//                   <span className={`px-3 py-1 rounded-full text-sm ${
//                     user?.walletAddress 
//                       ? 'bg-green-100 text-green-800' 
//                       : 'bg-yellow-100 text-yellow-800'
//                   }`}>
//                     {user?.walletAddress ? 'Connected' : 'Not Connected'}
//                   </span>
//                 </div>
//               </div>

//               <div className="mt-6">
//                 <a
//                   href="https://sepolia.etherscan.io"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center justify-center w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
//                 >
//                   <FaExternalLinkAlt className="mr-2" />
//                   View on Etherscan
//                 </a>
//               </div>
//             </div>

//             {/* Benefits Card */}
//             <div className="bg-linear-to-r from-purple-50 to-blue-50 rounded-xl shadow-lg p-6 border border-purple-100">
//               <h3 className="text-lg font-bold text-gray-900 mb-4">Benefits of Blockchain</h3>
//               <ul className="space-y-3">
//                 <li className="flex items-start">
//                   <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
//                     <span className="text-purple-600 text-sm">✓</span>
//                   </div>
//                   <span className="text-sm">Permanent, unchangeable records</span>
//                 </li>
//                 <li className="flex items-start">
//                   <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
//                     <span className="text-purple-600 text-sm">✓</span>
//                   </div>
//                   <span className="text-sm">Verifiable by anyone</span>
//                 </li>
//                 <li className="flex items-start">
//                   <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
//                     <span className="text-purple-600 text-sm">✓</span>
//                   </div>
//                   <span className="text-sm">Builds trust with clients</span>
//                 </li>
//                 <li className="flex items-start">
//                   <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
//                     <span className="text-purple-600 text-sm">✓</span>
//                   </div>
//                   <span className="text-sm">Extra reputation points</span>
//                 </li>
//               </ul>
//             </div>

//             {/* Quick Actions */}
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
//               <div className="space-y-3">
//                 <Link
//                   to="/sessions"
//                   className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
//                 >
//                   <div className="flex items-center">
//                     <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
//                       <FaHistory className="text-blue-600" />
//                     </div>
//                     <span className="font-medium">View Sessions</span>
//                   </div>
//                   <FaArrowLeft className="transform rotate-180 text-gray-400" />
//                 </Link>
                
//                 <Link
//                   to="/profile"
//                   className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
//                 >
//                   <div className="flex items-center">
//                     <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
//                       <FaUserCheck className="text-green-600" />
//                     </div>
//                     <span className="font-medium">Update Profile</span>
//                   </div>
//                   <FaArrowLeft className="transform rotate-180 text-gray-400" />
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BlockchainStats;




import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import { 
  FaArrowLeft, 
  FaEthereum, 
  FaLink, 
  FaChartBar, 
  FaExternalLinkAlt,
  FaCheckCircle,
  FaHistory,
  FaUserCheck
} from 'react-icons/fa';
import ReputationBadge from '../components/ReputationBadge';

const BlockchainStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [reputation, setReputation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      const blockchainResponse = await axiosClient.get('/sessions/blockchain/stats');
      
      const reputationResponse = await axiosClient.get(`/reviews/reputation/${user?.id}`);
      
      setStats(blockchainResponse?.stats || { totalSessions: 0, userSessions: [] });
      setReputation(reputationResponse?.reputation || { points: 0, level: 'Novice' });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({ totalSessions: 0, userSessions: [] });
      setReputation({ points: 0, level: 'Novice' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Blockchain & Reputation</h1>
          <p className="text-gray-600">
            Your verified service history and reputation scores
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Reputation */}
          <div className="lg:col-span-2 space-y-8">
            {/* Reputation Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center mr-3">
                    <FaChartBar className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Your Reputation</h2>
                    <p className="text-sm text-gray-500">Earned through quality service</p>
                  </div>
                </div>
                <ReputationBadge 
                  level={reputation?.level || 'Novice'} 
                  points={reputation?.points || 0}
                  showDetails={true}
                  size="lg"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FaCheckCircle className="text-blue-600 mr-2" />
                    <span className="font-semibold">Sessions</span>
                  </div>
                  <div className="text-2xl font-bold">{stats?.userSessions?.length || 0}</div>
                  <div className="text-sm text-gray-600">On Chain</div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FaUserCheck className="text-green-600 mr-2" />
                    <span className="font-semibold">Rating</span>
                  </div>
                  <div className="text-2xl font-bold">{user?.rating || 0}</div>
                  <div className="text-sm text-gray-600">Average</div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FaHistory className="text-yellow-600 mr-2" />
                    <span className="font-semibold">Hours</span>
                  </div>
                  <div className="text-2xl font-bold">{user?.totalHoursProvided || 0}</div>
                  <div className="text-sm text-gray-600">Provided</div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FaEthereum className="text-purple-600 mr-2" />
                    <span className="font-semibold">Points</span>
                  </div>
                  <div className="text-2xl font-bold">{reputation?.points || 0}</div>
                  <div className="text-sm text-gray-600">Reputation</div>
                </div>
              </div>

              {/* Display Badges */}
              {reputation?.badges && reputation.badges.length > 0 && (
                <div className="border-t pt-6 mb-6">
                  <h3 className="font-semibold mb-3">Your Badges:</h3>
                  <div className="flex flex-wrap gap-3">
                    {reputation.badges.map((badge, idx) => (
                      <div key={badge._id || idx} className="bg-gray-50 rounded-lg p-3 flex items-center">
                        <span className="text-2xl mr-2">{badge.icon}</span>
                        <div>
                          <p className="font-medium">{badge.name}</p>
                          <p className="text-xs text-gray-500">{badge.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-3">How to earn more points:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">+12</span>
                    <span>Complete a service session</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">+15</span>
                    <span>Give a positive review (4-5 stars)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">+15</span>
                    <span>Receive a positive review</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">+25</span>
                    <span>Log session on blockchain</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Blockchain Sessions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <FaLink className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Blockchain Sessions</h2>
                  <p className="text-sm text-gray-500">Your permanently recorded sessions</p>
                </div>
              </div>

              {stats?.userSessions && stats.userSessions.length > 0 ? (
                <div className="space-y-4">
                  {stats.userSessions.map((session, idx) => (
                    <div key={session.sessionId || idx} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <p className="font-medium">Session #{session.index}</p>
                          <p className="text-sm text-gray-500">
                            {session.category} • {session.units} unit{session.units !== '1' ? 's' : ''}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(session.timestamp).toLocaleDateString()} • {new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          Verified
                        </span>
                      </div>
                      <div className="text-sm">
                        <div className="flex items-center">
                          <span className="text-gray-600">Provider: </span>
                          <span className="font-mono ml-1 text-xs">{session.provider?.slice(0, 10)}...</span>
                          {session.provider !== session.client && (
                            <>
                              <span className="mx-2">•</span>
                              <span className="text-gray-600">Client: </span>
                              <span className="font-mono ml-1 text-xs">{session.client?.slice(0, 10)}...</span>
                            </>
                          )}
                        </div>
                        <div className="mt-2 text-xs text-blue-600">
                          Session ID: {session.sessionId}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-5xl mb-4">🔗</div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No blockchain sessions yet</h3>
                  <p className="text-gray-500 mb-4">
                    Complete sessions and confirm them to record on blockchain
                  </p>
                  {!user?.walletAddress && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 inline-block">
                      <p className="text-sm text-yellow-800">
                        Add your wallet address in profile to enable blockchain logging
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Blockchain Info */}
          <div className="space-y-8">
            {/* Blockchain Stats Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center mr-3">
                  <FaEthereum className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Blockchain Network</h2>
                  <p className="text-sm text-gray-500">Ethereum Sepolia Testnet</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-gray-600">Total Network Sessions</span>
                  <span className="font-bold text-blue-600">{stats?.totalSessions || 0}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-gray-600">Your Sessions</span>
                  <span className="font-bold text-green-600">{stats?.userSessions?.length || 0}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-gray-600">Reputation Level</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    {reputation?.level || 'Novice'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-gray-600">Wallet Status</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    user?.walletAddress 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user?.walletAddress ? 'Connected' : 'Not Connected'}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <a
                  href="https://sepolia.etherscan.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <FaExternalLinkAlt className="mr-2" />
                  View on Etherscan
                </a>
              </div>
            </div>

            {/* Benefits Card */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl shadow-lg p-6 border border-purple-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Benefits of Blockchain</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-purple-600 text-sm">✓</span>
                  </div>
                  <span className="text-sm">Permanent, unchangeable records</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-purple-600 text-sm">✓</span>
                  </div>
                  <span className="text-sm">Verifiable by anyone</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-purple-600 text-sm">✓</span>
                  </div>
                  <span className="text-sm">Builds trust with clients</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-purple-600 text-sm">✓</span>
                  </div>
                  <span className="text-sm">Extra reputation points</span>
                </li>
              </ul>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/sessions"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <FaHistory className="text-blue-600" />
                    </div>
                    <span className="font-medium">View Sessions</span>
                  </div>
                  <FaArrowLeft className="transform rotate-180 text-gray-400" />
                </Link>
                
                <Link
                  to="/profile"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <FaUserCheck className="text-green-600" />
                    </div>
                    <span className="font-medium">Update Profile</span>
                  </div>
                  <FaArrowLeft className="transform rotate-180 text-gray-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainStats;