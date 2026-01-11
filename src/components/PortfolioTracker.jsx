import { useState, useEffect } from 'react'
import { useWallet } from '../hooks/useWallet'
import { ethers } from 'ethers'
import { getTokensForChain, getNativeToken } from '../config/tokens'
import { getTokenBalance, getTokenInfo, formatTokenAmount } from '../utils/dex'
import { Wallet, TrendingUp, Coins, AlertCircle } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { toast } from '../utils/toast'

const COLORS = ['#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#10b981', '#f97316', '#6366f1', '#14b8a6']

const PortfolioTracker = () => {
  const { account, provider, chainId, isConnected } = useWallet()
  const [tokens, setTokens] = useState([])
  const [nativeBalance, setNativeBalance] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [totalValue, setTotalValue] = useState(0)

  useEffect(() => {
    if (isConnected && account && provider && chainId) {
      loadPortfolio()
    } else {
      setTokens([])
      setNativeBalance(null)
    }
  }, [account, provider, chainId, isConnected])

  const loadPortfolio = async () => {
    if (!provider || !account || !chainId) return

    setIsLoading(true)
    try {
      const availableTokens = getTokensForChain(chainId)
      const nativeToken = getNativeToken(chainId)

      // Load native token balance
      try {
        const balance = await provider.getBalance(account)
        setNativeBalance({
          symbol: nativeToken.symbol,
          name: nativeToken.name,
          balance: ethers.formatEther(balance),
          decimals: nativeToken.decimals,
          address: ethers.ZeroAddress,
          isNative: true,
        })
      } catch (err) {
        console.error('Error loading native balance:', err)
      }

      // Load ERC-20 token balances
      const tokenPromises = availableTokens.map(async (token) => {
        try {
          const balance = await getTokenBalance(provider, token.address, account)
          const info = await getTokenInfo(provider, token.address)
          
          return {
            ...token,
            ...info,
            balance: formatTokenAmount(balance, info.decimals || 18),
            rawBalance: balance,
            address: token.address,
            isNative: false,
          }
        } catch (err) {
          console.error(`Error loading ${token.symbol}:`, err)
          return null
        }
      })

      const tokenResults = await Promise.all(tokenPromises)
      const validTokens = tokenResults.filter(t => t !== null && parseFloat(t.balance) > 0)
      
      setTokens(validTokens)
    } catch (error) {
      console.error('Error loading portfolio:', error)
      toast.error('Failed to load portfolio')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="glass-card rounded-2xl p-12 text-center">
          <Wallet className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4 gradient-text">Connect Your Wallet</h2>
          <p className="text-gray-400">
            Connect your wallet to view your portfolio
          </p>
        </div>
      </div>
    )
  }

  const allAssets = nativeBalance 
    ? [nativeBalance, ...tokens]
    : tokens

  return (
    <div className="max-w-6xl mx-auto">
      <div className="glass-card rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold gradient-text mb-2">Portfolio Tracker</h2>
            <p className="text-gray-400">View all your token balances</p>
          </div>
          <button
            onClick={loadPortfolio}
            disabled={isLoading}
            className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <TrendingUp className="w-5 h-5" />
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {isLoading && allAssets.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Loading portfolio...</p>
          </div>
        ) : allAssets.length === 0 ? (
          <div className="text-center py-12">
            <Coins className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No tokens found in this wallet</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="glass-card rounded-xl p-4 border-amber-500/20">
                <div className="text-sm text-gray-400 mb-1">Total Assets</div>
                <div className="text-2xl font-bold text-amber-400">{allAssets.length}</div>
              </div>
              <div className="glass-card rounded-xl p-4 border-pink-500/20">
                <div className="text-sm text-gray-400 mb-1">Native Token</div>
                <div className="text-2xl font-bold text-pink-400">
                  {nativeBalance ? parseFloat(nativeBalance.balance).toFixed(4) : '0.0000'}
                </div>
                <div className="text-xs text-gray-500 mt-1">{nativeBalance?.symbol || 'ETH'}</div>
              </div>
              <div className="glass-card rounded-xl p-4 border-purple-500/20">
                <div className="text-sm text-gray-400 mb-1">ERC-20 Tokens</div>
                <div className="text-2xl font-bold text-purple-400">{tokens.length}</div>
              </div>
            </div>

            {/* Token Distribution Chart */}
            {allAssets.length > 0 && (
              <div className="glass-card rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Token Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={allAssets.map(t => ({
                        name: t.symbol,
                        value: parseFloat(t.balance) || 0
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {allAssets.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e1a35', 
                        border: '1px solid #f59e0b40',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="space-y-2">
              <h3 className="text-lg font-semibold mb-4">Token Balances</h3>
              {allAssets.map((token, index) => (
                <div
                  key={token.address || `native-${index}`}
                  className="glass-card rounded-xl p-4 hover:border-amber-500/40 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-pink-500 flex items-center justify-center text-lg font-bold">
                        {token.symbol?.[0] || '?'}
                      </div>
                      <div>
                        <div className="font-semibold text-lg">{token.symbol}</div>
                        <div className="text-sm text-gray-400">{token.name}</div>
                        {!token.isNative && (
                          <div className="text-xs text-gray-500 font-mono mt-1">
                            {token.address.slice(0, 6)}...{token.address.slice(-4)}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">{token.balance}</div>
                      <div className="text-sm text-gray-400">{token.symbol}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold mb-2">About Portfolio Tracker</h3>
            <p className="text-sm text-gray-400">
              This feature displays all ERC-20 tokens and native tokens in your connected wallet. 
              Token balances are fetched on-chain in real-time. This demonstrates proficiency in:
            </p>
            <ul className="text-sm text-gray-400 mt-2 list-disc list-inside space-y-1">
              <li>ERC-20 token standard interaction</li>
              <li>Multi-token balance fetching</li>
              <li>Ethers.js provider usage</li>
              <li>Async data handling and error management</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PortfolioTracker
