import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FaEthereum, 
  FaCheckCircle, 
  FaExternalLinkAlt,
  FaLink,
  FaHistory,
  FaUsers,
  FaChartBar 
} from 'react-icons/fa';

export default function BlockchainDashboard() {
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [networkStatus, setNetworkStatus] = useState('');

  useEffect(() => {
    fetchBlockchainData();
    checkNetwork();
  }, []);

  const fetchBlockchainData = async () => {
    try {
      const response = await axios.get('/api/testnet/status');
      setStats(response.data);
      
      // Get user's blockchain sessions
      const sessionsRes = await axios.get('/api/sessions/my-sessions');
      const blockchainSessions = sessionsRes.data.sessions
        .filter(s => s.onChainTxHash && !s.isMockBlockchain)
        .slice(0, 10); // Last 10 transactions
      
      setTransactions(blockchainSessions);
    } catch (error) {
      console.error('Error fetching blockchain data:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkNetwork = async () => {
    if (window.ethereum) {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      setNetworkStatus(chainId === '0xaa36a7' ? 'connected' : 'wrong');
    }
  };

  const switchToSepolia = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }],
      });
    } catch (error) {
      if (error.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0xaa36a7',
            chainName: 'Sepolia Test Network',
            nativeCurrency: { name: 'Sepolia ETH', symbol: 'ETH', decimals: 18 },
            rpcUrls: ['https://sepolia.infura.io/v3/'],
            blockExplorerUrls: ['https://sepolia.etherscan.io']
          }]
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">Loading blockchain data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blockchain Dashboard</h1>
            <p className="text-gray-600 mt-2">Monitor your on-chain activity</p>
          </div>
          
          {networkStatus === 'wrong' && window.ethereum && (
            <button
              onClick={switchToSepolia}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 flex items-center"
            >
              <FaEthereum className="mr-2" />
              Switch to Sepolia
            </button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaEthereum className="text-blue-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Network</p>
                <p className="text-xl font-bold">
                  {stats?.blockchain?.mode === 'real' ? 'Sepolia' : 'Mock'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FaCheckCircle className="text-green-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Verified</p>
                <p className="text-xl font-bold">
                  {stats?.blockchain?.contractAddress ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaUsers className="text-purple-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Sessions</p>
                <p className="text-xl font-bold">{stats?.blockchain?.sessionCount || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <FaChartBar className="text-orange-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Transactions</p>
                <p className="text-xl font-bold">{transactions.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contract Info */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaLink className="mr-2" />
            Smart Contract
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Contract Address</p>
              <div className="flex items-center mt-1">
                <code className="bg-gray-100 px-3 py-2 rounded text-sm font-mono">
                  {stats?.blockchain?.contractAddress || 'Not set'}
                </code>
                <a
                  href={`https://sepolia.etherscan.io/address/${stats?.blockchain?.contractAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-3 text-blue-600 hover:text-blue-800"
                >
                  <FaExternalLinkAlt />
                </a>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Contract Owner</p>
              <p className="font-mono text-sm mt-1">
                {stats?.blockchain?.contractOwner?.substring(0, 10)}...
              </p>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaHistory className="mr-2" />
            Recent Blockchain Transactions
          </h2>
          
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No blockchain transactions yet</p>
              <Link 
                to="/sessions" 
                className="text-blue-600 hover:text-blue-800"
              >
                Complete a session to see transactions
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((tx) => (
                    <tr key={tx._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-gray-900">
                            {tx.serviceName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {tx.category}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(tx.updatedAt).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(tx.updatedAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a
                          href={`https://sepolia.etherscan.io/tx/${tx.onChainTxHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <span className="font-mono text-sm truncate max-w-xs">
                            {tx.onChainTxHash.substring(0, 20)}...
                          </span>
                          <FaExternalLinkAlt className="ml-2" />
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <FaCheckCircle className="mr-1" />
                          Confirmed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Need test ETH?
          </h3>
          <p className="text-blue-800 mb-4">
            Get free test ETH for Sepolia network to test transactions.
          </p>
          <a
            href="https://www.infura.io/faucet/sepolia"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Get Test ETH
          </a>
        </div>
      </div>
    </div>
  );
}