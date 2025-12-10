// import React, { useState, useEffect } from 'react';
// import axiosClient from '../api/axiosClient';
// import { FaClock, FaCheck, FaTimes, FaUser, FaEnvelope, FaArrowRight } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-hot-toast';

// const Requests = () => {
//   const [activeTab, setActiveTab] = useState('incoming');
//   const [incomingRequests, setIncomingRequests] = useState([]);
//   const [outgoingRequests, setOutgoingRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   const fetchRequests = async () => {
//     try {
//       setLoading(true);
//       const [incomingResponse, outgoingResponse] = await Promise.all([
//         axiosClient.get('/requests/incoming'),
//         axiosClient.get('/requests/outgoing')
//       ]);
      
//       setIncomingRequests(incomingResponse.requests || []);
//       setOutgoingRequests(outgoingResponse.requests || []);
//     } catch (error) {
//       console.error('Error fetching requests:', error);
//       toast.error('Failed to load requests');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // In your handleStatusUpdate function
//   const handleStatusUpdate = async (requestId, status) => {
//     try {
//       await axiosClient.put(`/requests/${requestId}/status`, { status });
      
//       if (status === 'accepted') {
//         toast.success('Request accepted! Session created.');
//       } else {
//         toast.success(`Request ${status}`);
//       }
      
//       fetchRequests();
//     } catch (error) {
//       console.error('Error updating request status:', error);
      
//       // Handle specific error messages
//       if (error.message?.includes('Cannot accept your own request')) {
//         toast.error('You cannot accept your own request');
//       } else if (error.message?.includes('Not authorized')) {
//         toast.error('You are not authorized to perform this action');
//       } else {
//         toast.error('Failed to update request status');
//       }
//     }
//   };

//   const handleNavigateToSessions = () => {
//     navigate('/sessions');
//   };

//   const handleManageService = (sessionId) => {
//     navigate(`/sessions/${sessionId}`);
//   };

//   const getStatusBadge = (status) => {
//     const statusConfig = {
//       pending: { color: 'bg-yellow-100 text-yellow-800', icon: <FaClock /> },
//       accepted: { color: 'bg-green-100 text-green-800', icon: <FaCheck /> },
//       rejected: { color: 'bg-red-100 text-red-800', icon: <FaTimes /> },
//       cancelled: { color: 'bg-gray-100 text-gray-800', icon: <FaTimes /> }
//     };
    
//     const config = statusConfig[status] || statusConfig.pending;
    
//     return (
//       <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
//         {config.icon}
//         <span className="ml-2 capitalize">{status}</span>
//       </span>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="container mx-auto px-4">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Requests</h1>
//           <p className="text-gray-600">Manage your incoming and outgoing service requests</p>
//         </div>

//         {/* Tabs */}
//         <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
//           <div className="border-b border-gray-200">
//             <nav className="flex -mb-px">
//               <button
//                 onClick={() => setActiveTab('incoming')}
//                 className={`flex-1 py-4 px-6 text-center font-medium text-sm ${
//                   activeTab === 'incoming'
//                     ? 'border-b-2 border-blue-500 text-blue-600'
//                     : 'text-gray-500 hover:text-gray-700'
//                 }`}
//               >
//                 Incoming Requests
//                 <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
//                   {incomingRequests.length}
//                 </span>
//               </button>
//               <button
//                 onClick={() => setActiveTab('outgoing')}
//                 className={`flex-1 py-4 px-6 text-center font-medium text-sm ${
//                   activeTab === 'outgoing'
//                     ? 'border-b-2 border-blue-500 text-blue-600'
//                     : 'text-gray-500 hover:text-gray-700'
//                 }`}
//               >
//                 Outgoing Requests
//                 <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
//                   {outgoingRequests.length}
//                 </span>
//               </button>
//             </nav>
//           </div>

