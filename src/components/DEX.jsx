import { useState, useEffect, useCallback } from 'react'
import { useWallet } from '../hooks/useWallet'
import { 
  getTokensForChain, 
  getNativeToken, 
  TOKEN_INFO,
  TOKEN_ADDRESSES 
} from '../config/tokens'
import {
  getPriceQuote,
  getTokenBalance,
  getTokenInfo,
  checkAllowance,
  approveToken,
  executeSwap,
  formatTokenAmount,
  parseTokenAmount,
} from '../utils/dex'
import { ethers } from 'ethers'
import { toast } from '../utils/toast'
import { 
  ArrowDownUp, 
  Settings, 
  RefreshCw, 
  AlertCircle,
  ChevronDown,
  Zap,
  TrendingUp,
  Info
} from 'lucide-react'

const DEX = () => {
  const { 
    account, 
    provider, 
    signer, 
    chainId, 
    isConnected,
    balance 
  } = useWallet()

  const [tokenIn, setTokenIn] = useState(null)
  const [tokenOut, setTokenOut] = useState(null)
  const [amountIn, setAmountIn] = useState('')
  const [amountOut, setAmountOut] = useState('')
  const [tokenInBalance, setTokenInBalance] = useState(null)
  const [tokenOutBalance, setTokenOutBalance] = useState(null)
  const [slippageTolerance, setSlippageTolerance] = useState(0.5) // 0.5%
  const [showSlippageSettings, setShowSlippageSettings] = useState(false)
  const [showTokenSelector, setShowTokenSelector] = useState(null) // 'in' or 'out'
  const [availableTokens, setAvailableTokens] = useState([])
  const [isLoadingQuote, setIsLoadingQuote] = useState(false)
  const [isSwapping, setIsSwapping] = useState(false)
  const [priceImpact, setPriceImpact] = useState(null)
  const [needsApproval, setNeedsApproval] = useState(false)

  // Initialize tokens when chain changes
  useEffect(() => {
    if (chainId) {
      const tokens = getTokensForChain(chainId)
      const nativeToken = getNativeToken(chainId)
      
      // Add native token to list
      const allTokens = [
        { symbol: nativeToken.symbol, address: ethers.ZeroAddress, ...nativeToken },
        ...tokens
      ]
      
      setAvailableTokens(allTokens)
      
      // Set default tokens
      if (!tokenIn) {
        setTokenIn(allTokens[0]) // Native token
      }
      if (!tokenOut && allTokens.length > 1) {
        setTokenOut(allTokens[1]) // First ERC20 token
      }
    }
  }, [chainId])

  // Load balances
  const loadBalances = useCallback(async () => {
    if (!provider || !account || !tokenIn || !tokenOut) return

    try {
      const [inBalance, outBalance] = await Promise.all([
        getTokenBalance(provider, tokenIn.address, account),
        getTokenBalance(provider, tokenOut.address, account),
      ])
      
      setTokenInBalance(inBalance)
      setTokenOutBalance(outBalance)
    } catch (error) {
      console.error('Error loading balances:', error)
    }
  }, [provider, account, tokenIn, tokenOut])

  useEffect(() => {
    loadBalances()
  }, [loadBalances])

  // Get price quote
  const fetchQuote = useCallback(async () => {
    if (!provider || !tokenIn || !tokenOut || !amountIn || parseFloat(amountIn) <= 0) {
      setAmountOut('')
      return
    }

    setIsLoadingQuote(true)
    try {
      const amountInWei = parseTokenAmount(amountIn, tokenIn.decimals || 18)
      const quote = await getPriceQuote(
        provider,
        tokenIn.address,
        tokenOut.address,
        amountInWei,
        chainId
      )
      
      const formattedOut = formatTokenAmount(quote, tokenOut.decimals || 18)
      setAmountOut(formattedOut)
      
      // Calculate price impact (simplified)
      const amountInNum = parseFloat(amountIn)
      const amountOutNum = parseFloat(formattedOut)
      if (amountInNum > 0 && amountOutNum > 0) {
        // This is a simplified calculation
        setPriceImpact(null) // Would need more data for accurate calculation
      }
    } catch (error) {
      console.error('Error fetching quote:', error)
      toast.error('Failed to get price quote. Please try again.')
      setAmountOut('')
    } finally {
      setIsLoadingQuote(false)
    }
  }, [provider, tokenIn, tokenOut, amountIn, chainId])

  // Debounce quote fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchQuote()
    }, 500)
    return () => clearTimeout(timer)
  }, [fetchQuote])

  // Check if approval is needed
  useEffect(() => {
    const checkApproval = async () => {
      if (!signer || !tokenIn || !account || !amountIn || parseFloat(amountIn) <= 0) {
        setNeedsApproval(false)
        return
      }

      // Native token doesn't need approval
      if (!tokenIn.address || tokenIn.address === ethers.ZeroAddress) {
        setNeedsApproval(false)
        return
      }

      try {
        const routerAddress = {
          1: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
          11155111: '0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008',
          137: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
          8453: '0x2626664c2603336E57B271c5C0b26F421741e481',
          84532: '0x2626664c2603336E57B271c5C0b26F421741e481',
        }[chainId]

        if (!routerAddress) {
          setNeedsApproval(false)
          return
        }

        const amountInWei = parseTokenAmount(amountIn, tokenIn.decimals || 18)
        const allowance = await checkAllowance(provider, tokenIn.address, account, routerAddress)
        setNeedsApproval(allowance < amountInWei)
      } catch (error) {
        console.error('Error checking approval:', error)
        setNeedsApproval(false)
      }
    }

    checkApproval()
  }, [signer, tokenIn, account, amountIn, chainId, provider])

  // Handle swap
  const handleSwap = async () => {
    if (!signer || !tokenIn || !tokenOut || !amountIn || !amountOut) {
      toast.error('Please enter an amount')
      return
    }

    if (!account) {
      toast.error('Please connect your wallet')
      return
    }

    setIsSwapping(true)
    try {
      const amountInWei = parseTokenAmount(amountIn, tokenIn.decimals || 18)
      const amountOutWei = parseTokenAmount(amountOut, tokenOut.decimals || 18)

      // Check if approval is needed
      if (needsApproval) {
        const routerAddress = {
          1: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
          11155111: '0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008',
          137: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
          8453: '0x2626664c2603336E57B271c5C0b26F421741e481',
          84532: '0x2626664c2603336E57B271c5C0b26F421741e481',
        }[chainId]

        toast.info('Approving token...')
        const approveTx = await approveToken(
          signer,
          tokenIn.address,
          routerAddress,
          ethers.MaxUint256
        )
        await approveTx.wait()
        toast.success('Token approved!')
        setNeedsApproval(false)
      }

      toast.info('Executing swap...')
      const swapTx = await executeSwap(
        signer,
        tokenIn.address,
        tokenOut.address,
        amountInWei,
        amountOutWei,
        slippageTolerance,
        chainId
      )

      toast.info('Transaction submitted. Waiting for confirmation...')
      const receipt = await swapTx.wait()
      
      toast.success('Swap successful!')
      
      // Reset amounts and reload balances
      setAmountIn('')
      setAmountOut('')
      loadBalances()
    } catch (error) {
      console.error('Swap error:', error)
      if (error.message?.includes('user rejected')) {
        toast.error('Transaction rejected')
      } else {
        toast.error(error.message || 'Swap failed')
      }
    } finally {
      setIsSwapping(false)
    }
  }

  // Switch tokens
  const switchTokens = () => {
    const temp = tokenIn
    setTokenIn(tokenOut)
    setTokenOut(temp)
    const tempAmount = amountIn
    setAmountIn(amountOut)
    setAmountOut(tempAmount)
  }

  // Set max amount
  const setMaxAmount = () => {
    if (!tokenInBalance || !tokenIn) return
    
    const formatted = formatTokenAmount(tokenInBalance, tokenIn.decimals || 18)
    // Leave some for gas (if native token)
    if (!tokenIn.address || tokenIn.address === ethers.ZeroAddress) {
      const num = parseFloat(formatted)
      setAmountIn((num * 0.99).toString()) // Leave 1% for gas
    } else {
      setAmountIn(formatted)
    }
  }

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="glass-card rounded-2xl p-12 text-center">
          <Zap className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4 gradient-text">Connect Your Wallet</h2>
          <p className="text-gray-400 mb-6">
            Please connect your wallet to start swapping tokens on the DEX
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-card rounded-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold gradient-text">Swap Tokens</h2>
          <button
            onClick={() => setShowSlippageSettings(!showSlippageSettings)}
            className="p-2 hover:bg-black/20 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Slippage Settings */}
        {showSlippageSettings && (
          <div className="mb-4 p-4 bg-black/20 rounded-lg">
            <label className="block text-sm font-medium mb-2">
              Slippage Tolerance: {slippageTolerance}%
            </label>
            <div className="flex gap-2">
              {[0.1, 0.5, 1.0, 3.0].map((val) => (
                <button
                  key={val}
                  onClick={() => setSlippageTolerance(val)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    slippageTolerance === val
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-black/20 text-gray-400 hover:bg-black/30'
                  }`}
                >
                  {val}%
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Token Input */}
        <div className="space-y-4">
          {/* From */}
          <div className="relative">
            <label className="block text-sm text-gray-400 mb-2">From</label>
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => setShowTokenSelector('in')}
                  className="flex items-center gap-2 px-3 py-2 bg-black/20 rounded-lg hover:bg-black/30 transition-colors"
                >
                  {tokenIn ? (
                    <>
                      <span className="font-semibold">{tokenIn.symbol}</span>
                      <ChevronDown className="w-4 h-4" />
                    </>
                  ) : (
                    <span className="text-gray-400">Select token</span>
                  )}
                </button>
                <div className="text-right">
                  <input
                    type="number"
                    value={amountIn}
                    onChange={(e) => setAmountIn(e.target.value)}
                    placeholder="0.0"
                    className="bg-transparent text-2xl font-bold text-right outline-none w-32"
                  />
                  {tokenInBalance && (
                    <div className="text-sm text-gray-400 mt-1">
                      Balance: {formatTokenAmount(tokenInBalance, tokenIn.decimals || 18)}
                      <button
                        onClick={setMaxAmount}
                        className="ml-2 text-amber-400 hover:text-amber-300"
                      >
                        MAX
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Switch Button */}
          <div className="flex justify-center -my-2">
            <button
              onClick={switchTokens}
              className="p-2 bg-black/40 rounded-full hover:bg-black/60 transition-colors border border-amber-500/20"
            >
              <ArrowDownUp className="w-5 h-5 text-amber-400" />
            </button>
          </div>

          {/* To */}
          <div className="relative">
            <label className="block text-sm text-gray-400 mb-2">To</label>
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => setShowTokenSelector('out')}
                  className="flex items-center gap-2 px-3 py-2 bg-black/20 rounded-lg hover:bg-black/30 transition-colors"
                >
                  {tokenOut ? (
                    <>
                      <span className="font-semibold">{tokenOut.symbol}</span>
                      <ChevronDown className="w-4 h-4" />
                    </>
                  ) : (
                    <span className="text-gray-400">Select token</span>
                  )}
                </button>
                <div className="text-right">
                  {isLoadingQuote ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin text-amber-400" />
                      <span className="text-2xl font-bold">...</span>
                    </div>
                  ) : (
                    <div className="text-2xl font-bold">
                      {amountOut || '0.0'}
                    </div>
                  )}
                  {tokenOutBalance && (
                    <div className="text-sm text-gray-400 mt-1">
                      Balance: {formatTokenAmount(tokenOutBalance, tokenOut.decimals || 18)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Swap Info */}
          {amountOut && parseFloat(amountOut) > 0 && (
            <div className="p-4 bg-black/20 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Rate</span>
                <span className="text-gray-300">
                  1 {tokenIn?.symbol} = {((parseFloat(amountOut) / parseFloat(amountIn)) || 0).toFixed(6)} {tokenOut?.symbol}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Slippage</span>
                <span className="text-gray-300">{slippageTolerance}%</span>
              </div>
            </div>
          )}

          {/* Swap Button */}
          <button
            onClick={handleSwap}
            disabled={!amountIn || !amountOut || isSwapping || isLoadingQuote || parseFloat(amountIn) <= 0}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-pink-500 rounded-xl font-semibold text-lg hover:from-amber-400 hover:to-pink-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSwapping ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Swapping...
              </>
            ) : needsApproval ? (
              'Approve & Swap'
            ) : (
              'Swap'
            )}
          </button>

          {needsApproval && (
            <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-sm">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              <span className="text-amber-300">
                You need to approve this token before swapping
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Token Selector Modal */}
      {showTokenSelector && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Select Token</h3>
              <button
                onClick={() => setShowTokenSelector(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2">
              {availableTokens.map((token) => (
                <button
                  key={token.address || token.symbol}
                  onClick={() => {
                    if (showTokenSelector === 'in') {
                      setTokenIn(token)
                    } else {
                      setTokenOut(token)
                    }
                    setShowTokenSelector(null)
                  }}
                  className="w-full p-4 bg-black/20 rounded-lg hover:bg-black/40 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-pink-500 flex items-center justify-center text-sm font-bold">
                      {token.symbol?.[0] || '?'}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">{token.symbol}</div>
                      <div className="text-sm text-gray-400">{token.name}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DEX
