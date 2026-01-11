import { X, Send, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react'
import { ethers } from 'ethers'
import { formatAddress, calculateTransactionCost } from '../utils/transactionDecoder'

const TransactionPreview = ({ transaction, decoded, onConfirm, onCancel, isLoading }) => {
  if (!transaction || !decoded) return null

  const estimatedCost = calculateTransactionCost(decoded, decoded.gasPrice)
  const totalAmount = parseFloat(decoded.value) + (estimatedCost ? parseFloat(estimatedCost) : 0)

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-amber-500/30">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold gradient-text flex items-center gap-2">
            <Send className="w-6 h-6" />
            Transaction Preview
          </h3>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Warning */}
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-200 mb-1">Review Transaction Details</p>
              <p className="text-xs text-yellow-300/80">
                Please review all details carefully before confirming. This action cannot be undone.
              </p>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">To Address</label>
                <div className="font-mono text-sm break-all bg-black/30 p-2 rounded">
                  {decoded.to || 'Contract Creation'}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatAddress(decoded.to)}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">Amount</label>
                <div className="text-lg font-semibold text-amber-400">
                  {parseFloat(decoded.value).toFixed(6)} ETH
                </div>
              </div>
            </div>

            {/* Contract Interaction */}
            {decoded.isContract && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <label className="text-xs text-gray-400 mb-2 block">Contract Interaction</label>
                {decoded.functionName && decoded.functionName !== 'Unknown Function' ? (
                  <div>
                    <div className="font-mono text-sm text-blue-300 mb-2">
                      {decoded.functionName}
                    </div>
                    {decoded.functionParams && decoded.functionParams.length > 0 && (
                      <div className="space-y-1">
                        {decoded.functionParams.map((param, i) => (
                          <div key={i} className="text-xs text-gray-300">
                            <span className="text-gray-400">{param.name}:</span>{' '}
                            <span className="font-mono">
                              {param.type === 'address' ? formatAddress(param.value) : param.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-gray-400">
                    Custom contract call (data: {decoded.data.slice(0, 20)}...)
                  </div>
                )}
              </div>
            )}

            {/* Gas Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Gas Limit</label>
                <div className="text-sm font-mono">
                  {decoded.gasLimit ? Number(decoded.gasLimit).toLocaleString() : 'Estimating...'}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">Gas Price</label>
                <div className="text-sm">
                  {decoded.gasPrice ? `${parseFloat(decoded.gasPrice).toFixed(2)} Gwei` : 'N/A'}
                </div>
              </div>
            </div>

            {/* Estimated Cost */}
            {estimatedCost && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Estimated Gas Cost</label>
                    <div className="text-sm text-amber-400">
                      {parseFloat(estimatedCost).toFixed(6)} ETH
                    </div>
                  </div>
                  <div className="text-right">
                    <label className="text-xs text-gray-400 mb-1 block">Total Amount</label>
                    <div className="text-lg font-semibold text-amber-400">
                      {totalAmount.toFixed(6)} ETH
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Network */}
            {decoded.chainId && (
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Network</label>
                <div className="text-sm">Chain ID: {decoded.chainId}</div>
              </div>
            )}

            {/* Raw Data (if present) */}
            {decoded.hasData && decoded.data !== '0x' && (
              <details className="bg-black/30 rounded-lg p-3">
                <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-300">
                  View Raw Data
                </summary>
                <div className="mt-2 font-mono text-xs break-all text-gray-400">
                  {decoded.data}
                </div>
              </details>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-amber-500/20">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-gray-500/20 hover:bg-gray-500/30 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Confirm & Send
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransactionPreview
