// hardhat.config.js
require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

module.exports = {
  solidity: '0.8.20',
  networks: {
    somnia: {
      url: 'https://api.infra.mainnet.somnia.network/',
      chainId: 5031,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      somnia: 'abc', // Placeholder, not needed since contract is verified
    },
    customChains: [
      {
        network: 'somnia',
        chainId: 5031,
        urls: {
          apiURL: 'https://explorer.somnia.network/api',
          browserURL: 'https://explorer.somnia.network/',
        },
      },
    ],
  },
};
