// import React, { useState, useEffect } from 'react';
// import ServiceCard from '../components/ServiceCard';
// import axiosClient from '../api/axiosClient';
// import { FaSearch, FaFilter } from 'react-icons/fa';
// import { toast } from 'react-hot-toast';

// const BrowseServices = () => {
//   const [services, setServices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     category: '',
//     search: '',
//     mode: '',
//   });

//   const categories = [
//     'Design',
//     'Development',
//     'Video',
//     'Writing',
//     'Mentoring',
//     'Other'
//   ];

//   const modes = ['Online', 'Offline', 'Both'];

//   useEffect(() => {
//     fetchServices();
//   }, []);

//   const fetchServices = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosClient.get('/users/services', {
//         params: filters,
//       });
      
//       // Backend already filters out own services, so just set directly
//       setServices(response.services || []);
//     } catch (error) {
//       console.error('Error fetching services:', error);
//       toast.error('Failed to load services');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFilterChange = (key, value) => {
//     setFilters((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleRequestService = async (providerId, service) => {
//     try {
//       await axiosClient.post('/requests', {
//         providerId,
//         serviceName: service.serviceName,
//         category: service.category,
//         message: `I would like to request your ${service.serviceName} service.`,
//       });
//       toast.success('Service request sent successfully!');
//     } catch (error) {
//       if (error.message?.includes('own service')) {
//         toast.error('You cannot request your own service');
//       } else if (error.message?.includes('already have a pending request')) {
//         toast.error('You already requested this service');
//       } else if (error.message?.includes('does not offer')) {
//         toast.error('Provider does not offer this service anymore');
//       } else {
//         toast.error('Failed to send request. Please try again.');
//       }
//     }
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
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Services</h1>
//           <p className="text-gray-600">
//             Discover talented professionals offering their skills and services
//           </p>
//           <p className="text-sm text-blue-600 mt-1">
//             Note: Your own services are automatically hidden
//           </p>
//         </div>

//         {/* Filters */}
//         <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
//           <div className="flex items-center mb-4">
//             <FaFilter className="text-blue-600 mr-2" />
//             <h2 className="text-lg font-semibold">Filters</h2>
//           </div>

//           <div className="grid md:grid-cols-3 gap-4 mb-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Category
//               </label>
//               <select
//                 value={filters.category}
//                 onChange={(e) => handleFilterChange('category', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="">All Categories</option>
//                 {categories.map((cat) => (
//                   <option key={cat} value={cat}>{cat}</option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Mode
//               </label>
//               <select
//                 value={filters.mode}
//                 onChange={(e) => handleFilterChange('mode', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="">All Modes</option>
//                 {modes.map((mode) => (
//                   <option key={mode} value={mode}>{mode}</option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Search
//               </label>
//               <div className="relative">
//                 <input
//                   type="text"
//                   value={filters.search}
//                   onChange={(e) => handleFilterChange('search', e.target.value)}
//                   placeholder="Search services..."
//                   className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <FaSearch className="absolute left-3 top-3 text-gray-400" />
//               </div>
//             </div>
//           </div>

//           <button
//             onClick={fetchServices}
//             className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
//           >
//             Apply Filters
//           </button>
//         </div>

//         {/* Services Grid */}
//         <div className="mb-8">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-semibold">
//               {services.length} Services Available
//             </h2>
//           </div>

//           {services.length === 0 ? (
//             <div className="text-center py-12">
//               <div className="text-gray-400 text-6xl mb-4">🔍</div>
//               <h3 className="text-xl font-semibold text-gray-700 mb-2">No services found</h3>
//               <p className="text-gray-500">
//                 {filters.category || filters.search || filters.mode
//                   ? "Try adjusting your filters"
//                   : "No services available at the moment. Check back later!"}
//               </p>
//             </div>
//           ) : (
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {services.map((item, index) => (
//                 <ServiceCard
//                   key={index}
//                   service={item.service}
//                   provider={item.provider}
//                   onRequest={() => handleRequestService(item.provider.id, item.service)}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BrowseServices;


// pages/BrowseServices.jsx
import React, { useState, useEffect } from 'react';
import ServiceCard from '../components/ServiceCard';
import RequestModal from '../components/RequestModal';
import axiosClient from '../api/axiosClient';
import { FaSearch, FaFilter } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const BrowseServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    mode: '',
  });

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const categories = [
    'Design',
    'Development',
    'Video',
    'Writing',
    'Mentoring',
    'Other'
  ];

  const modes = ['Online', 'Offline', 'Both'];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/users/services', {
        params: filters,
      });
      setServices(response.services || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Updated request handler
  const handleRequestClick = (provider, service) => {
    setSelectedProvider(provider);
    setSelectedService(service);
    setModalOpen(true);
  };

  // Function to send the request with custom message
  const sendRequest = async (customMessage) => {
    try {
      await axiosClient.post('/requests', {
        providerId: selectedProvider.id,
        serviceName: selectedService.serviceName,
        category: selectedService.category,
        message: customMessage,
      });
      toast.success('Service request sent successfully!');
    } catch (error) {
      if (error.message?.includes('own service')) {
        toast.error('You cannot request your own service');
      } else if (error.message?.includes('already have a pending request')) {
        toast.error('You already requested this service');
      } else if (error.message?.includes('does not offer')) {
        toast.error('Provider does not offer this service anymore');
      } else {
        toast.error('Failed to send request. Please try again.');
      }
    }
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Services</h1>
          <p className="text-gray-600">
            Discover talented professionals offering their skills and services
          </p>
          <p className="text-sm text-blue-600 mt-1">
            Note: Your own services are automatically hidden
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <FaFilter className="text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold">Filters</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mode
              </label>
              <select
                value={filters.mode}
                onChange={(e) => handleFilterChange('mode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Modes</option>
                {modes.map((mode) => (
                  <option key={mode} value={mode}>{mode}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search services..."
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
          </div>

          <button
            onClick={fetchServices}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>

        {/* Services Grid */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {services.length} Services Available
            </h2>
          </div>

          {services.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No services found</h3>
              <p className="text-gray-500">
                {filters.category || filters.search || filters.mode
                  ? "Try adjusting your filters"
                  : "No services available at the moment. Check back later!"}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((item, index) => (
                <ServiceCard
                  key={index}
                  service={item.service}
                  provider={item.provider}
                  onRequest={() => handleRequestClick(item.provider, item.service)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Request Modal */}
      {modalOpen && selectedService && selectedProvider && (
        <RequestModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={sendRequest}
          service={selectedService}
          provider={selectedProvider}
        />
      )}
    </div>
  );
};

export default BrowseServices;