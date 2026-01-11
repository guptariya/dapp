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
        // User disconnected account in MetaMask - fully disconnect
        setIsManuallyDisconnected(true)
        setAccount(null)
        setChainId(null)
        setBalance(null)
        setProvider(null)
        setSigner(null)
        setError(null)
        accountRef.current = null
        providerRef.current = null
        toast.info('Account disconnected from MetaMask')
      } else {
        const newAccount = accounts[0]
        
        // Check if account actually changed
        if (newAccount.toLowerCase() !== accountRef.current?.toLowerCase()) {
          // Update account immediately
          setAccount(newAccount)
          accountRef.current = newAccount
          
          // Update provider and signer
          if (window.ethereum) {
            const newProvider = new ethers.BrowserProvider(window.ethereum)
            setProvider(newProvider)
            providerRef.current = newProvider
            const newSigner = await newProvider.getSigner()
            setSigner(newSigner)
            
            // Update balance and chain ID
            try {
              const chainId = await window.ethereum.request({ method: 'eth_chainId' })
              setChainId(parseInt(chainId, 16))
            } catch (err) {
              console.error('Error updating chain ID:', err)
            }
            
            try {
              const balance = await newProvider.getBalance(newAccount)
              setBalance(ethers.formatEther(balance))
            } catch (err) {
              console.error('Error updating balance:', err)
            }
            
            // Notify user
            toast.success(`Switched to account: ${newAccount.slice(0, 6)}...${newAccount.slice(-4)}`)
          }
        }
      }
    } catch (error) {
      console.error('Error handling account change:', error)
      toast.error('Failed to update account')
    }
  }, [])

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
      if (accountRef.current && providerRef.current) {
        providerRef.current.getBalance(accountRef.current)
          .then(balance => {
            setBalance(ethers.formatEther(balance))
          })
          .catch(err => {
            console.error('Error updating balance:', err)
          })
      }
    } catch (error) {
      console.error('Error handling chain change:', error)
    }
  }, [])

  // Check connection function
  const checkConnection = useCallback(async () => {
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
  }, [isManuallyDisconnected, updateChainId, updateBalance])

  // Initialize provider and set up event listeners
  useEffect(() => {
    if (typeof window.ethereum === 'undefined') {
      return
    }

    setIsMetaMask(true)

    // Set up event listeners - use arrow functions to ensure they're always current
    const accountsChangedHandler = (accounts) => {
      handleAccountsChanged(accounts)
    }

    const chainChangedHandler = (chainIdHex) => {
      handleChainChanged(chainIdHex)
    }

    // Remove any existing listeners first to avoid duplicates
    window.ethereum.removeAllListeners('accountsChanged')
    window.ethereum.removeAllListeners('chainChanged')

    // Add new listeners
    window.ethereum.on('accountsChanged', accountsChangedHandler)
    window.ethereum.on('chainChanged', chainChangedHandler)

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', accountsChangedHandler)
        window.ethereum.removeListener('chainChanged', chainChangedHandler)
      }
    }
  }, [handleAccountsChanged, handleChainChanged])

  // Check connection on mount (only once)
  useEffect(() => {
    let mounted = true
    
    const initConnection = async () => {
      if (typeof window.ethereum === 'undefined') return
      if (isManuallyDisconnected) return
      if (account) return
      
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0 && mounted) {
          const accountAddress = accounts[0]
          setAccount(accountAddress)
          accountRef.current = accountAddress
          
          const provider = new ethers.BrowserProvider(window.ethereum)
          setProvider(provider)
          providerRef.current = provider
          
          const signer = await provider.getSigner()
          setSigner(signer)
          
          // Update chain ID
          try {
            const chainId = await window.ethereum.request({ method: 'eth_chainId' })
            if (mounted) {
              setChainId(parseInt(chainId, 16))
            }
          } catch (err) {
            console.error('Error updating chain ID:', err)
          }
          
          // Update balance
          try {
            if (mounted && provider) {
              const balance = await provider.getBalance(accountAddress)
              if (mounted) {
                setBalance(ethers.formatEther(balance))
              }
            }
          } catch (err) {
            console.error('Error updating balance:', err)
          }
        }
      } catch (err) {
        console.error('Error checking connection:', err)
      }
    }
    
    initConnection()
    
    return () => {
      mounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run on mount - intentionally empty

  // Switch chain
  const switchChain = useCallback(async (chainId) => {
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
  }, [updateChainId])

  // Connect to MetaMask
  const connectMetaMask = useCallback(async () => {
    // Clear any existing connection first
    if (account) {
      // Disconnect existing connection
      setIsManuallyDisconnected(true)
      setAccount(null)
      setChainId(null)
      setBalance(null)
      setProvider(null)
      setSigner(null)
      setError(null)
      accountRef.current = null
      providerRef.current = null
      
      // Remove event listeners
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged')
        window.ethereum.removeAllListeners('chainChanged')
      }
      
      // Small delay to ensure cleanup
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    setIsConnecting(true)
    setError(null)
    setIsManuallyDisconnected(false) // Reset manual disconnect flag

    try {
      if (!checkMetaMask()) {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.')
      }

      // Request accounts - this will prompt unlock if MetaMask is locked
      let accounts
      try {
        accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        })
      } catch (requestError) {
        // Check for MetaMask locked error
        if (
          requestError.code === 4001 || // User rejected
          requestError.message?.toLowerCase().includes('locked') ||
          requestError.message?.toLowerCase().includes('please unlock') ||
          requestError.message?.toLowerCase().includes('unlock')
        ) {
          throw new Error('MetaMask is locked. Please unlock MetaMask and try again.')
        }
        // Re-throw other errors
        throw requestError
      }

      if (accounts.length === 0) {
        throw new Error('No accounts found. Please unlock MetaMask and try again.')
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
      // Handle MetaMask locked error specifically
      if (
        err.code === 4001 ||
        err.message?.toLowerCase().includes('locked') ||
        err.message?.toLowerCase().includes('please unlock')
      ) {
        setError('MetaMask is locked. Please unlock MetaMask and try again.')
        toast.error('MetaMask is locked. Please unlock MetaMask and try again.')
      } else {
        setError(err.message || 'Failed to connect to MetaMask')
        toast.error(err.message || 'Failed to connect to MetaMask')
      }
      console.error('Connection error:', err)
    } finally {
      setIsConnecting(false)
    }
  }, [checkMetaMask, account, updateChainId, updateBalance, switchChain])

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
