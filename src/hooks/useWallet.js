import { useState, useEffect, useCallback, useRef } from 'react'
import { ethers } from 'ethers'
import { DEFAULT_CHAIN, SUPPORTED_CHAINS } from '../config/walletConfig'
import { toast } from '../utils/toast'

export const useWallet = () => {
  const [account, setAccount] = useState(null)
  const [chainId, setChainId] = useState(null)
  const [balance, setBalance] = useState(null)
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState(null)
  const [isMetaMask, setIsMetaMask] = useState(false)
  const [isManuallyDisconnected, setIsManuallyDisconnected] = useState(false)

  // Check if MetaMask is installed
  const checkMetaMask = useCallback(() => {
    if (typeof window.ethereum !== 'undefined') {
      setIsMetaMask(true)
      return true
    }
    return false
  }, [])

  // Use refs to store latest values for event handlers
  const accountRef = useRef(account)
  const providerRef = useRef(provider)

  // Update refs when values change
  useEffect(() => {
    accountRef.current = account
    providerRef.current = provider
  }, [account, provider])

  // Helper functions (defined before event handlers)
  const updateChainId = useCallback(async () => {
    try {
      if (window.ethereum) {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' })
        setChainId(parseInt(chainId, 16))
      }
    } catch (err) {
      console.error('Error updating chain ID:', err)
    }
  }, [])

  const updateBalance = useCallback(async (address) => {
    try {
      // Use current provider from ref if available, otherwise use state
      const currentProvider = providerRef.current || provider
      if (currentProvider && address) {
        const balance = await currentProvider.getBalance(address)
        setBalance(ethers.formatEther(balance))
      }
    } catch (err) {
      console.error('Error updating balance:', err)
    }
  }, [provider])

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setIsManuallyDisconnected(true)
    setAccount(null)
    setChainId(null)
    setBalance(null)
    setProvider(null)
    setSigner(null)
    setError(null)
    accountRef.current = null
    providerRef.current = null
  }, [])

  // Handle account changes from MetaMask
  const handleAccountsChanged = useCallback(async (accounts) => {
    try {
      if (accounts.length === 0) {
        // User disconnected account in MetaMask
        disconnect()
        toast.info('Account disconnected')
      } else {
        const newAccount = accounts[0]
        
        // Check if account actually changed
        if (newAccount.toLowerCase() !== accountRef.current?.toLowerCase()) {
          // Update account
          setAccount(newAccount)
          
          // Update provider and signer
          if (window.ethereum) {
            const newProvider = new ethers.BrowserProvider(window.ethereum)
            setProvider(newProvider)
            providerRef.current = newProvider
            const newSigner = await newProvider.getSigner()
            setSigner(newSigner)
            
            // Update balance and chain ID
            await updateChainId()
            await updateBalance(newAccount)
            
            // Notify user
            toast.success(`Switched to account: ${newAccount.slice(0, 6)}...${newAccount.slice(-4)}`)
          }
        }
      }
    } catch (error) {
      console.error('Error handling account change:', error)
      toast.error('Failed to update account')
    }
  }, [disconnect, updateChainId, updateBalance])

  // Handle chain changes from MetaMask
  const handleChainChanged = useCallback((chainIdHex) => {
    try {
      const chainIdNumber = parseInt(chainIdHex, 16)
      setChainId(chainIdNumber)
      
      // Get chain name
      const chain = Object.values(SUPPORTED_CHAINS)
        .find(c => c.id === chainIdNumber)
      const chainName = chain?.name || `Chain ${chainIdNumber}`
      
      toast.info(`Switched to ${chainName}`)
      
      // Update balance for new chain
      if (accountRef.current) {
        updateBalance(accountRef.current)
      }
    } catch (error) {
      console.error('Error handling chain change:', error)
    }
  }, [updateBalance])

  // Initialize provider and set up event listeners
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.BrowserProvider(window.ethereum)
      setProvider(provider)
      setIsMetaMask(true)

      // Set up event listeners
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)

      // Check if already connected (only if not manually disconnected)
      if (!isManuallyDisconnected) {
        checkConnection()
      }
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [handleAccountsChanged, handleChainChanged, isManuallyDisconnected])

  const checkConnection = async () => {
    try {
      // Don't auto-connect if user manually disconnected
      if (isManuallyDisconnected) {
        return
      }
      
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          setAccount(accounts[0])
          accountRef.current = accounts[0]
          const provider = new ethers.BrowserProvider(window.ethereum)
          setProvider(provider)
          providerRef.current = provider
          const signer = await provider.getSigner()
          setSigner(signer)
          await updateChainId()
          await updateBalance(accounts[0])
        }
      }
    } catch (err) {
      console.error('Error checking connection:', err)
    }
  }

  // Connect to MetaMask
  const connectMetaMask = useCallback(async () => {
    setIsConnecting(true)
    setError(null)
    setIsManuallyDisconnected(false) // Reset manual disconnect flag

    try {
      if (!checkMetaMask()) {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.')
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      if (accounts.length === 0) {
        throw new Error('No accounts found')
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      setProvider(provider)
      providerRef.current = provider
      const signer = await provider.getSigner()
      setSigner(signer)

      setAccount(accounts[0])
      accountRef.current = accounts[0]
      await updateChainId()
      await updateBalance(accounts[0])

      // Switch to default chain if needed
      const currentChainId = await window.ethereum.request({ method: 'eth_chainId' })
      const currentChainIdNumber = parseInt(currentChainId, 16)
      
      if (currentChainIdNumber !== DEFAULT_CHAIN.id) {
        await switchChain(DEFAULT_CHAIN.id)
      }
    } catch (err) {
      setError(err.message || 'Failed to connect to MetaMask')
      console.error('Connection error:', err)
    } finally {
      setIsConnecting(false)
    }
  }, [checkMetaMask])

  // Switch chain
  const switchChain = async (chainId) => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      })
      await updateChainId()
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        throw new Error('Please add this network to MetaMask first')
      }
      throw switchError
    }
  }

  // Send transaction
  const sendTransaction = useCallback(async (to, value, data = null) => {
    if (!signer) {
      throw new Error('Wallet not connected')
    }

    try {
      const tx = {
        to,
        value: ethers.parseEther(value),
        ...(data && { data }),
      }

      const transaction = await signer.sendTransaction(tx)
      return transaction
    } catch (err) {
      throw new Error(err.message || 'Transaction failed')
    }
  }, [signer])

  // Sign message
  const signMessage = useCallback(async (message) => {
    if (!signer) {
      throw new Error('Wallet not connected')
    }

    try {
      const signature = await signer.signMessage(message)
      return signature
    } catch (err) {
      throw new Error(err.message || 'Failed to sign message')
    }
  }, [signer])

  useEffect(() => {
    if (account && provider) {
      updateBalance(account)
      const interval = setInterval(() => {
        updateBalance(account)
      }, 10000) // Update balance every 10 seconds

      return () => clearInterval(interval)
    }
  }, [account, provider])

  return {
    account,
    chainId,
    balance,
    provider,
    signer,
    isConnecting,
    error,
    isMetaMask,
    connectMetaMask,
    disconnect,
    switchChain,
    sendTransaction,
    signMessage,
    isConnected: !!account,
  }
}
