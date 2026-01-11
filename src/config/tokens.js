// Popular token addresses for DEX swapping
// These are common tokens on different networks

export const TOKEN_ADDRESSES = {
  // Ethereum Mainnet
  1: {
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    WBTC: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    UNI: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    LINK: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
  },
  // Sepolia Testnet
  11155111: {
    WETH: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
    USDC: '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8',
    DAI: '0x3e622317f8C93f7328350cF0B56d9eD4C620C5d6',
  },
  // Polygon Mainnet
  137: {
    WETH: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    DAI: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    WBTC: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
    MATIC: '0x0000000000000000000000000000000000001010', // Native token
  },
  // Base Mainnet
  8453: {
    WETH: '0x4200000000000000000000000000000000000006',
    USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    DAI: '0x50c5725949A6F0c72E6C4a641F24049A917E0Cb7',
  },
  // Base Sepolia
  84532: {
    WETH: '0x4200000000000000000000000000000000000006',
    USDC: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
  },
}

// Token metadata
export const TOKEN_INFO = {
  WETH: {
    name: 'Wrapped Ethereum',
    symbol: 'WETH',
    decimals: 18,
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
  },
  USDC: {
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
  },
  USDT: {
    name: 'Tether USD',
    symbol: 'USDT',
    decimals: 6,
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
  },
  DAI: {
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    decimals: 18,
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
  },
  WBTC: {
    name: 'Wrapped Bitcoin',
    symbol: 'WBTC',
    decimals: 8,
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png',
  },
  UNI: {
    name: 'Uniswap',
    symbol: 'UNI',
    decimals: 18,
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png',
  },
  LINK: {
    name: 'Chainlink',
    symbol: 'LINK',
    decimals: 18,
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png',
  },
  MATIC: {
    name: 'Polygon',
    symbol: 'MATIC',
    decimals: 18,
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/assets/0x0000000000000000000000000000000000001010/logo.png',
  },
}

// Get available tokens for a chain
export const getTokensForChain = (chainId) => {
  const addresses = TOKEN_ADDRESSES[chainId] || {}
  return Object.keys(addresses).map((symbol) => ({
    symbol,
    address: addresses[symbol],
    ...TOKEN_INFO[symbol],
  }))
}

// Get native token info
export const getNativeToken = (chainId) => {
  const chains = {
    1: { symbol: 'ETH', name: 'Ethereum', decimals: 18 },
    11155111: { symbol: 'ETH', name: 'Ethereum', decimals: 18 },
    137: { symbol: 'MATIC', name: 'Polygon', decimals: 18 },
    8453: { symbol: 'ETH', name: 'Ethereum', decimals: 18 },
    84532: { symbol: 'ETH', name: 'Ethereum', decimals: 18 },
  }
  return chains[chainId] || { symbol: 'ETH', name: 'Ethereum', decimals: 18 }
}
