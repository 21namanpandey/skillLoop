import React from 'react';
import { FaClock, FaGlobe, FaUser } from 'react-icons/fa';

const ServiceCard = ({ service, provider, onRequest }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{service.serviceName}</h3>
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mt-1">
            {service.category}
          </span>
        </div>
        <span className="text-lg font-bold text-blue-600">
          {service.estimatedHours} hr
        </span>
      </div>

      <p className="text-gray-600 mb-4">{service.description}</p>

      <div className="flex items-center text-gray-500 text-sm mb-4">
        <FaClock className="mr-2" />
        <span>{service.estimatedHours} hours</span>
        <FaGlobe className="ml-4 mr-2" />
        <span>{service.mode}</span>
      </div>

      <div className="flex items-center justify-between border-t pt-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <FaUser className="text-blue-600" />
          </div>
          <div>
            <p className="font-semibold">{provider.name}</p>
            <p className="text-sm text-gray-500">
              {provider.totalSessions || 0} sessions • {provider.totalHoursProvided || 0} hrs
            </p>
          </div>
        </div>

        <button
          onClick={onRequest}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          Request
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;