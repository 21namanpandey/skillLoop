import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import { FaUser, FaMapMarkerAlt, FaWallet, FaPlus, FaTrash } from 'react-icons/fa';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    bio: '',
    location: '',
    walletAddress: '',
    skillsOffer: [],
    skillsNeed: [],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        bio: user.bio || '',
        location: user.location || '',
        walletAddress: user.walletAddress || '',
        skillsOffer: user.skillsOffer || [],
        skillsNeed: user.skillsNeed || [],
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSkillOfferChange = (index, field, value) => {
    const updatedSkills = [...formData.skillsOffer];
    updatedSkills[index] = { ...updatedSkills[index], [field]: value };
    setFormData({ ...formData, skillsOffer: updatedSkills });
  };

  const addSkillOffer = () => {
    setFormData({
      ...formData,
      skillsOffer: [
        ...formData.skillsOffer,
        {
          serviceName: '',
          category: 'Design',
          description: '',
          mode: 'Online',
          estimatedHours: 1,
        },
      ],
    });
  };

  const removeSkillOffer = (index) => {
    const updatedSkills = formData.skillsOffer.filter((_, i) => i !== index);
    setFormData({ ...formData, skillsOffer: updatedSkills });
  };

  const addSkillNeed = () => {
    if (newSkill.trim()) {
      setFormData({
        ...formData,
        skillsNeed: [...formData.skillsNeed, newSkill.trim()],
      });
      setNewSkill('');
    }
  };

  const removeSkillNeed = (index) => {
    const updatedNeeds = formData.skillsNeed.filter((_, i) => i !== index);
    setFormData({ ...formData, skillsNeed: updatedNeeds });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setMessage('Profile updated successfully!');
      } else {
        setMessage(result.error || 'Failed to update profile');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h1>

        {message && (
          <div className={`mb-6 p-4 rounded ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Tell us about yourself and your skills..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaMapMarkerAlt className="inline mr-2" />
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="City, Country"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaWallet className="inline mr-2" />
                    Wallet Address (Optional)
                  </label>
                  <input
                    type="text"
                    name="walletAddress"
                    value={formData.walletAddress}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="0x..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Connect your Ethereum wallet for blockchain features
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Skills You Offer */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Services You Offer</h2>
              <button
                type="button"
                onClick={addSkillOffer}
                className="flex items-center text-primary-600 hover:text-primary-700"
              >
                <FaPlus className="mr-2" />
                Add Service
              </button>
            </div>

            {formData.skillsOffer.map((skill, index) => (
              <div key={index} className="border rounded-lg p-4 mb-4 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Service #{index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeSkillOffer(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Name
                    </label>
                    <input
                      type="text"
                      value={skill.serviceName}
                      onChange={(e) => handleSkillOfferChange(index, 'serviceName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., Website Design"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={skill.category}
                      onChange={(e) => handleSkillOfferChange(index, 'category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="Design">Design</option>
                      <option value="Development">Development</option>
                      <option value="Video">Video</option>
                      <option value="Writing">Writing</option>
                      <option value="Mentoring">Mentoring</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estimated Hours
                    </label>
                    <input
                      type="number"
                      value={skill.estimatedHours}
                      onChange={(e) => handleSkillOfferChange(index, 'estimatedHours', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mode
                    </label>
                    <select
                      value={skill.mode}
                      onChange={(e) => handleSkillOfferChange(index, 'mode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="Online">Online</option>
                      <option value="Offline">Offline</option>
                      <option value="Both">Both</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={skill.description}
                    onChange={(e) => handleSkillOfferChange(index, 'description', e.target.value)}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Describe what you offer..."
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Skills You Need */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills You Need</h2>
            <div className="flex mb-4">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Add a skill you need"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkillNeed())}
              />
              <button
                type="button"
                onClick={addSkillNeed}
                className="bg-primary-600 text-white px-4 py-2 rounded-r-lg hover:bg-primary-700"
              >
                <FaPlus />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.skillsNeed.map((skill, index) => (
                <div
                  key={index}
                  className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full flex items-center"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeSkillNeed(index)}
                    className="ml-2 text-primary-600 hover:text-primary-700"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;