import { useState, useEffect } from 'react'
import { useWallet } from '../hooks/useWallet'
import { ethers } from 'ethers'
import { Zap, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'
import GasPriceChart from './GasPriceChart'

const GasTracker = () => {
  const { provider, chainId, isConnected } = useWallet()
  const [gasData, setGasData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isConnected && provider) {
      loadGasData()
      const interval = setInterval(loadGasData, 30000) // Update every 30 seconds
      return () => clearInterval(interval)
    }
  }, [provider, chainId, isConnected])

  const loadGasData = async () => {
    if (!provider) return

    setIsLoading(true)
    try {
      const feeData = await provider.getFeeData()
      
      // Calculate gas prices in Gwei
      const gasPrice = feeData.gasPrice ? ethers.formatUnits(feeData.gasPrice, 'gwei') : null
      const maxFeePerGas = feeData.maxFeePerGas ? ethers.formatUnits(feeData.maxFeePerGas, 'gwei') : null
      const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas 
        ? ethers.formatUnits(feeData.maxPriorityFeePerGas, 'gwei') 
        : null

      setGasData({
        gasPrice: gasPrice ? parseFloat(gasPrice).toFixed(2) : null,
        maxFeePerGas: maxFeePerGas ? parseFloat(maxFeePerGas).toFixed(2) : null,
        maxPriorityFeePerGas: maxPriorityFeePerGas ? parseFloat(maxPriorityFeePerGas).toFixed(2) : null,
        lastUpdated: new Date().toLocaleTimeString(),
      })
    } catch (error) {
      console.error('Error loading gas data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getGasStatus = (gasPrice) => {
    if (!gasPrice) return { status: 'unknown', color: 'gray', icon: AlertCircle }
    const price = parseFloat(gasPrice)
    
    if (price < 20) return { status: 'Low', color: 'green', icon: TrendingDown }
    if (price < 50) return { status: 'Medium', color: 'yellow', icon: TrendingUp }
    return { status: 'High', color: 'red', icon: TrendingUp }
  }

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="glass-card rounded-2xl p-12 text-center">
          <Zap className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4 gradient-text">Connect Your Wallet</h2>
          <p className="text-gray-400">
            Connect your wallet to view gas prices
          </p>
        </div>
      </div>
    )
  }

  const gasStatus = getGasStatus(gasData?.gasPrice)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold gradient-text mb-2">Gas Price Tracker</h2>
            <p className="text-gray-400">Real-time gas prices on the network</p>
          </div>
          <button
            onClick={loadGasData}
            disabled={isLoading}
            className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Zap className="w-5 h-5" />
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {isLoading && !gasData ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Loading gas data...</p>
          </div>
        ) : gasData ? (
          <div className="space-y-6">
            {/* Gas Price Status */}
            <div className="glass-card rounded-xl p-6 border-amber-500/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <gasStatus.icon className={`w-6 h-6 text-${gasStatus.color}-400`} />
                  <div>
                    <div className="text-sm text-gray-400">Current Status</div>
                    <div className={`text-2xl font-bold text-${gasStatus.color}-400`}>
                      {gasStatus.status}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Last Updated</div>
                  <div className="text-sm font-mono">{gasData.lastUpdated}</div>
                </div>
              </div>
            </div>

            {/* Gas Price Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {gasData.gasPrice && (
                <div className="glass-card rounded-xl p-4">
                  <div className="text-sm text-gray-400 mb-2">Gas Price (Legacy)</div>
                  <div className="text-2xl font-bold text-amber-400">{gasData.gasPrice}</div>
                  <div className="text-xs text-gray-500 mt-1">Gwei</div>
                </div>
              )}

              {gasData.maxFeePerGas && (
                <div className="glass-card rounded-xl p-4">
                  <div className="text-sm text-gray-400 mb-2">Max Fee Per Gas (EIP-1559)</div>
                  <div className="text-2xl font-bold text-pink-400">{gasData.maxFeePerGas}</div>
                  <div className="text-xs text-gray-500 mt-1">Gwei</div>
                </div>
              )}

              {gasData.maxPriorityFeePerGas && (
                <div className="glass-card rounded-xl p-4">
                  <div className="text-sm text-gray-400 mb-2">Max Priority Fee (EIP-1559)</div>
                  <div className="text-2xl font-bold text-purple-400">{gasData.maxPriorityFeePerGas}</div>
                  <div className="text-xs text-gray-500 mt-1">Gwei</div>
                </div>
              )}
            </div>

            {/* Gas Price Chart */}
            <GasPriceChart />
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Unable to load gas data</p>
          </div>
        )}
      </div>

      <div className="glass-card rounded-2xl p-6 mt-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold mb-2">About Gas Tracker</h3>
            <p className="text-sm text-gray-400 mb-2">
              This feature demonstrates real-time gas price monitoring using Ethers.js provider methods. 
              The chart above shows gas price trends over time, helping you make informed decisions about when to transact.
            </p>
            <p className="text-sm text-gray-400">
              It showcases understanding of:
            </p>
            <ul className="text-sm text-gray-400 mt-2 list-disc list-inside space-y-1">
              <li>EIP-1559 fee structure (maxFeePerGas, maxPriorityFeePerGas)</li>
              <li>Legacy gas price handling</li>
              <li>Real-time data fetching and polling</li>
              <li>Provider.getFeeData() API usage</li>
              <li>Data visualization with charts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GasTracker
