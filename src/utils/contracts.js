import { ethers } from 'ethers'

/**
 * Contract interaction utilities
 * Use these functions to interact with smart contracts
 */

/**
 * Get contract instance
 * @param {string} address - Contract address
 * @param {Array} abi - Contract ABI
 * @param {ethers.Signer} signer - Signer instance
 * @returns {ethers.Contract} Contract instance
 */
export const getContract = (address, abi, signer) => {
  return new ethers.Contract(address, abi, signer)
}

/**
 * Read from contract (view function)
 * @param {ethers.Contract} contract - Contract instance
 * @param {string} functionName - Function name to call
 * @param {Array} params - Function parameters
 * @returns {Promise<any>} Function result
 */
export const readContract = async (contract, functionName, params = []) => {
  try {
    const result = await contract[functionName](...params)
    return result
  } catch (error) {
    console.error(`Error reading ${functionName}:`, error)
    throw error
  }
}

/**
 * Write to contract (state-changing function)
 * @param {ethers.Contract} contract - Contract instance
 * @param {string} functionName - Function name to call
 * @param {Array} params - Function parameters
 * @param {Object} options - Transaction options (gasLimit, value, etc.)
 * @returns {Promise<ethers.TransactionResponse>} Transaction response
 */
export const writeContract = async (
  contract,
  functionName,
  params = [],
  options = {}
) => {
  try {
    const tx = await contract[functionName](...params, options)
    return tx
  } catch (error) {
    console.error(`Error writing ${functionName}:`, error)
    throw error
  }
}

/**
 * Wait for transaction confirmation
 * @param {ethers.TransactionResponse} tx - Transaction response
 * @param {number} confirmations - Number of confirmations to wait for
 * @returns {Promise<ethers.TransactionReceipt>} Transaction receipt
 */
export const waitForTransaction = async (tx, confirmations = 1) => {
  try {
    const receipt = await tx.wait(confirmations)
    return receipt
  } catch (error) {
    console.error('Error waiting for transaction:', error)
    throw error
  }
}

/**
 * Format token amount
 * @param {bigint} amount - Token amount in wei/smallest unit
 * @param {number} decimals - Token decimals
 * @returns {string} Formatted amount
 */
export const formatTokenAmount = (amount, decimals = 18) => {
  return ethers.formatUnits(amount, decimals)
}

/**
 * Parse token amount
 * @param {string} amount - Token amount as string
 * @param {number} decimals - Token decimals
 * @returns {bigint} Parsed amount in wei/smallest unit
 */
export const parseTokenAmount = (amount, decimals = 18) => {
  return ethers.parseUnits(amount, decimals)
}

/**
 * Example ERC20 ABI (minimal)
 */
export const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
]

/**
 * Example usage:
 * 
 * const contract = getContract(CONTRACT_ADDRESS, ERC20_ABI, signer)
 * const balance = await readContract(contract, 'balanceOf', [userAddress])
 * const tx = await writeContract(contract, 'transfer', [recipient, amount])
 * await waitForTransaction(tx)
 */
