import { useState, useEffect } from 'react'
import WalletButton from './components/WalletButton'
import TransactionPanel from './components/TransactionPanel'
import ContractInteraction from './components/ContractInteraction'
import NetworkSwitcher from './components/NetworkSwitcher'
import TransactionHistory from './components/TransactionHistory'
import ToastContainer from './components/ToastContainer'
import DEX from './components/DEX'
import PortfolioTracker from './components/PortfolioTracker'
import GasTracker from './components/GasTracker'
import TokenApprovals from './components/TokenApprovals'
import TransactionAnalytics from './components/TransactionAnalytics'
import { useWallet } from './hooks/useWallet'
import { 
  Zap, Shield, Globe, Code, ArrowRight, CheckCircle, 
  TrendingUp, Lock, Sparkles, Rocket, Users, Layers,
  Home, ArrowLeftRight, Wallet, Gauge, ShieldCheck, BarChart3
} from 'lucide-react'

function App() {
  const { isConnected, account } = useWallet()
  const [activeTab, setActiveTab] = useState('home')

  // Reset to home tab and scroll to top when disconnected
  useEffect(() => {
    if (!isConnected && !account) {
      setActiveTab('home')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [isConnected, account])

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float-reverse"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl animate-float"></div>
      </div>

      {/* Header */}
      <header className="border-b border-cyan-500/20 bg-[#0f0f1a]/80 backdrop-blur-xl sticky top-0 z-50 shadow-lg shadow-cyan-500/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-lg"></div>
                <Zap className="w-8 h-8 text-cyan-400 relative z-10 animate-pulse-glow" />
              </div>
              <h1 className="text-2xl font-bold gradient-text tracking-tight">Web3 DApp</h1>
            </div>
            <div className="flex items-center gap-3">
              <NetworkSwitcher />
              <TransactionHistory />
              <WalletButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!isConnected ? (
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16 animate-fade-in-up">
              <div className="inline-block mb-6 animate-float">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-pink-500 to-purple-500 rounded-full blur-2xl opacity-50 animate-pulse-glow"></div>
                  <Zap className="w-20 h-20 text-amber-400 relative z-10 mx-auto" />
                </div>
              </div>
              <h1 className="text-6xl md:text-7xl font-bold mb-6 gradient-text animate-gradient bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                Welcome to Web3
              </h1>
              <p className="text-2xl md:text-3xl text-cyan-200 mb-4 font-light drop-shadow-[0_0_10px_rgba(0,245,255,0.3)]">
                Your Gateway to Decentralized Applications
              </p>
              <p className="text-lg text-gray-300 mb-4 max-w-2xl mx-auto leading-relaxed">
                Connect your wallet to unlock the full power of blockchain. Send transactions, interact with smart contracts, and experience the future of finance.
              </p>
              <p className="text-sm text-gray-400 mb-8">
                Created by <span className="text-cyan-400 font-medium neon-glow px-2 py-1 rounded">Riya Gupta</span>
              </p>
              
              {/* CTA Button */}
              <div className="flex justify-center mb-12">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-pink-500 to-yellow-500 rounded-lg blur-xl opacity-30 group-hover:opacity-50 transition duration-1000 animate-pulse-glow"></div>
                  <div className="relative">
                    <WalletButton />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 animate-fade-in-up animate-delay-200">
              <div className="glass-card rounded-xl p-6 text-center border-cyan-500/20 hover:border-cyan-500/40 transition-all">
                <div className="text-3xl font-bold gradient-text mb-2">5+</div>
                <div className="text-sm text-gray-400">Supported Chains</div>
              </div>
              <div className="glass-card rounded-xl p-6 text-center border-pink-500/20 hover:border-pink-500/40 transition-all">
                <div className="text-3xl font-bold gradient-text mb-2">100%</div>
                <div className="text-sm text-gray-400">Secure</div>
              </div>
              <div className="glass-card rounded-xl p-6 text-center border-purple-500/20 hover:border-purple-500/40 transition-all">
                <div className="text-3xl font-bold gradient-text mb-2">0</div>
                <div className="text-sm text-gray-400">Custody</div>
              </div>
              <div className="glass-card rounded-xl p-6 text-center border-cyan-500/20 hover:border-cyan-500/40 transition-all">
                <div className="text-3xl font-bold gradient-text mb-2">∞</div>
                <div className="text-sm text-gray-400">Possibilities</div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              <div className="glass-card rounded-xl p-8 hover:scale-105 transition-all duration-300 group animate-fade-in-up animate-delay-100">
                <div className="w-14 h-14 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-500/30 transition-colors">
                  <Shield className="w-7 h-7 text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Bank-Level Security</h3>
                <p className="text-gray-400 leading-relaxed">
                  Your keys, your crypto. Full control over your assets with industry-leading security practices.
                </p>
              </div>

              <div className="glass-card rounded-xl p-8 hover:scale-105 transition-all duration-300 group animate-fade-in-up animate-delay-200">
                <div className="w-14 h-14 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-pink-500/30 transition-colors">
                  <Globe className="w-7 h-7 text-pink-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Multi-Chain Support</h3>
                <p className="text-gray-400 leading-relaxed">
                  Seamlessly interact across Ethereum, Polygon, Base, and more networks from one interface.
                </p>
              </div>

              <div className="glass-card rounded-xl p-8 hover:scale-105 transition-all duration-300 group animate-fade-in-up animate-delay-300">
                <div className="w-14 h-14 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition-colors">
                  <Zap className="w-7 h-7 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
                <p className="text-gray-400 leading-relaxed">
                  Optimized for speed with real-time transaction preview and instant confirmations.
                </p>
              </div>

              <div className="glass-card rounded-xl p-8 hover:scale-105 transition-all duration-300 group animate-fade-in-up animate-delay-100">
                <div className="w-14 h-14 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-500/30 transition-colors">
                  <Code className="w-7 h-7 text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Open Source</h3>
                <p className="text-gray-400 leading-relaxed">
                  Built with transparency and community in mind. Audit the code, contribute, and trust.
                </p>
              </div>

              <div className="glass-card rounded-xl p-8 hover:scale-105 transition-all duration-300 group animate-fade-in-up animate-delay-200">
                <div className="w-14 h-14 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500/30 transition-colors">
                  <TrendingUp className="w-7 h-7 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Transaction Preview</h3>
                <p className="text-gray-400 leading-relaxed">
                  Review every transaction before sending. See gas costs, decode contract calls, and stay safe.
                </p>
              </div>

              <div className="glass-card rounded-xl p-8 hover:scale-105 transition-all duration-300 group animate-fade-in-up animate-delay-300">
                <div className="w-14 h-14 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-500/30 transition-colors">
                  <Layers className="w-7 h-7 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Smart Contracts</h3>
                <p className="text-gray-400 leading-relaxed">
                  Interact with any ERC20 token or smart contract. Read and write functions with ease.
                </p>
              </div>
            </div>

            {/* Getting Started Section */}
            <div className="glass-card rounded-2xl p-10 mb-12 animate-fade-in-up animate-delay-400">
              <div className="flex items-center gap-3 mb-6">
                <Rocket className="w-8 h-8 text-cyan-400" />
                <h3 className="text-3xl font-bold">Get Started in Minutes</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-black/20 rounded-lg hover:bg-black/30 transition-colors">
                    <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-cyan-400 font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Install MetaMask</h4>
                      <p className="text-sm text-gray-400">Get the MetaMask browser extension from metamask.io</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-black/20 rounded-lg hover:bg-black/30 transition-colors">
                    <div className="w-8 h-8 bg-pink-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-pink-400 font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Create Wallet</h4>
                      <p className="text-sm text-gray-400">Set up a new wallet or import an existing one</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-black/20 rounded-lg hover:bg-black/30 transition-colors">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-purple-400 font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Connect & Explore</h4>
                      <p className="text-sm text-gray-400">Click "Connect Wallet" and start using the DApp</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-cyan-500/10 to-pink-500/10 rounded-lg border border-cyan-500/20">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-sm">No registration required</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-cyan-500/10 to-pink-500/10 rounded-lg border border-cyan-500/20">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-sm">No personal data collected</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-cyan-500/10 to-pink-500/10 rounded-lg border border-cyan-500/20">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-sm">100% decentralized</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-cyan-500/10 to-pink-500/10 rounded-lg border border-cyan-500/20">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-sm">Open source & auditable</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="text-center animate-fade-in-up animate-delay-400">
              <p className="text-gray-400 mb-4">Trusted by developers and users worldwide</p>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-500">Non-Custodial</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-500">Production Ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-500">Community Driven</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {/* Navigation Tabs */}
            <div className="flex gap-2 mb-6 border-b border-cyan-500/20 overflow-x-auto">
              <button
                onClick={() => setActiveTab('home')}
                className={`px-4 py-3 font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'home'
                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                    : 'text-gray-400 hover:text-cyan-300'
                }`}
              >
                <Home className="w-5 h-5" />
                Home
              </button>
              <button
                onClick={() => setActiveTab('dex')}
                className={`px-4 py-3 font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'dex'
                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                    : 'text-gray-400 hover:text-cyan-300'
                }`}
              >
                <ArrowLeftRight className="w-5 h-5" />
                DEX
              </button>
              <button
                onClick={() => setActiveTab('portfolio')}
                className={`px-4 py-3 font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'portfolio'
                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                    : 'text-gray-400 hover:text-cyan-300'
                }`}
              >
                <Wallet className="w-5 h-5" />
                Portfolio
              </button>
              <button
                onClick={() => setActiveTab('gas')}
                className={`px-4 py-3 font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'gas'
                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                    : 'text-gray-400 hover:text-cyan-300'
                }`}
              >
                <Gauge className="w-5 h-5" />
                Gas Tracker
              </button>
              <button
                onClick={() => setActiveTab('approvals')}
                className={`px-4 py-3 font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'approvals'
                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                    : 'text-gray-400 hover:text-cyan-300'
                }`}
              >
                <ShieldCheck className="w-5 h-5" />
                Approvals
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-3 font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'analytics'
                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                    : 'text-gray-400 hover:text-cyan-300'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                Analytics
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'home' ? (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold mb-2 gradient-text">
                    Welcome to Web3 DApp
                  </h2>
                  <p className="text-gray-300">
                    Send transactions, sign messages, and interact with the blockchain
                  </p>
                </div>

                <div className="space-y-6">
                  <TransactionPanel />
                  <ContractInteraction />
                </div>
              </>
            ) : activeTab === 'dex' ? (
              <DEX />
            ) : activeTab === 'portfolio' ? (
              <PortfolioTracker />
            ) : activeTab === 'gas' ? (
              <GasTracker />
            ) : activeTab === 'approvals' ? (
              <TokenApprovals />
            ) : activeTab === 'analytics' ? (
              <TransactionAnalytics />
            ) : (
              <DEX />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-cyan-500/20 mt-12 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p className="mb-2">
            Created by <span className="text-cyan-400 font-semibold">Riya Gupta</span>
          </p>
          <p>Built with React, Vite, Ethers.js, and Tailwind CSS</p>
          <p className="mt-2">
            Supports MetaMask, WalletConnect, and other Web3 wallets
          </p>
        </div>
      </footer>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  )
}

export default App
