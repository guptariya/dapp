import { useState } from 'react'
import { Network, ChevronDown, Check } from 'lucide-react'
import { useWallet } from '../hooks/useWallet'
import { SUPPORTED_CHAINS } from '../config/walletConfig'

const NetworkSwitcher = () => {
  const { chainId, switchChain, isConnected } = useWallet()
  const [isOpen, setIsOpen] = useState(false)

  const currentChain = Object.values(SUPPORTED_CHAINS).find(
    chain => chain.id === chainId
  ) || SUPPORTED_CHAINS.sepolia

  const handleSwitch = async (targetChainId) => {
    if (targetChainId === chainId) {
      setIsOpen(false)
      return
    }

    try {
      await switchChain(targetChainId)
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to switch network:', error)
    }
  }

  if (!isConnected) {
    return null
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 glass-card rounded-lg hover:border-amber-500/50 transition-all"
      >
        <Network className="w-4 h-4 text-amber-400" />
        <span className="text-sm font-medium">{currentChain.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 glass-card rounded-lg p-2 z-20 shadow-2xl border border-amber-500/20">
            <div className="text-xs text-gray-400 px-3 py-2 mb-1">Switch Network</div>
            <div className="space-y-1">
              {Object.values(SUPPORTED_CHAINS).map((chain) => (
                <button
                  key={chain.id}
                  onClick={() => handleSwitch(chain.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                    chainId === chain.id
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'hover:bg-amber-500/10 text-gray-300'
                  }`}
                >
                  <div>
                    <div className="font-medium">{chain.name}</div>
                    <div className="text-xs text-gray-500">Chain ID: {chain.id}</div>
                  </div>
                  {chainId === chain.id && (
                    <Check className="w-4 h-4 text-amber-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default NetworkSwitcher
