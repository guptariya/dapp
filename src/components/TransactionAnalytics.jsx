import { useState, useEffect } from 'react'
import { useWallet } from '../hooks/useWallet'
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts'
import { TrendingUp, Activity, DollarSign, BarChart3 } from 'lucide-react'
import { transactionHistory } from '../utils/transactionHistory'

const COLORS = ['#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#10b981', '#f97316']

const TransactionAnalytics = () => {
  const { account, isConnected } = useWallet()
  const [transactionData, setTransactionData] = useState([])
  const [stats, setStats] = useState(null)
  const [timeRange, setTimeRange] = useState('7d')

  useEffect(() => {
    if (isConnected && account) {
      loadAnalytics()
    }
  }, [account, isConnected, timeRange])

  const loadAnalytics = () => {
    const history = account ? transactionHistory.getByAccount(account) : transactionHistory.getAll()
    const filtered = filterByTimeRange(history)
    
    // Process data for charts
    const dailyData = processDailyData(filtered)
    const stats = calculateStats(filtered)
    
    setTransactionData(dailyData)
    setStats(stats)
  }

  const filterByTimeRange = (transactions) => {
    const now = Date.now()
    const ranges = {
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000,
    }
    
    return transactions.filter(tx => {
      const txTime = new Date(tx.timestamp).getTime()
      return now - txTime <= ranges[timeRange]
    })
  }

  const processDailyData = (transactions) => {
    const dailyMap = {}
    
    transactions.forEach(tx => {
      const date = new Date(tx.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      if (!dailyMap[date]) {
        dailyMap[date] = { date, count: 0, totalValue: 0, success: 0, failed: 0 }
      }
      dailyMap[date].count++
      if (tx.value) {
        dailyMap[date].totalValue += parseFloat(tx.value) || 0
      }
      if (tx.status === 'success') {
        dailyMap[date].success++
      } else if (tx.status === 'failed') {
        dailyMap[date].failed++
      }
    })
    
    return Object.values(dailyMap).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    )
  }

  const calculateStats = (transactions) => {
    const total = transactions.length
    const successful = transactions.filter(tx => tx.status === 'success').length
    const failed = transactions.filter(tx => tx.status === 'failed').length
    const totalValue = transactions.reduce((sum, tx) => 
      sum + (parseFloat(tx.value) || 0), 0
    )
    const avgValue = total > 0 ? totalValue / total : 0
    
    return {
      total,
      successful,
      failed,
      totalValue: totalValue.toFixed(4),
      avgValue: avgValue.toFixed(4),
      successRate: total > 0 ? ((successful / total) * 100).toFixed(1) : 0,
    }
  }

  const getStatusDistribution = () => {
    if (!stats) return []
    return [
      { name: 'Success', value: stats.successful, color: '#10b981' },
      { name: 'Failed', value: stats.failed, color: '#ef4444' },
    ]
  }

  if (!isConnected) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="glass-card rounded-2xl p-12 text-center">
          <Activity className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4 gradient-text">Connect Your Wallet</h2>
          <p className="text-gray-400">
            Connect your wallet to view transaction analytics
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold gradient-text mb-2">Transaction Analytics</h2>
            <p className="text-gray-400">Visual insights into your blockchain activity</p>
          </div>
          <div className="flex gap-2">
            {['7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  timeRange === range
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-black/20 text-gray-400 hover:bg-black/30'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="glass-card rounded-xl p-4 border-amber-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-amber-400" />
                <div className="text-sm text-gray-400">Total Transactions</div>
              </div>
              <div className="text-2xl font-bold text-amber-400">{stats.total}</div>
            </div>
            <div className="glass-card rounded-xl p-4 border-green-500/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <div className="text-sm text-gray-400">Success Rate</div>
              </div>
              <div className="text-2xl font-bold text-green-400">{stats.successRate}%</div>
            </div>
            <div className="glass-card rounded-xl p-4 border-pink-500/20">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-pink-400" />
                <div className="text-sm text-gray-400">Total Value</div>
              </div>
              <div className="text-2xl font-bold text-pink-400">{stats.totalValue}</div>
              <div className="text-xs text-gray-500 mt-1">ETH</div>
            </div>
            <div className="glass-card rounded-xl p-4 border-purple-500/20">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                <div className="text-sm text-gray-400">Avg Value</div>
              </div>
              <div className="text-2xl font-bold text-purple-400">{stats.avgValue}</div>
              <div className="text-xs text-gray-500 mt-1">ETH</div>
            </div>
          </div>
        )}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Volume Over Time */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Transaction Volume</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={transactionData}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e1a35', 
                  border: '1px solid #f59e0b40',
                  borderRadius: '8px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#f59e0b" 
                fillOpacity={1} 
                fill="url(#colorCount)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Success vs Failed */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Transaction Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getStatusDistribution()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {getStatusDistribution().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e1a35', 
                  border: '1px solid #f59e0b40',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Transaction Value Over Time */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Transaction Value Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={transactionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e1a35', 
                  border: '1px solid #f59e0b40',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="totalValue" 
                stroke="#ec4899" 
                strokeWidth={2}
                dot={{ fill: '#ec4899', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Success vs Failed Bar Chart */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Success vs Failed</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={transactionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e1a35', 
                  border: '1px solid #f59e0b40',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="success" fill="#10b981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="failed" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default TransactionAnalytics
