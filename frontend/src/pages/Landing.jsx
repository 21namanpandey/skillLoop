import React from 'react';
import { Link } from 'react-router-dom';
import { FaExchangeAlt, FaShieldAlt, FaUsers, FaChartLine } from 'react-icons/fa';

const Landing = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-primary-50 to-white">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Exchange Skills, Build Reputation on{' '}
            <span className="text-primary-600">Blockchain</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            SkillLoop connects talented individuals to exchange services like design, development, 
            writing, and mentoring. Every completed service is immutably recorded on the blockchain.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              to="/browse"
              className="bg-white text-primary-600 border-2 border-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              Browse Services
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose SkillLoop?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaExchangeAlt className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Skill Exchange</h3>
              <p className="text-gray-600">
                Trade your skills for other services without direct monetary payment
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Blockchain Verification</h3>
              <p className="text-gray-600">
                All completed services are recorded on blockchain for transparency
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
              <p className="text-gray-600">
                Connect with skilled professionals across various domains
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaChartLine className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Build Reputation</h3>
              <p className="text-gray-600">
                Grow your professional reputation with verifiable work history
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="relative">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">Create Profile</h3>
                <p className="text-gray-600">
                  List services you can offer and services you need
                </p>
              </div>

              <div className="relative">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">Connect & Exchange</h3>
                <p className="text-gray-600">
                  Browse services, send requests, and collaborate
                </p>
              </div>

              <div className="relative">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">Verify on Blockchain</h3>
                <p className="text-gray-600">
                  Completed work is recorded immutably on the blockchain
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;