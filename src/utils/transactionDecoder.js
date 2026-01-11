import { ethers } from 'ethers'

/**
 * Decode transaction details for user preview
 */
export const decodeTransaction = async (provider, transaction) => {
  try {
    const decoded = {
      to: transaction.to,
      value: transaction.value ? ethers.formatEther(transaction.value) : '0',
      data: transaction.data || '0x',
      gasLimit: null,
      gasPrice: null,
      maxFeePerGas: null,
      maxPriorityFeePerGas: null,
      nonce: null,
      chainId: null,
      isContract: false,
      functionName: null,
      functionParams: null,
      hasData: false,
    }

    // Get network info
    if (provider) {
      const network = await provider.getNetwork()
      decoded.chainId = Number(network.chainId)
    }

    // Check if it's a contract interaction
    if (transaction.to && transaction.data && transaction.data !== '0x') {
      decoded.hasData = true
      decoded.isContract = true
      
      // Try to decode function call if we have ABI (basic ERC20 functions)
      try {
        const iface = new ethers.Interface([
          'function transfer(address to, uint256 amount)',
          'function approve(address spender, uint256 amount)',
          'function transferFrom(address from, address to, uint256 amount)',
        ])
        
        const decodedData = iface.parseTransaction({ data: transaction.data })
        if (decodedData) {
          decoded.functionName = decodedData.name
          decoded.functionParams = decodedData.args.map((arg, i) => ({
            name: decodedData.fragment.inputs[i]?.name || `param${i}`,
            type: decodedData.fragment.inputs[i]?.type,
            value: arg.toString(),
          }))
        }
      } catch (e) {
        // Not a standard function, just show raw data
        decoded.functionName = 'Unknown Function'
      }
    }

    // Estimate gas if provider is available
    if (provider && transaction.to) {
      try {
        // Get the signer's address for gas estimation
        const signer = await provider.getSigner()
        const fromAddress = await signer.getAddress()
        
        const gasEstimate = await provider.estimateGas({
          from: fromAddress,
          to: transaction.to,
          value: transaction.value || 0,
          data: transaction.data || '0x',
        })
        decoded.gasLimit = gasEstimate.toString()
      } catch (error) {
        console.error('Gas estimation error:', error)
        decoded.gasLimit = 'Unable to estimate'
      }
    }

    // Get current gas price
    if (provider) {
      try {
        const feeData = await provider.getFeeData()
        decoded.gasPrice = feeData.gasPrice ? ethers.formatUnits(feeData.gasPrice, 'gwei') : null
        decoded.maxFeePerGas = feeData.maxFeePerGas ? ethers.formatUnits(feeData.maxFeePerGas, 'gwei') : null
        decoded.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas ? ethers.formatUnits(feeData.maxPriorityFeePerGas, 'gwei') : null
      } catch (error) {
        console.error('Error getting fee data:', error)
      }
    }

    return decoded
  } catch (error) {
    console.error('Error decoding transaction:', error)
    throw new Error('Failed to decode transaction')
  }
}

/**
 * Calculate estimated transaction cost
 */
export const calculateTransactionCost = (decoded, gasPrice) => {
  if (!decoded.gasLimit || !gasPrice) return null

  try {
    const gasLimit = BigInt(decoded.gasLimit)
    const price = ethers.parseUnits(gasPrice, 'gwei')
    const totalCost = gasLimit * price
    return ethers.formatEther(totalCost)
  } catch (error) {
    return null
  }
}

/**
 * Format address for display
 */
export const formatAddress = (address) => {
  if (!address) return 'N/A'
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}