//           {/* Content */}
//           <div className="p-6">
//             {activeTab === 'incoming' ? (
//               <div>
//                 {incomingRequests.length === 0 ? (
//                   <div className="text-center py-12">
//                     <div className="text-gray-400 text-6xl mb-4">📭</div>
//                     <h3 className="text-xl font-semibold text-gray-700 mb-2">No incoming requests</h3>
//                     <p className="text-gray-500">When someone requests your services, they'll appear here</p>
//                   </div>
//                 ) : (
//                   <div className="space-y-6">
//                     {incomingRequests.map((request) => (
//                       <div key={request._id} className="border rounded-lg p-6 bg-gray-50 hover:bg-white transition-colors">
//                         <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
//                           <div>
//                             <div className="flex items-center mb-2">
//                               <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
//                                 <FaUser className="text-blue-600" />
//                               </div>
//                               <div>
//                                 <h3 className="font-semibold">{request.requesterId?.name}</h3>
//                                 <p className="text-sm text-gray-500 flex items-center">
//                                   <FaEnvelope className="mr-1" size={12} />
//                                   {request.requesterId?.email}
//                                 </p>
//                               </div>
//                             </div>
//                             <h4 className="text-lg font-medium mt-3">{request.serviceName}</h4>
//                             <p className="text-gray-600">{request.category}</p>
//                             {request.message && (
//                               <div className="mt-3 p-3 bg-white rounded border">
//                                 <p className="text-gray-700">{request.message}</p>
//                               </div>
//                             )}
//                           </div>
//                           <div className="mt-4 md:mt-0">
//                             {getStatusBadge(request.status)}
//                           </div>
//                         </div>

//                         <div className="flex items-center justify-between pt-4 border-t">
//                           <div className="text-sm text-gray-500">
//                             Requested {new Date(request.createdAt).toLocaleDateString()}
//                           </div>
//                           {request.status === 'pending' && (
//                             <div className="flex space-x-3">
//                               <button
//                                 onClick={() => handleStatusUpdate(request._id, 'accepted')}
//                                 className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center"
//                               >
//                                 <FaCheck className="mr-2" />
//                                 Accept Request
//                               </button>
//                               <button
//                                 onClick={() => handleStatusUpdate(request._id, 'rejected')}
//                                 className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center"
//                               >
//                                 <FaTimes className="mr-2" />
//                                 Reject
//                               </button>
//                             </div>
//                           )}
//                           {request.status === 'accepted' && (
//                             <div className="flex space-x-3">
//                               <button
//                                 onClick={handleNavigateToSessions}
//                                 className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
//                               >
//                                 <FaArrowRight className="mr-2" />
//                                 Go to Sessions
//                               </button>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <div>
//                 {outgoingRequests.length === 0 ? (
//                   <div className="text-center py-12">
//                     <div className="text-gray-400 text-6xl mb-4">📤</div>
//                     <h3 className="text-xl font-semibold text-gray-700 mb-2">No outgoing requests</h3>
//                     <p className="text-gray-500">Request services from other users to see them here</p>
//                   </div>
//                 ) : (
//                   <div className="space-y-6">
//                     {outgoingRequests.map((request) => (
//                       <div key={request._id} className="border rounded-lg p-6 bg-gray-50 hover:bg-white transition-colors">
//                         <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
//                           <div>
//                             <div className="flex items-center mb-2">
//                               <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
//                                 <FaUser className="text-blue-600" />
//                               </div>
//                               <div>
//                                 <h3 className="font-semibold">{request.providerId?.name}</h3>
//                                 <p className="text-sm text-gray-500">{request.providerId?.location || 'No location provided'}</p>
//                               </div>
//                             </div>
//                             <h4 className="text-lg font-medium mt-3">{request.serviceName}</h4>
//                             <p className="text-gray-600">{request.category}</p>
//                           </div>
//                           <div className="mt-4 md:mt-0">
//                             {getStatusBadge(request.status)}
//                           </div>
//                         </div>

//                         <div className="flex items-center justify-between pt-4 border-t">
//                           <div className="text-sm text-gray-500">
//                             Sent {new Date(request.createdAt).toLocaleDateString()}
//                           </div>
//                           {request.status === 'pending' && (
//                             <button
//                               onClick={() => handleStatusUpdate(request._id, 'cancelled')}
//                               className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
//                             >
//                               Cancel Request
//                             </button>
//                           )}
//                           {request.status === 'accepted' && (
//                             <button
//                               onClick={handleNavigateToSessions}
//                               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
//                             >
//                               <FaArrowRight className="mr-2" />
//                               View Session
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Quick Actions Card */}
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
//           <div className="grid md:grid-cols-2 gap-4">
//             <button
//               onClick={() => navigate('/browse')}
//               className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
//             >
//               <div className="flex items-center">
//                 <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
//                   <FaArrowRight className="text-blue-600" />
//                 </div>
//                 <div>
//                   <p className="font-medium">Browse Services</p>
//                   <p className="text-sm text-gray-500">Find more skills to exchange</p>
//                 </div>
//               </div>
//               <FaArrowRight className="text-blue-400" />
//             </button>
            
