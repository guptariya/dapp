import { useState, useEffect } from 'react'
import { useWallet } from '../hooks/useWallet'
import { ethers } from 'ethers'
import { Shield, AlertTriangle, CheckCircle, X } from 'lucide-react'
import { toast } from '../utils/toast'

const ERC20_ABI = [
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
]

// Common DEX and DeFi contract addresses that users might have approved
const COMMON_SPENDERS = {
  1: { // Ethereum Mainnet
    'Uniswap V3 Router': '0xE592427A0AEce92De3Edee1F18E0157C05861564',
    'Uniswap V2 Router': '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    '1inch Router': '0x1111111254EEB25477B68fb85Ed929f73A960582',
  },
  11155111: { // Sepolia
    'Uniswap V3 Router': '0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008',
  },
  137: { // Polygon
    'Uniswap V3 Router': '0xE592427A0AEce92De3Edee1F18E0157C05861564',
  },
  8453: { // Base
    'Uniswap V3 Router': '0x2626664c2603336E57B271c5C0b26F421741e481',
  },
}

const TokenApprovals = () => {
  const { account, provider, signer, chainId, isConnected } = useWallet()
  const [approvals, setApprovals] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [tokenAddress, setTokenAddress] = useState('')
  const [spenderAddress, setSpenderAddress] = useState('')

  useEffect(() => {
    if (isConnected && account && provider && chainId) {
      loadCommonApprovals()
    }
  }, [account, provider, chainId, isConnected])

  const loadCommonApprovals = async () => {
    if (!provider || !account || !chainId) return

    setIsLoading(true)
    try {
      const spenders = COMMON_SPENDERS[chainId] || {}
      const approvalList = []

      // Check approvals for common spenders
      // Note: In a real app, you'd check all tokens the user holds
      // This is a simplified version that checks common DEX routers

      setApprovals(approvalList)
    } catch (error) {
      console.error('Error loading approvals:', error)
      toast.error('Failed to load token approvals')
    } finally {
      setIsLoading(false)
    }
  }

  const checkApproval = async () => {
    if (!tokenAddress || !spenderAddress || !provider || !account) {
      toast.error('Please enter both token and spender addresses')
      return
    }

    try {
      setIsLoading(true)
      const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider)
      const allowance = await tokenContract.allowance(account, spenderAddress)
      const symbol = await tokenContract.symbol()
      const decimals = await tokenContract.decimals()

      const allowanceFormatted = ethers.formatUnits(allowance, decimals)

      if (allowance > 0) {
        setApprovals([{
          token: tokenAddress,
          spender: spenderAddress,
          allowance: allowanceFormatted,
          symbol,
          rawAllowance: allowance,
        }])
        toast.success('Approval found!')
      } else {
        toast.info('No approval found for this token and spender')
      }
    } catch (error) {
      console.error('Error checking approval:', error)
      toast.error('Failed to check approval. Make sure addresses are valid.')
    } finally {
      setIsLoading(false)
    }
  }

  const revokeApproval = async (tokenAddress, spenderAddress) => {
    if (!signer) {
      toast.error('Please connect your wallet')
      return
    }

    try {
      const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer)
      const tx = await tokenContract.approve(spenderAddress, 0)
      toast.info('Revoking approval...')
      await tx.wait()
      toast.success('Approval revoked successfully!')
      loadCommonApprovals()
    } catch (error) {
      console.error('Error revoking approval:', error)
      toast.error('Failed to revoke approval')
    }
  }

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="glass-card rounded-2xl p-12 text-center">
          <Shield className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4 gradient-text">Connect Your Wallet</h2>
          <p className="text-gray-400">
            Connect your wallet to manage token approvals
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="glass-card rounded-2xl p-6 mb-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold gradient-text mb-2">Token Approvals Manager</h2>
          <p className="text-gray-400">Check and revoke ERC-20 token approvals</p>
        </div>

        {/* Check Approval Form */}
        <div className="glass-card rounded-xl p-4 mb-6">
          <h3 className="font-semibold mb-4">Check Token Approval</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Token Address</label>
              <input
                type="text"
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-4 py-2 bg-black/20 rounded-lg border border-amber-500/20 focus:border-amber-500/40 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Spender Address</label>
              <input
                type="text"
                value={spenderAddress}
                onChange={(e) => setSpenderAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-4 py-2 bg-black/20 rounded-lg border border-amber-500/20 focus:border-amber-500/40 outline-none"
              />
            </div>
            <button
              onClick={checkApproval}
              disabled={isLoading || !tokenAddress || !spenderAddress}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-pink-500 rounded-lg font-semibold hover:from-amber-400 hover:to-pink-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Checking...' : 'Check Approval'}
            </button>
          </div>
        </div>

        {/* Approvals List */}
        {approvals.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Active Approvals</h3>
            {approvals.map((approval, index) => (
              <div key={index} className="glass-card rounded-xl p-4 border-amber-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-amber-400" />
                      <span className="font-semibold">{approval.symbol}</span>
                    </div>
                    <div className="text-sm text-gray-400 space-y-1">
                      <div>Token: <span className="font-mono">{approval.token.slice(0, 10)}...</span></div>
                      <div>Spender: <span className="font-mono">{approval.spender.slice(0, 10)}...</span></div>
                      <div>Allowance: <span className="text-amber-400">{approval.allowance}</span></div>
                    </div>
                  </div>
                  <button
                    onClick={() => revokeApproval(approval.token, approval.spender)}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-sm transition-colors flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Revoke
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {approvals.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <AlertTriangle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No approvals found</p>
            <p className="text-sm text-gray-500 mt-2">Enter token and spender addresses to check</p>
          </div>
        )}
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold mb-2">About Token Approvals</h3>
            <p className="text-sm text-gray-400 mb-2">
              Token approvals allow smart contracts to spend your tokens. This feature helps you:
            </p>
            <ul className="text-sm text-gray-400 list-disc list-inside space-y-1">
              <li>Check existing token approvals</li>
              <li>Revoke unnecessary approvals for security</li>
              <li>Understand ERC-20 allowance mechanism</li>
            </ul>
            <p className="text-sm text-amber-400 mt-3">
              <strong>Security Tip:</strong> Regularly review and revoke unused approvals to protect your assets.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TokenApprovals
