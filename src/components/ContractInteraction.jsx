import { useState } from 'react'
import { FileText, Loader2 } from 'lucide-react'
import { useWallet } from '../hooks/useWallet'
import { getContract, readContract, writeContract, waitForTransaction, ERC20_ABI } from '../utils/contracts'

const ContractInteraction = () => {
  const { signer, isConnected } = useWallet()
  const [contractAddress, setContractAddress] = useState('')
  const [functionName, setFunctionName] = useState('')
  const [params, setParams] = useState('')
  const [result, setResult] = useState('')
  const [txHash, setTxHash] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isReadOnly, setIsReadOnly] = useState(true)

  const handleReadContract = async (e) => {
    e.preventDefault()
    if (!isConnected || !signer) {
      setError('Please connect your wallet first')
      return
    }

    setIsLoading(true)
    setError('')
    setResult('')

    try {
      if (!contractAddress.trim()) {
        throw new Error('Contract address is required')
      }

      const contract = getContract(contractAddress, ERC20_ABI, signer)
      const paramArray = params ? params.split(',').map(p => p.trim()) : []
      
      const res = await readContract(contract, functionName, paramArray)
      setResult(res.toString())
    } catch (err) {
      setError(err.message || 'Failed to read from contract')
    } finally {
      setIsLoading(false)
    }
  }

  const handleWriteContract = async (e) => {
    e.preventDefault()
    if (!isConnected || !signer) {
      setError('Please connect your wallet first')
      return
    }

    setIsLoading(true)
    setError('')
    setTxHash('')

    try {
      if (!contractAddress.trim()) {
        throw new Error('Contract address is required')
      }

      const contract = getContract(contractAddress, ERC20_ABI, signer)
      const paramArray = params ? params.split(',').map(p => p.trim()) : []
      
      const tx = await writeContract(contract, functionName, paramArray)
      setTxHash(tx.hash)
      
      // Wait for confirmation
      const receipt = await waitForTransaction(tx)
      setResult(`Transaction confirmed! Block: ${receipt.blockNumber}`)
    } catch (err) {
      setError(err.message || 'Failed to write to contract')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="glass-card rounded-xl p-8 text-center">
        <p className="text-gray-400">Connect your wallet to interact with smart contracts</p>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-amber-400" />
        Smart Contract Interaction
      </h3>
      
      <div className="mb-4">
        <label className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            checked={isReadOnly}
            onChange={(e) => setIsReadOnly(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-400">Read-only (view function)</span>
        </label>
      </div>

      <form onSubmit={isReadOnly ? handleReadContract : handleWriteContract} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Contract Address</label>
          <input
            type="text"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-2 bg-black/30 border border-amber-500/20 rounded-lg focus:outline-none focus:border-amber-500/50 text-white font-mono text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Function Name</label>
          <input
            type="text"
            value={functionName}
            onChange={(e) => setFunctionName(e.target.value)}
            placeholder="balanceOf, transfer, approve, etc."
            className="w-full px-4 py-2 bg-black/30 border border-amber-500/20 rounded-lg focus:outline-none focus:border-amber-500/50 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Parameters (comma-separated)
          </label>
          <input
            type="text"
            value={params}
            onChange={(e) => setParams(e.target.value)}
            placeholder="0x123..., 1000000, etc."
            className="w-full px-4 py-2 bg-black/30 border border-amber-500/20 rounded-lg focus:outline-none focus:border-amber-500/50 text-white"
          />
          <p className="text-xs text-gray-500 mt-1">
            Example: For balanceOf, enter: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {isReadOnly ? 'Reading...' : 'Writing...'}
            </>
          ) : (
            isReadOnly ? 'Read Contract' : 'Write Contract'
          )}
        </button>
      </form>

      {result && (
        <div className="mt-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
          <p className="text-sm text-green-300 mb-1">Result:</p>
          <p className="font-mono text-xs break-all">{result}</p>
        </div>
      )}

      {txHash && (
        <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg">
          <p className="text-sm text-blue-300 mb-1">Transaction Hash:</p>
          <p className="font-mono text-xs break-all">{txHash}</p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      <div className="mt-6 p-4 bg-black/30 rounded-lg">
        <p className="text-sm font-semibold mb-2 text-amber-400">Common ERC20 Functions:</p>
        <ul className="text-xs text-gray-400 space-y-1 font-mono">
          <li>• balanceOf(address) - Get token balance</li>
          <li>• transfer(address, uint256) - Transfer tokens</li>
          <li>• approve(address, uint256) - Approve spender</li>
          <li>• allowance(address, address) - Check allowance</li>
          <li>• decimals() - Get token decimals</li>
          <li>• symbol() - Get token symbol</li>
        </ul>
      </div>
    </div>
  )
}

export default ContractInteraction