//             <button
//               onClick={() => navigate('/sessions')}
//               className="flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
//             >
//               <div className="flex items-center">
//                 <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
//                   <FaCheck className="text-green-600" />
//                 </div>
//                 <div>
//                   <p className="font-medium">View All Sessions</p>
//                   <p className="text-sm text-gray-500">Manage your active exchanges</p>
//                 </div>
//               </div>
//               <FaArrowRight className="text-green-400" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Requests;



import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { 
  FaClock, 
  FaCheck, 
  FaTimes, 
  FaUser, 
  FaEnvelope, 
  FaArrowRight,
  FaVideo,
  FaPhone,
  FaMapMarkerAlt,
  FaLink,
  FaHandshake,
  FaInfoCircle,
  FaGlobe,
  FaUserCircle
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Requests = () => {
  const [activeTab, setActiveTab] = useState('incoming');
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const [incomingResponse, outgoingResponse] = await Promise.all([
        axiosClient.get('/requests/incoming'),
        axiosClient.get('/requests/outgoing')
      ]);
      
      setIncomingRequests(incomingResponse.requests || []);
      setOutgoingRequests(outgoingResponse.requests || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, status) => {
    try {
      await axiosClient.put(`/requests/${requestId}/status`, { status });
      
      if (status === 'accepted') {
        toast.success('Request accepted! Session created.');
      } else {
        toast.success(`Request ${status}`);
      }
      
      fetchRequests();
    } catch (error) {
      console.error('Error updating request status:', error);
      
      if (error.message?.includes('Cannot accept your own request')) {
        toast.error('You cannot accept your own request');
      } else if (error.message?.includes('Not authorized')) {
        toast.error('You are not authorized to perform this action');
      } else {
        toast.error('Failed to update request status');
      }
    }
  };

  const handleNavigateToSessions = () => {
    navigate('/sessions');
  };

  // Extract all parts from the structured message
  const extractAllDetails = (message) => {
    if (!message) return null;
    
    const lines = message.split('\n').map(line => line.trim()).filter(line => line);
    
    let defaultMessage = '';
    let preferredConnection = '';
    let connectionDetails = '';
    let additionalDetails = '';
    
    // Parse each line
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.startsWith('I would like to request your')) {
        defaultMessage = line;
      } else if (line.startsWith('Preferred Connection:')) {
        preferredConnection = line.replace('Preferred Connection:', '').trim();
      } else if (line.startsWith('Connection Details:')) {
        connectionDetails = line.replace('Connection Details:', '').trim();
      } else if (line.startsWith('Additional Details:')) {
        additionalDetails = line.replace('Additional Details:', '').trim();
        // Check if there are more lines after this for additional details
        for (let j = i + 1; j < lines.length; j++) {
          if (lines[j] && !lines[j].includes(':') && lines[j] !== '') {
            additionalDetails += '\n' + lines[j];
          } else {
            break;
          }
        }
        break;
      }
    }
    
    return {
      defaultMessage,
      preferredConnection,
      connectionDetails,
      additionalDetails
    };
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: <FaClock /> },
      accepted: { color: 'bg-green-100 text-green-800', icon: <FaCheck /> },
      rejected: { color: 'bg-red-100 text-red-800', icon: <FaTimes /> },
      cancelled: { color: 'bg-gray-100 text-gray-800', icon: <FaTimes /> }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.icon}
        <span className="ml-2 capitalize">{status}</span>
      </span>
    );
  };

  const getConnectionIcon = (connectionType) => {
    if (!connectionType) return <FaHandshake className="text-gray-500" />;
    
    const lowerType = connectionType.toLowerCase();
    if (lowerType.includes('zoom') || lowerType.includes('meet') || lowerType.includes('teams') || lowerType.includes('video')) {
      return <FaVideo className="text-blue-500" />;
    } else if (lowerType.includes('phone') || lowerType.includes('call') || lowerType.includes('mobile')) {
      return <FaPhone className="text-green-500" />;
    } else if (lowerType.includes('in-person') || lowerType.includes('location') || lowerType.includes('address') || lowerType.includes('meet')) {
      return <FaMapMarkerAlt className="text-red-500" />;
    } else if (lowerType.includes('http') || lowerType.includes('link') || lowerType.includes('url')) {
      return <FaLink className="text-purple-500" />;
    }
    return <FaHandshake className="text-gray-500" />;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Requests</h1>
          <p className="text-gray-600">Manage your incoming and outgoing service requests</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('incoming')}
                className={`flex-1 py-4 px-6 text-center font-medium text-sm ${
                  activeTab === 'incoming'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Incoming Requests
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                  {incomingRequests.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('outgoing')}
                className={`flex-1 py-4 px-6 text-center font-medium text-sm ${
                  activeTab === 'outgoing'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Outgoing Requests
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                  {outgoingRequests.length}
                </span>
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'incoming' ? (
              <div>
                {incomingRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📭</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No incoming requests</h3>
                    <p className="text-gray-500">When someone requests your services, they'll appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {incomingRequests.map((request) => {
                      const details = extractAllDetails(request.message);
                      const requester = request.requesterId;
                      
                      return (
                        <div key={request._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex flex-col md:flex-row md:items-start justify-between">
                            <div className="flex-1">
                              {/* User Info with Bio and Location */}
                              <div className="flex items-start mb-3">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3 shrink-0">
                                  {requester?.profilePicture ? (
                                    <img 
                                      src={requester.profilePicture} 
                                      alt={requester.name}
                                      className="w-12 h-12 rounded-full object-cover"
                                    />
                                  ) : (
                                    <FaUserCircle className="text-blue-600 text-2xl" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h3 className="font-semibold text-gray-900 text-lg">{requester?.name}</h3>
                                      <p className="text-sm text-gray-500 flex items-center">
                                        <FaEnvelope className="mr-1" size={12} />
                                        {requester?.email}
                                      </p>
                                    </div>
                                    <div className="md:ml-4">
                                      {getStatusBadge(request.status)}
                                    </div>
                                  </div>
                                  
                                  {/* Bio and Location */}
                                  {(requester?.bio || requester?.location) && (
                                    <div className="mt-2 text-sm space-y-1">
                                      {requester?.bio && (
                                        <div className="flex items-start">
                                          <span className="text-blue-500 mr-2 mt-0.5">
                                            <FaInfoCircle size={14} />
                                          </span>
                                          <div className="flex-1">
                                            <span className="font-medium text-gray-700">Bio: </span>
                                            <span className="text-gray-900">
                                              {requester.bio}
                                            </span>
                                          </div>
                                        </div>
                                      )}
                                      
                                      {requester?.location && (
                                        <div className="flex items-start">
                                          <span className="text-green-500 mr-2 mt-0.5">
                                            <FaMapMarkerAlt size={14} />
                                          </span>
                                          <div className="flex-1">
                                            <span className="font-medium text-gray-700">Location: </span>
                                            <span className="text-gray-900">
                                              {requester.location}
                                            </span>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  
                                  {/* Service Info */}
                                  <div className="mt-3 pt-3 border-t border-gray-100">
                                    <div className="flex items-center justify-between">
                                      <h4 className="font-bold text-gray-900 text-lg">{request.serviceName}</h4>
                                      <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                                        {request.category}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  {/* Message Details */}
                                  {details && (
                                    <div className="mt-3 text-sm space-y-1.5">
                                      {/* Default Message */}
                                      {details.defaultMessage && (
                                        <div className="flex items-start">
                                          <span className="text-blue-500 mr-2 mt-0.5">
                                            <FaHandshake size={14} />
                                          </span>
                                          <div className="flex-1">
                                            <span className="font-medium text-gray-700">Request: </span>
                                            <span className="text-gray-900">
                                              {details.defaultMessage}
                                            </span>
                                          </div>
                                        </div>
                                      )}
                                      
                                      {/* Preferred Connection */}
                                      {details.preferredConnection && (
                                        <div className="flex items-start">
                                          <span className="text-blue-500 mr-2 mt-0.5">
                                            {getConnectionIcon(details.preferredConnection)}
                                          </span>
                                          <div className="flex-1">
                                            <span className="font-medium text-gray-700">Connection Type: </span>
                                            <span className="text-gray-900">
                                              {details.preferredConnection}
                                            </span>
                                          </div>
                                        </div>
                                      )}
                                      
                                      {/* Connection Details */}
                                      {details.connectionDetails && (
                                        <div className="flex items-start">
                                          <span className="text-green-500 mr-2 mt-0.5">
                                            <FaLink size={14} />
                                          </span>
                                          <div className="flex-1">
                                            <span className="font-medium text-gray-700">Connection Details: </span>
                                            {/* <span className="text-gray-900 wrap-break-word">
                                              {details.connectionDetails}
                                            </span> */}
                                            <a href={details.connectionDetails} target="_blank" rel="noopener noreferrer" className='text-blue-600 underline'>{details.connectionDetails}</a>
                                          </div>
                                        </div>
                                      )}
                                      
                                      {/* Additional Details */}
                                      {details.additionalDetails && (
                                        <div className="flex items-start">
                                          <span className="text-purple-500 mr-2 mt-0.5">
                                            <FaEnvelope size={14} />
                                          </span>
                                          <div className="flex-1">
                                            <span className="font-medium text-gray-700">Additional Info: </span>
                                            <span className="text-gray-900">
                                              {details.additionalDetails}
                                            </span>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center justify-between pt-3 border-t mt-3">
                            <div className="text-xs text-gray-500">
                              {formatDate(request.createdAt)}
                            </div>
                            
                            <div className="flex space-x-2">
                              {request.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleStatusUpdate(request._id, 'accepted')}
                                    className="bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center"
                                  >
                                    <FaCheck className="mr-1" />
                                    Accept
                                  </button>
                                  <button
                                    onClick={() => handleStatusUpdate(request._id, 'rejected')}
                                    className="bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center"
                                  >
                                    <FaTimes className="mr-1" />
                                    Reject
                                  </button>
                                </>
                              )}
                              {request.status === 'accepted' && (
                                <button
                                  onClick={handleNavigateToSessions}
                                  className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center"
                                >
                                  <FaArrowRight className="mr-1" />
                                  Go to Sessions
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
            ) : (
              <div>
                {outgoingRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📤</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No outgoing requests</h3>
                    <p className="text-gray-500">Request services from other users to see them here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {outgoingRequests.map((request) => {
                      const details = extractAllDetails(request.message);
                      const provider = request.providerId;
                      
                      return (
                        <div key={request._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex flex-col md:flex-row md:items-start justify-between">
                            <div className="flex-1">
                              {/* Provider Info with Bio and Location */}
                              <div className="flex items-start mb-3">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3 shrink-0">
                                  {provider?.profilePicture ? (
                                    <img 
                                      src={provider.profilePicture} 
                                      alt={provider.name}
                                      className="w-12 h-12 rounded-full object-cover"
                                    />
                                  ) : (
                                    <FaUserCircle className="text-blue-600 text-2xl" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h3 className="font-semibold text-gray-900 text-lg">{provider?.name}</h3>
                                      <p className="text-sm text-gray-500">
                                        {provider?.email}
                                      </p>
                                    </div>
                                    <div className="md:ml-4">
                                      {getStatusBadge(request.status)}
                                    </div>
                                  </div>
                                  
                                  {/* Bio and Location */}
                                  {(provider?.bio || provider?.location) && (
                                    <div className="mt-2 text-sm space-y-1">
                                      {provider?.bio && (
                                        <div className="flex items-start">
                                          <span className="text-blue-500 mr-2 mt-0.5">
                                            <FaInfoCircle size={14} />
                                          </span>
                                          <div className="flex-1">
                                            <span className="font-medium text-gray-700">Bio: </span>
                                            <span className="text-gray-900">
                                              {provider.bio}
                                            </span>
                                          </div>
                                        </div>
                                      )}
                                      
                                      {provider?.location && (
                                        <div className="flex items-start">
                                          <span className="text-green-500 mr-2 mt-0.5">
                                            <FaMapMarkerAlt size={14} />
                                          </span>
                                          <div className="flex-1">
                                            <span className="font-medium text-gray-700">Location: </span>
                                            <span className="text-gray-900">
                                              {provider.location}
                                            </span>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  
                                  {/* Service Info */}
                                  <div className="mt-3 pt-3 border-t border-gray-100">
                                    <div className="flex items-center justify-between">
                                      <h4 className="font-bold text-gray-900 text-lg">{request.serviceName}</h4>
                                      <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                                        {request.category}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  {/* Your Message Details */}
                                  {details && (
                                    <div className="mt-3 text-sm space-y-1.5 bg-blue-50 p-3 rounded-lg">
                                      <div className="font-medium text-blue-800 mb-2 flex items-center">
                                        <FaUserCircle className="mr-2" />
                                        Your Request Details
                                      </div>
                                      
                                      {/* Default Message */}
                                      {details.defaultMessage && (
                                        <div className="flex items-start">
                                          <span className="text-blue-500 mr-2 mt-0.5">
                                            <FaHandshake size={14} />
                                          </span>
                                          <div className="flex-1">
                                            <span className="font-medium text-blue-700">Request: </span>
                                            <span className="text-blue-900">
                                              {details.defaultMessage}
                                            </span>
                                          </div>
                                        </div>
                                      )}
                                      
                                      {/* Preferred Connection */}
                                      {details.preferredConnection && (
                                        <div className="flex items-start">
                                          <span className="text-blue-500 mr-2 mt-0.5">
                                            {getConnectionIcon(details.preferredConnection)}
                                          </span>
                                          <div className="flex-1">
                                            <span className="font-medium text-blue-700">Connection Type: </span>
                                            <span className="text-blue-900">
                                              {details.preferredConnection}
                                            </span>
                                          </div>
                                        </div>
                                      )}
                                      
                                      {/* Connection Details */}
                                      {details.connectionDetails && (
                                        <div className="flex items-start">
                                          <span className="text-green-500 mr-2 mt-0.5">
                                            <FaLink size={14} />
                                          </span>
                                          <div className="flex-1">
                                            <span className="font-medium text-blue-700">Connection Details: </span>
                                            {/* <span className="text-blue-900 wrap-break-word">
                                              {details.connectionDetails}
                                            </span> */}
                                            <a href={details.connectionDetails} target="_blank" rel="noopener noreferrer" className='text-blue-600 underline'>{details.connectionDetails}</a>
                                          </div>
                                        </div>
                                      )}
                                      
                                      {/* Additional Details */}
                                      {details.additionalDetails && (
                                        <div className="flex items-start">
                                          <span className="text-purple-500 mr-2 mt-0.5">
                                            <FaEnvelope size={14} />
                                          </span>
                                          <div className="flex-1">
                                            <span className="font-medium text-blue-700">Additional Info: </span>
                                            <span className="text-blue-900">
                                              {details.additionalDetails}
                                            </span>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center justify-between pt-3 border-t mt-3">
                            <div className="text-xs text-gray-500">
                              {formatDate(request.createdAt)}
                            </div>
                            
                            <div className="flex space-x-2">
                              {request.status === 'pending' && (
                                <button
                                  onClick={() => handleStatusUpdate(request._id, 'cancelled')}
                                  className="bg-gray-600 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                                >
                                  Cancel
                                </button>
                              )}
                              {request.status === 'accepted' && (
                                <button
                                  onClick={handleNavigateToSessions}
                                  className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center"
                                >
                                  <FaArrowRight className="mr-1" />
                                  View Session
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
            )}
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/browse')}
              className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <FaArrowRight className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Browse Services</p>
                  <p className="text-sm text-gray-500">Find more skills to exchange</p>
                </div>
              </div>
              <FaArrowRight className="text-blue-400" />
            </button>
            
            <button
              onClick={() => navigate('/sessions')}
              className="flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <FaCheck className="text-green-600" />
                </div>
                <div>
                  <p className="font-medium">View All Sessions</p>
                  <p className="text-sm text-gray-500">Manage your active exchanges</p>
                </div>
              </div>
              <FaArrowRight className="text-green-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Requests;