// Transaction history management with localStorage

const STORAGE_KEY = 'dapp_transaction_history'
const MAX_HISTORY = 100

export const transactionHistory = {
  getAll() {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error reading transaction history:', error)
      return []
    }
  },

  add(transaction) {
    try {
      const history = this.getAll()
      const newTransaction = {
        ...transaction,
        id: transaction.hash || Date.now().toString(),
        timestamp: Date.now(),
      }
      
      // Add to beginning of array
      history.unshift(newTransaction)
      
      // Keep only last MAX_HISTORY transactions
      const trimmed = history.slice(0, MAX_HISTORY)
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
      return newTransaction
    } catch (error) {
      console.error('Error saving transaction:', error)
      return null
    }
  },

  update(hash, updates) {
    try {
      const history = this.getAll()
      const index = history.findIndex(tx => tx.hash === hash)
      
      if (index !== -1) {
        history[index] = { ...history[index], ...updates }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
        return history[index]
      }
      
      return null
    } catch (error) {
      console.error('Error updating transaction:', error)
      return null
    }
  },

  getByHash(hash) {
    const history = this.getAll()
    return history.find(tx => tx.hash === hash)
  },

  getByAccount(account) {
    const history = this.getAll()
    return history.filter(tx => 
      tx.from?.toLowerCase() === account?.toLowerCase() ||
      tx.to?.toLowerCase() === account?.toLowerCase()
    )
  },

  clear() {
    try {
      localStorage.removeItem(STORAGE_KEY)
      return true
    } catch (error) {
      console.error('Error clearing transaction history:', error)
      return false
    }
  },

  export() {
    return this.getAll()
  },
}
