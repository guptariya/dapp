import { useState, useEffect } from 'react'
import { History, ExternalLink, Copy, Trash2, Check } from 'lucide-react'
import { useWallet } from '../hooks/useWallet'
import { transactionHistory } from '../utils/transactionHistory'
import { toast } from '../utils/toast'

const TransactionHistory = () => {
  const { account } = useWallet()
  const [history, setHistory] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(null)

  useEffect(() => {
    if (account) {
      const accountHistory = transactionHistory.getByAccount(account)
      setHistory(accountHistory)
    } else {
      setHistory([])
    }
  }, [account])

  const handleCopy = async (hash) => {
    await navigator.clipboard.writeText(hash)
    setCopied(hash)
    toast.success('Transaction hash copied!')
    setTimeout(() => setCopied(null), 2000)
  }

  const handleClear = () => {
    if (window.confirm('Clear all transaction history?')) {
      transactionHistory.clear()
      setHistory([])
      toast.success('Transaction history cleared')
    }
  }

  const getExplorerUrl = (hash, chainId) => {
    const chainExplorers = {
      1: 'https://etherscan.io',
      11155111: 'https://sepolia.etherscan.io',
      137: 'https://polygonscan.com',
      8453: 'https://basescan.org',
      84532: 'https://sepolia.basescan.org',
    }
    const baseUrl = chainExplorers[chainId] || 'https://etherscan.io'
    return `${baseUrl}/tx/${hash}`
  }

  const formatAddress = (address) => {
    if (!address) return 'N/A'
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString()
  }

  if (!account) {
    return null
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 glass-card rounded-lg hover:border-amber-500/50 transition-all relative"
      >
        <History className="w-4 h-4 text-amber-400" />
        <span className="text-sm font-medium">History</span>
        {history.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {history.length}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-96 glass-card rounded-lg p-4 z-20 shadow-2xl border border-amber-500/20 max-h-[600px] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Transaction History</h3>
              {history.length > 0 && (
                <button
                  onClick={handleClear}
                  className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <History className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No transactions yet</p>
                <p className="text-xs mt-1">Your transaction history will appear here</p>
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 bg-black/30 rounded-lg border border-amber-500/10 hover:border-amber-500/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="text-xs text-gray-400 mb-1">
                          {formatDate(tx.timestamp)}
                        </div>
                        <div className="font-mono text-xs break-all mb-2">
                          {formatAddress(tx.hash)}
                        </div>
                        {tx.to && (
                          <div className="text-xs text-gray-400">
                            To: {formatAddress(tx.to)}
                          </div>
                        )}
                        {tx.value && (
                          <div className="text-xs text-amber-400 mt-1">
                            {parseFloat(tx.value).toFixed(6)} ETH
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1 ml-2">
                        <button
                          onClick={() => handleCopy(tx.hash)}
                          className="p-1 hover:bg-amber-500/20 rounded transition-colors"
                          title="Copy hash"
                        >
                          {copied === tx.hash ? (
                            <Check className="w-3 h-3 text-green-400" />
                          ) : (
                            <Copy className="w-3 h-3 text-gray-400" />
                          )}
                        </button>
                        <a
                          href={getExplorerUrl(tx.hash, tx.chainId)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 hover:bg-amber-500/20 rounded transition-colors"
                          title="View on explorer"
                        >
                          <ExternalLink className="w-3 h-3 text-gray-400" />
                        </a>
                      </div>
                    </div>
                    {tx.status && (
                      <div className={`text-xs px-2 py-1 rounded inline-block ${
                        tx.status === 'confirmed'
                          ? 'bg-green-500/20 text-green-400'
                          : tx.status === 'failed'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {tx.status}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default TransactionHistory
