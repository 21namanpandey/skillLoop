// components/RequestModal.jsx
import React, { useState } from 'react';
import { FaTimes, FaVideo, FaPhone, FaMapMarkerAlt, FaLink } from 'react-icons/fa';

const RequestModal = ({ isOpen, onClose, onSubmit, service, provider }) => {
  const [connectionType, setConnectionType] = useState('zoom');
  const [connectionDetails, setConnectionDetails] = useState('');
  const [additionalMessage, setAdditionalMessage] = useState('');

  if (!isOpen) return null;

  const connectionOptions = [
    { value: 'zoom', label: 'Zoom', icon: <FaVideo /> },
    { value: 'meet', label: 'Google Meet', icon: <FaVideo /> },
    { value: 'teams', label: 'Microsoft Teams', icon: <FaVideo /> },
    { value: 'phone', label: 'Phone Call', icon: <FaPhone /> },
    { value: 'in-person', label: 'In Person', icon: <FaMapMarkerAlt /> },
    { value: 'other', label: 'Other Platform', icon: <FaLink /> },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create a more detailed message
    const message = `I would like to request your ${service.serviceName} service.
    
Preferred Connection: ${connectionOptions.find(opt => opt.value === connectionType)?.label}
Connection Details: ${connectionDetails}
${additionalMessage ? `\nAdditional Details: ${additionalMessage}` : ''}`;

    onSubmit(message);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setConnectionType('zoom');
    setConnectionDetails('');
    setAdditionalMessage('');
  };

  const getPlaceholder = () => {
    switch (connectionType) {
      case 'zoom':
        return 'e.g., https://zoom.us/j/1234567890';
      case 'meet':
        return 'e.g., https://meet.google.com/abc-defg-hij';
      case 'teams':
        return 'e.g., Meeting link or dial-in number';
      case 'phone':
        return 'e.g., +1 (555) 123-4567';
      case 'in-person':
        return 'e.g., Preferred location or address';
      case 'other':
        return 'e.g., Platform name and connection details';
      default:
        return 'Enter connection details';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Request Service</h2>
            <p className="text-sm text-gray-600">
              {service.serviceName} • {provider.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Connection Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              How would you like to connect?
            </label>
            <div className="grid grid-cols-2 gap-3">
              {connectionOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setConnectionType(option.value)}
                  className={`flex items-center justify-center p-3 rounded-lg border-2 transition-all ${
                    connectionType === option.value
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{option.icon}</span>
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Connection Details */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Connection Details
            </label>
            <input
              type="text"
              value={connectionDetails}
              onChange={(e) => setConnectionDetails(e.target.value)}
              placeholder={getPlaceholder()}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-500 mt-2">
              Please provide the meeting link, phone number, or location details
            </p>
          </div>

          {/* Additional Message */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Message (Optional)
            </label>
            <textarea
              value={additionalMessage}
              onChange={(e) => setAdditionalMessage(e.target.value)}
              placeholder="Any specific requirements, preferred time, or additional information..."
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestModal;