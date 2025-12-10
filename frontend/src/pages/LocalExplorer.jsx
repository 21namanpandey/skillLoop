import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { FaCopy, FaLink, FaUser, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const LocalExplorer = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axiosClient.get('/blockchain/local-transactions');
      setTransactions(response.transactions || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

//   const fetchTransactions = async () => {
//   try {
//     const response = await axiosClient.get('/blockchain/local-transactions');
//     setTransactions(response.transactions || []);
//     setUserWallet(response.userWallet);
//   } catch (error) {
//     console.error('Error fetching transactions:', error);
//   } finally {
//     setLoading(false);
//   }
// };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🔗 Local Blockchain Explorer
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            View all transactions recorded on your local development blockchain
          </p>
          <div className="inline-flex items-center mt-4 px-4 py-2 bg-green-100 text-green-800 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Development Mode • Local Hardhat Network
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">All Transactions</h2>
              <p className="text-gray-500">{transactions.length} total transactions</p>
            </div>
            <button
              onClick={fetchTransactions}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No transactions yet</h3>
              <p className="text-gray-500">Complete and confirm sessions to see transactions here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((tx, index) => (
                <div key={index} className="border-2 border-gray-100 rounded-xl p-5 hover:border-blue-200 hover:bg-blue-50 transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <FaLink className="text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">Transaction #{transactions.length - index}</h3>
                          <div className="flex items-center text-sm text-gray-500">
                            <FaCalendarAlt className="mr-1" />
                            {new Date(tx.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-500 mb-1">Transaction Hash</p>
                          <div className="flex items-center">
                            <code className="font-mono text-sm truncate flex-1">{tx.hash}</code>
                            <button
                              onClick={() => copyToClipboard(tx.hash)}
                              className="ml-2 text-gray-400 hover:text-gray-600"
                            >
                              <FaCopy />
                            </button>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-500 mb-1">Session ID</p>
                          <p className="font-medium">{tx.sessionId}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-2 flex items-center">
                            <FaUser className="mr-2" /> Provider
                          </p>
                          <div className="bg-blue-50 p-2 rounded">
                            <code className="text-sm font-mono">{tx.provider}</code>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-2 flex items-center">
                            <FaUser className="mr-2" /> Client
                          </p>
                          <div className="bg-green-50 p-2 rounded">
                            <code className="text-sm font-mono">{tx.client}</code>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-end">
                      <div className="mb-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {tx.category}
                        </span>
                        <div className="text-right mt-2">
                          <p className="text-2xl font-bold text-blue-600">{tx.units}</p>
                          <p className="text-sm text-gray-500">hours</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-green-600">
                        <FaCheckCircle className="mr-2" />
                        <span className="text-sm">Mock Transaction</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold mb-2">How It Works</h3>
            <p className="text-sm text-gray-600">
              In development mode, transactions are stored locally and simulate real blockchain behavior.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold mb-2">For Production</h3>
            <p className="text-sm text-gray-600">
              Set REAL RPC_URL in .env to switch to Sepolia or Mainnet. Transactions will appear on Etherscan.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold mb-2">Benefits</h3>
            <p className="text-sm text-gray-600">
              • No API keys needed • Instant transactions • No gas fees • Perfect for development
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalExplorer;