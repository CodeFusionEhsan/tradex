import { AnkrscanProvider } from '@ankr.com/ankr.js';

const provider = new AnkrscanProvider()

// Supported chains
const listOfChains= [
  'eth',
  'arbitrum',
  'avalanche',
  'bsc',
  'fantom',
  'polygon',
];

// Fetch balance for a single chain
export const getAccountBalance = async (
  walletAddress,
  blockchain
) => {
  return provider.getAccountBalance({
    walletAddress,
    blockchain,
  });
};

// Sum total USD balance across all chains
export const getTotalMultichainBalance = async (walletAddress) => {
  let total = 0;
  for await (const chain of listOfChains) {
    const { totalBalanceUsd } = await getAccountBalance(walletAddress, chain);
    total += Number(totalBalanceUsd);
  }
  return total;
};
