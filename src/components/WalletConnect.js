// src/components/WalletConnect.js
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { contractAddress, contractABI } from '../config'; // We'll create config later

const WalletConnect = ({ setAccount, setContract }) => {
  const [error, setError] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setError('Please install MetaMask!');
        return;
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      setAccount(account);

      // Check if on Somnia Mainnet (Chain ID: 5031)
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId !== '0x13A7') {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x13A7' }],
          });
        } catch (switchError) {
          // If chain not added, prompt to add Somnia Mainnet
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x13A7',
                  chainName: 'Somnia Mainnet',
                  rpcUrls: ['https://api.infra.mainnet.somnia.network/'],
                  blockExplorerUrls: ['https://explorer.somnia.network/'],
                  nativeCurrency: {
                    name: 'SOMI',
                    symbol: 'SOMI',
                    decimals: 18,
                  },
                },
              ],
            });
          } else {
            setError('Please switch to Somnia Mainnet');
            return;
          }
        }
      }

      // Initialize ethers provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      setContract(contract);

      // Register player
      try {
        const tx = await contract.registerPlayer();
        await tx.wait();
        setIsConnected(true);
        setError('');
      } catch (err) {
        if (err.reason.includes('Player already registered')) {
          setIsConnected(true);
          setError('');
        } else {
          setError('Error registering player');
        }
      }
    } catch (err) {
      setError('Failed to connect wallet');
      console.error(err);
    }
  };

  return (
    <div className="wallet-connect" style={{ textAlign: 'center', margin: '20px', color: '#ff7518' }}>
      <h2 style={{ fontFamily: 'Creepster, cursive' }}>Connect Your Wallet</h2>
      <button
        onClick={connectWallet}
        style={{
          backgroundColor: '#ff7518',
          color: '#000',
          padding: '10px 20px',
          border: '2px solid #000',
          borderRadius: '5px',
          fontSize: '18px',
          cursor: 'pointer',
          fontFamily: 'Creepster, cursive',
        }}
      >
        {isConnected ? 'Wallet Connected' : 'Connect MetaMask'}
      </button>
      {error && <p style={{ color: '#ff0000', marginTop: '10px' }}>{error}</p>}
    </div>
  );
};

export default WalletConnect;
