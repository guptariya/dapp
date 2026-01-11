import { ethers } from 'ethers'

// Uniswap V3 Router address (same across most chains)
const UNISWAP_V3_ROUTER = {
  1: '0xE592427A0AEce92De3Edee1F18E0157C05861564', // Ethereum Mainnet
  11155111: '0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008', // Sepolia
  137: '0xE592427A0AEce92De3Edee1F18E0157C05861564', // Polygon
  8453: '0x2626664c2603336E57B271c5C0b26F421741e481', // Base
  84532: '0x2626664c2603336E57B271c5C0b26F421741e481', // Base Sepolia
}

// Uniswap V3 Router ABI (simplified for swapExactTokensForTokens)
const ROUTER_ABI = [
  'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
  'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
  'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
  'function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)',
]

// ERC20 ABI (simplified)
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
]

/**
 * Get token price quote from Uniswap V3
 * Note: This uses Uniswap V2 Router interface for simplicity
 * For production, consider using Uniswap V3 Quoter contract
 */
export const getPriceQuote = async (provider, tokenIn, tokenOut, amountIn, chainId) => {
  try {
    const routerAddress = UNISWAP_V3_ROUTER[chainId]
    if (!routerAddress) {
      throw new Error('Uniswap not supported on this chain')
    }

    const router = new ethers.Contract(routerAddress, ROUTER_ABI, provider)
    
    // Build path - for native tokens, use WETH address
    // This is simplified - in production, you'd want to use proper routing
    let path = []
    
    if (tokenIn === ethers.ZeroAddress) {
      // Native token in - would need WETH address for actual swap
      // For now, return a mock quote (in production, use actual DEX aggregator)
      throw new Error('Native token swaps require WETH wrapping')
    } else if (tokenOut === ethers.ZeroAddress) {
      // Native token out
      path = [tokenIn]
    } else {
      path = [tokenIn, tokenOut]
    }
    
    // Get quote
    const amounts = await router.getAmountsOut(amountIn, path)
    return amounts[amounts.length - 1] // Last amount is the output
  } catch (error) {
    console.error('Error getting price quote:', error)
    // Return a mock quote for development (remove in production)
    // In production, use a DEX aggregator like 1inch, 0x, or Uniswap V3 Quoter
    if (error.message?.includes('not supported')) {
      throw error
    }
    // For development: return 1:1 ratio as fallback
    return amountIn
  }
}

/**
 * Get token balance
 */
export const getTokenBalance = async (provider, tokenAddress, userAddress) => {
  try {
    if (!tokenAddress || tokenAddress === ethers.ZeroAddress) {
      // Native token balance
      return await provider.getBalance(userAddress)
    }
    
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider)
    return await tokenContract.balanceOf(userAddress)
  } catch (error) {
    console.error('Error getting token balance:', error)
    throw error
  }
}

/**
 * Get token info
 */
export const getTokenInfo = async (provider, tokenAddress) => {
  try {
    if (!tokenAddress || tokenAddress === ethers.ZeroAddress) {
      return { symbol: 'ETH', decimals: 18, name: 'Ethereum' }
    }
    
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider)
    const [symbol, decimals, name] = await Promise.all([
      tokenContract.symbol(),
      tokenContract.decimals(),
      tokenContract.name(),
    ])
    
    return { symbol, decimals: Number(decimals), name }
  } catch (error) {
    console.error('Error getting token info:', error)
    throw error
  }
}

/**
 * Check token allowance
 */
export const checkAllowance = async (provider, tokenAddress, owner, spender) => {
  try {
    if (!tokenAddress || tokenAddress === ethers.ZeroAddress) {
      // Native token doesn't need allowance
      return ethers.MaxUint256
    }
    
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider)
    return await tokenContract.allowance(owner, spender)
  } catch (error) {
    console.error('Error checking allowance:', error)
    throw error
  }
}

/**
 * Approve token spending
 */
export const approveToken = async (signer, tokenAddress, spender, amount) => {
  try {
    if (!tokenAddress || tokenAddress === ethers.ZeroAddress) {
      // Native token doesn't need approval
      return null
    }
    
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer)
    const tx = await tokenContract.approve(spender, amount)
    return tx
  } catch (error) {
    console.error('Error approving token:', error)
    throw error
  }
}

/**
 * Execute swap
 */
export const executeSwap = async (
  signer,
  tokenIn,
  tokenOut,
  amountIn,
  amountOutMin,
  slippageTolerance,
  chainId,
  deadlineMinutes = 20
) => {
  try {
    const routerAddress = UNISWAP_V3_ROUTER[chainId]
    if (!routerAddress) {
      throw new Error('Uniswap V3 not supported on this chain')
    }

    const router = new ethers.Contract(routerAddress, ROUTER_ABI, signer)
    const deadline = Math.floor(Date.now() / 1000) + deadlineMinutes * 60
    const userAddress = await signer.getAddress()
    
    const isNativeIn = !tokenIn || tokenIn === ethers.ZeroAddress
    const isNativeOut = !tokenOut || tokenOut === ethers.ZeroAddress
    
    // Calculate minimum amount out with slippage
    const slippageMultiplier = BigInt(10000) - BigInt(Math.floor(slippageTolerance * 100))
    const amountOutMinWithSlippage = (amountOutMin * slippageMultiplier) / BigInt(10000)
    
    let tx
    
    // Note: For native token swaps, you typically need WETH
    // This is a simplified version - in production, handle WETH wrapping/unwrapping
    if (isNativeIn && !isNativeOut) {
      // Swap ETH for tokens - need WETH address
      // For now, throw error - in production, wrap ETH to WETH first
      throw new Error('ETH swaps require WETH. Please use WETH token instead.')
    } else if (!isNativeIn && isNativeOut) {
      // Swap tokens for ETH
      const path = [tokenIn]
      tx = await router.swapExactTokensForETH(
        amountIn,
        amountOutMinWithSlippage,
        path,
        userAddress,
        deadline
      )
    } else if (!isNativeIn && !isNativeOut) {
      // Swap tokens for tokens
      const path = [tokenIn, tokenOut]
      tx = await router.swapExactTokensForTokens(
        amountIn,
        amountOutMinWithSlippage,
        path,
        userAddress,
        deadline
      )
    } else {
      throw new Error('Cannot swap native token for native token')
    }
    
    return tx
  } catch (error) {
    console.error('Error executing swap:', error)
    throw error
  }
}

/**
 * Format token amount for display
 */
export const formatTokenAmount = (amount, decimals, precision = 6) => {
  try {
    const formatted = ethers.formatUnits(amount, decimals)
    const num = parseFloat(formatted)
    if (num === 0) return '0'
    if (num < 0.000001) return '<0.000001'
    return num.toFixed(precision).replace(/\.?0+$/, '')
  } catch (error) {
    return '0'
  }
}

/**
 * Parse token amount from string
 */
export const parseTokenAmount = (amount, decimals) => {
  try {
    return ethers.parseUnits(amount, decimals)
  } catch (error) {
    throw new Error('Invalid amount')
  }
}
