import { useEffect, useState } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

export default function NetworkAlert() {
  const [showAlert, setShowAlert] = useState(false);
  
  useEffect(() => {
    const checkNetwork = async () => {
      if (window.ethereum) {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        // Sepolia chain ID: 0xaa36a7 (11155111 in decimal)
        setShowAlert(chainId !== '0xaa36a7');
      }
    };
    
    checkNetwork();
    if (window.ethereum) {
      window.ethereum.on('chainChanged', checkNetwork);
    }
  }, []);
  
  const switchToSepolia = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }],
      });
    } catch (error) {
      if (error.code === 4902) {
        // Sepolia not added, add it
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
  
  if (!showAlert || !window.ethereum) return null;
  
  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg shadow-lg">
        <div className="flex items-center">
          <FaExclamationTriangle className="text-yellow-400 mr-3" />
          <div className="flex-1">
            <p className="font-medium text-yellow-800">Wrong Network</p>
            <p className="text-sm text-yellow-700 mt-1">
              Please switch to Sepolia Testnet to use SkillLoop
            </p>
          </div>
          <button
            onClick={switchToSepolia}
            className="ml-4 bg-yellow-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-yellow-700"
          >
            Switch to Sepolia
          </button>
        </div>
      </div>
    </div>
  );
}