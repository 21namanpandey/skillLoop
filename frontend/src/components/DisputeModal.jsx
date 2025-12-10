import React, { useState } from 'react';
import { FaExclamationTriangle, FaPaperclip, FaTimes } from 'react-icons/fa';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-hot-toast';

const DisputeModal = ({ session, onClose }) => {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [evidence, setEvidence] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const reasons = [
    { value: "poor_quality", label: "Poor Quality Work" },
    { value: "not_completed", label: "Service Not Completed" },
    { value: "time_mismatch", label: "Time Spent Doesn't Match" },
    { value: "other", label: "Other Issue" }
  ];

  const getSafeId = (obj) => {
    if (!obj) return null;
    return obj._id || obj.id || null;
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    // In production, upload to cloud storage
    const newEvidence = files.map(file => ({
      type: file.type.startsWith('image/') ? 'image' : 'document',
      name: file.name,
      size: file.size,
      file
    }));
    setEvidence([...evidence, ...newEvidence]);
  };

  const removeEvidence = (index) => {
    setEvidence(evidence.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!reason || !description) {
      toast.error('Please provide reason and description');
      return;
    }

    if (description.length < 20) {
      toast.error('Please provide a more detailed description (min 20 characters)');
      return;
    }

    try {
      setSubmitting(true);
      
      // In production, upload files first and get URLs
      const evidenceUrls = evidence.map(item => ({
        type: item.type,
        url: `uploaded_${item.name}`, // Replace with actual URL
        description: item.name
      }));

      await axiosClient.post('/disputes', {
        sessionId: getSafeId(session),
        reason,
        description,
        evidence: evidenceUrls
      });
      
      toast.success('Dispute raised successfully. Our team will review it.');
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to raise dispute');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
              <FaExclamationTriangle className="text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Raise a Dispute</h2>
              <p className="text-sm text-gray-600">Service: {session.serviceName}</p>
            </div>
            <button onClick={onClose} className="ml-auto text-gray-400 hover:text-gray-600">
              <FaTimes size={20} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Reason */}
            <div>
              <label className="block text-gray-700 mb-2">Reason for Dispute *</label>
              <div className="space-y-2">
                {reasons.map((opt) => (
                  <label key={opt.value} className="flex items-center">
                    <input
                      type="radio"
                      name="reason"
                      value={opt.value}
                      checked={reason === opt.value}
                      onChange={(e) => setReason(e.target.value)}
                      className="mr-2"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-700 mb-2">Detailed Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Please describe the issue in detail..."
                required
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {description.length}/1000
              </div>
            </div>

            {/* Evidence Upload */}
            <div>
              <label className="block text-gray-700 mb-2">
                <FaPaperclip className="inline mr-2" />
                Supporting Evidence (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="evidence-upload"
                />
                <label htmlFor="evidence-upload" className="cursor-pointer block">
                  <div className="text-gray-600">
                    <p className="mb-2">Click to upload screenshots or documents</p>
                    <p className="text-sm">Supports images, PDFs (Max 10MB each)</p>
                  </div>
                </label>
              </div>
              
              {/* Evidence Preview */}
              {evidence.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">Uploaded ({evidence.length}):</p>
                  <div className="space-y-2">
                    {evidence.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <div className="flex items-center">
                          <FaPaperclip className="text-gray-400 mr-2" size={14} />
                          <span className="text-sm truncate max-w-[200px]">{item.name}</span>
                          <span className="text-xs text-gray-500 ml-2">
                            ({(item.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          onClick={() => removeEvidence(index)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Warning */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Raising false disputes may affect your reputation. 
                Please use this only for legitimate issues. Our team will review within 48 hours.
              </p>
            </div>

            {/* Submit */}
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || !reason || !description || description.length < 20}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Raise Dispute'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisputeModal;