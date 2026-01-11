import { useState, useEffect } from 'react'
import { useWallet } from '../hooks/useWallet'
import { ethers } from 'ethers'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Zap } from 'lucide-react'

const GasPriceChart = () => {
  const { provider, chainId, isConnected } = useWallet()
  const [gasHistory, setGasHistory] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isConnected && provider) {
      const interval = setInterval(() => {
        fetchGasPrice()
      }, 30000) // Every 30 seconds
      
      fetchGasPrice() // Initial fetch
      
      return () => clearInterval(interval)
    }
  }, [provider, chainId, isConnected])

  const fetchGasPrice = async () => {
    if (!provider) return

    try {
      const feeData = await provider.getFeeData()
      const gasPrice = feeData.gasPrice 
        ? parseFloat(ethers.formatUnits(feeData.gasPrice, 'gwei'))
        : null

      if (gasPrice !== null) {
        const newDataPoint = {
          time: new Date().toLocaleTimeString(),
          timestamp: Date.now(),
          gasPrice: gasPrice.toFixed(2),
        }

        setGasHistory(prev => {
          const updated = [...prev, newDataPoint]
          // Keep only last 20 data points
          return updated.slice(-20)
        })
      }
    } catch (error) {
      console.error('Error fetching gas price:', error)
    }
  }

  if (!isConnected) {
    return null
  }

  if (gasHistory.length === 0) {
    return (
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-amber-400" />
          <h3 className="font-semibold">Gas Price History</h3>
        </div>
        <div className="text-center py-8 text-gray-400">
          Collecting gas price data...
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-amber-400" />
        <h3 className="font-semibold">Gas Price History (Last 20 Updates)</h3>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={gasHistory}>
          <defs>
            <linearGradient id="colorGas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="time" 
            stroke="#9ca3af"
            tick={{ fill: '#9ca3af', fontSize: 12 }}
          />
          <YAxis 
            stroke="#9ca3af"
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            label={{ value: 'Gwei', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1e1a35', 
              border: '1px solid #f59e0b40',
              borderRadius: '8px',
              color: '#f3f4f6'
            }}
            labelStyle={{ color: '#f59e0b' }}
          />
          <Area 
            type="monotone" 
            dataKey="gasPrice" 
            stroke="#f59e0b" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorGas)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default GasPriceChart
