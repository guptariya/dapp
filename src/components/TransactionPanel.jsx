import { useState } from 'react'
import { Send, MessageSquare, Loader2 } from 'lucide-react'
import { useWallet } from '../hooks/useWallet'
import { ethers } from 'ethers'
import { toast } from '../utils/toast'
import { transactionHistory } from '../utils/transactionHistory'
import { decodeTransaction } from '../utils/transactionDecoder'
import TransactionPreview from './TransactionPreview'

const TransactionPanel = () => {
  const { account, chainId, provider, sendTransaction, signMessage, isConnected } = useWallet()
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')
  const [txHash, setTxHash] = useState('')
  const [signature, setSignature] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [previewTransaction, setPreviewTransaction] = useState(null)
  const [decodedTx, setDecodedTx] = useState(null)
  const [isDecoding, setIsDecoding] = useState(false)

  const handlePreviewTransaction = async (e) => {
    e.preventDefault()
    if (!isConnected) {
      setError('Please connect your wallet first')
      return
    }

    setIsDecoding(true)
    setError('')

    try {
      if (!ethers.isAddress(recipient)) {
        throw new Error('Invalid recipient address')
      }

      if (!amount || parseFloat(amount) <= 0) {
        throw new Error('Invalid amount')
      }

      // Build transaction object
      const tx = {
        to: recipient,
        value: ethers.parseEther(amount),
        data: '0x',
      }

      // Decode transaction
      const decoded = await decodeTransaction(provider, tx)
      
      setPreviewTransaction(tx)
      setDecodedTx(decoded)
      setShowPreview(true)
    } catch (err) {
      const errorMsg = err.message || 'Failed to decode transaction'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setIsDecoding(false)
    }
  }

  const handleConfirmTransaction = async () => {
    if (!previewTransaction) return

    setIsLoading(true)
    setError('')
    setTxHash('')
    setShowPreview(false)

    try {
      const tx = await sendTransaction(
        previewTransaction.to,
        ethers.formatEther(previewTransaction.value)
      )
      
      setTxHash(tx.hash)
      toast.info(`Transaction submitted: ${tx.hash.slice(0, 10)}...`)
      
      // Save to transaction history
      transactionHistory.add({
        hash: tx.hash,
        from: account,
        to: previewTransaction.to,
        value: ethers.formatEther(previewTransaction.value),
        chainId: chainId,
        status: 'pending',
      })
      
      // Wait for transaction to be mined
      const receipt = await tx.wait()
      toast.success('Transaction confirmed!')
      
      // Update transaction history
      transactionHistory.update(tx.hash, {
        status: 'confirmed',
        blockNumber: receipt.blockNumber,
      })
      
      setRecipient('')
      setAmount('')
      setPreviewTransaction(null)
      setDecodedTx(null)
    } catch (err) {
      const errorMsg = err.message || 'Transaction failed'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelPreview = () => {
    setShowPreview(false)
    setPreviewTransaction(null)
    setDecodedTx(null)
  }

  const handleSignMessage = async (e) => {
    e.preventDefault()
    if (!isConnected) {
      setError('Please connect your wallet first')
      return
    }

    setIsLoading(true)
    setError('')
    setSignature('')

    try {
      if (!message.trim()) {
        throw new Error('Message cannot be empty')
      }

      const sig = await signMessage(message)
      setSignature(sig)
      toast.success('Message signed successfully!')
    } catch (err) {
      const errorMsg = err.message || 'Failed to sign message'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="glass-card rounded-xl p-8 text-center">
        <p className="text-gray-400">Connect your wallet to send transactions</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Send Transaction */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Send className="w-5 h-5 text-amber-400" />
          Send Transaction
        </h3>
        <form onSubmit={handlePreviewTransaction} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Recipient Address</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-2 bg-black/30 border border-amber-500/20 rounded-lg focus:outline-none focus:border-amber-500/50 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Amount (ETH)</label>
            <input
              type="number"
              step="0.0001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              className="w-full px-4 py-2 bg-black/30 border border-amber-500/20 rounded-lg focus:outline-none focus:border-amber-500/50 text-white"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isDecoding ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Decoding...
              </>
            ) : (
              'Preview Transaction'
            )}
          </button>
        </form>
        {txHash && (
          <div className="mt-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
            <p className="text-sm text-green-300">
              Transaction sent! Hash: <span className="font-mono text-xs">{txHash}</span>
            </p>
          </div>
        )}
      </div>

      {/* Sign Message */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-amber-400" />
          Sign Message
        </h3>
        <form onSubmit={handleSignMessage} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter message to sign..."
              rows="4"
              className="w-full px-4 py-2 bg-black/30 border border-amber-500/20 rounded-lg focus:outline-none focus:border-amber-500/50 text-white resize-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing...
              </>
            ) : (
              'Sign Message'
            )}
          </button>
        </form>
        {signature && (
          <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg">
            <p className="text-sm text-blue-300 mb-2">Signature:</p>
            <p className="font-mono text-xs break-all">{signature}</p>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* Transaction Preview Modal */}
      {showPreview && previewTransaction && decodedTx && (
        <TransactionPreview
          transaction={previewTransaction}
          decoded={decodedTx}
          onConfirm={handleConfirmTransaction}
          onCancel={handleCancelPreview}
          isLoading={isLoading}
        />
      )}
    </div>
  )
}

export default TransactionPanel
