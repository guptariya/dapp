import { useState } from 'react'
import { Wallet, LogOut, Copy, Check, ExternalLink } from 'lucide-react'
import { useWallet } from '../hooks/useWallet'
import { toast } from '../utils/toast'

const WalletButton = () => {
  const {
    account,
    balance,
    chainId,
    isConnecting,
    error,
    isMetaMask,
    connectMetaMask,
    disconnect,
  } = useWallet()

  const [copied, setCopied] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const handleCopy = async () => {
    if (account) {
      await navigator.clipboard.writeText(account)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getExplorerUrl = () => {
    if (!account) return '#'
    const chainExplorers = {
      1: 'https://etherscan.io',
      11155111: 'https://sepolia.etherscan.io',
      137: 'https://polygonscan.com',
      8453: 'https://basescan.org',
      84532: 'https://sepolia.basescan.org',
    }
    const baseUrl = chainExplorers[chainId] || 'https://etherscan.io'
    return `${baseUrl}/address/${account}`
  }

  if (!account) {
    return (
      <div className="flex flex-col items-center gap-4">
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm max-w-md">
            {error}
          </div>
        )}
        <button
          onClick={connectMetaMask}
          disabled={isConnecting || !isMetaMask}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Wallet className="w-5 h-5" />
          {isConnecting
            ? 'Connecting...'
            : !isMetaMask
            ? 'Install MetaMask'
            : 'Connect Wallet'}
        </button>
        {!isMetaMask && (
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 hover:text-amber-300 text-sm underline"
          >
            Download MetaMask
          </a>
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-3 px-4 py-2 glass-card rounded-lg hover:border-amber-500/50 transition-all"
      >
        <div className="flex flex-col items-end">
          <div className="text-sm font-medium">{formatAddress(account)}</div>
          {balance && (
            <div className="text-xs text-amber-400">
              {parseFloat(balance).toFixed(4)} ETH
            </div>
          )}
        </div>
        <Wallet className="w-5 h-5 text-amber-400" />
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 mt-2 w-72 glass-card rounded-lg p-4 z-20 shadow-2xl border border-amber-500/20">
            <div className="space-y-3">
              <div className="pb-3 border-b border-amber-500/20">
                <div className="text-xs text-gray-400 mb-1">Connected Account</div>
                <div className="flex items-center justify-between">
                  <div className="font-mono text-sm">{formatAddress(account)}</div>
                  <button
                    onClick={handleCopy}
                    className="p-1 hover:bg-amber-500/20 rounded transition-colors"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {balance && (
                <div className="pb-3 border-b border-amber-500/20">
                  <div className="text-xs text-gray-400 mb-1">Balance</div>
                  <div className="text-lg font-semibold text-amber-400">
                    {parseFloat(balance).toFixed(6)} ETH
                  </div>
                </div>
              )}

              {chainId && (
                <div className="pb-3 border-b border-amber-500/20">
                  <div className="text-xs text-gray-400 mb-1">Network</div>
                  <div className="text-sm">{chainId}</div>
                </div>
              )}

              <div className="flex gap-2">
                <a
                  href={getExplorerUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-amber-500/20 hover:bg-amber-500/30 rounded-lg text-sm transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  View on Explorer
                </a>
                <button
                  onClick={() => {
                    disconnect()
                    setShowMenu(false)
                    toast.info('Wallet disconnected')
                    // Scroll to top and ensure landing page is visible
                    setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }, 100)
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-sm transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default WalletButton
