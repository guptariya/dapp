# Web3 DApp - Multi-Wallet Integration

A modern, production-ready decentralized application (DApp) with support for MetaMask and other Web3 wallets. Built with React, Vite, Ethers.js, and Tailwind CSS.

## 🚀 Live Demo

**🌐 Live Application:** [https://guptariya.github.io/dapp/](https://guptariya.github.io/dapp/)

> **Note:** Make sure you have MetaMask installed to interact with the DApp. The app works best on testnets like Sepolia for testing purposes.

## Features

- 🔐 **Multi-Wallet Support**: Connect with MetaMask, WalletConnect, and other Web3 wallets
- 💰 **Transaction Management**: Send ETH transactions and sign messages
- 🔄 **DEX Integration**: Token swapping with Uniswap V3 integration
- 📊 **Portfolio Tracker**: View all ERC-20 token balances and native tokens
- ⛽ **Gas Price Tracker**: Real-time gas price monitoring with EIP-1559 support
- 🛡️ **Token Approvals Manager**: Check and revoke ERC-20 token approvals
- 🌐 **Multi-Chain Support**: Works with Ethereum, Polygon, Base, and other EVM-compatible chains
- 📝 **Smart Contract Interaction**: Read and write to any ERC-20 contract
- 🎨 **Modern UI**: Beautiful, responsive interface with Tailwind CSS
- ⚡ **Fast Development**: Built with Vite for lightning-fast hot module replacement
- 🔒 **Secure**: Follows Web3 security best practices

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- MetaMask browser extension (or another Web3 wallet)
- A Web3 wallet with testnet ETH (for testing on Sepolia)

## Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd dapp
   ```

2. **Install dependencies: `npm install`**

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   The app will automatically open at `http://localhost:3000`

## Configuration

### WalletConnect Setup (Optional)

To enable WalletConnect support:

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com)
2. Create a new project and get your Project ID
3. Update `src/config/walletConfig.js`:
   ```javascript
   export const WALLETCONNECT_PROJECT_ID = 'your-project-id-here'
   ```

### Network Configuration

Edit `src/config/walletConfig.js` to add or modify supported networks:

```javascript
export const SUPPORTED_CHAINS = {
  // Add your custom networks here
}
```

## Usage

### Connecting Your Wallet

1. Click the "Connect Wallet" button
2. Approve the connection request in MetaMask
3. Select the network you want to use (default: Sepolia testnet)
4. Start interacting with the DApp!

### Sending Transactions

1. Ensure your wallet is connected
2. Enter the recipient address
3. Enter the amount in ETH
4. Click "Send Transaction"
5. Approve the transaction in MetaMask
6. Wait for confirmation

### Signing Messages

1. Enter a message in the "Sign Message" section
2. Click "Sign Message"
3. Approve the signature request in MetaMask
4. View your signature

## Project Structure

```
dapp/
├── src/
│   ├── components/          # React components
│   │   ├── WalletButton.jsx
│   │   └── TransactionPanel.jsx
│   ├── hooks/              # Custom React hooks
│   │   └── useWallet.js
│   ├── config/             # Configuration files
│   │   └── walletConfig.js
│   ├── utils/              # Utility functions
│   │   └── contracts.js
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Smart Contract Integration

The DApp includes utilities for interacting with smart contracts. See `src/utils/contracts.js` for helper functions:

```javascript
import { getContract, readContract, writeContract } from './utils/contracts'
import { ERC20_ABI } from './utils/contracts'

// Get contract instance
const contract = getContract(CONTRACT_ADDRESS, ERC20_ABI, signer)

// Read from contract
const balance = await readContract(contract, 'balanceOf', [userAddress])

// Write to contract
const tx = await writeContract(contract, 'transfer', [recipient, amount])
```

## Supported Networks

- Ethereum Mainnet
- Sepolia Testnet
- Polygon Mainnet
- Base Mainnet
- Base Sepolia

## Development

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Security Considerations

- Always verify contract addresses before interacting
- Never share your private keys or seed phrases
- Use testnets for development and testing
- Review transaction details carefully before signing
- Be cautious of phishing attempts

## Troubleshooting

### MetaMask Not Detected

- Ensure MetaMask extension is installed and enabled
- Refresh the page after installing MetaMask
- Check that MetaMask is unlocked

### Transaction Fails

- Ensure you have sufficient ETH for gas fees
- Check that you're on the correct network
- Verify the recipient address is valid
- Check MetaMask for error messages

### Network Not Supported

- Add the network manually in MetaMask
- Or update `walletConfig.js` to include your network

## Technologies Used

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Ethers.js 6** - Ethereum library
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Deployment

### GitHub Pages

This DApp is configured for automatic deployment to GitHub Pages using GitHub Actions.

1. **Create a GitHub repository**
   - Go to [GitHub](https://github.com/new)
   - Create a new public repository
   - Name it `web3-dapp` (or update `vite.config.js` base path if different)

2. **Push your code**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/web3-dapp.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to repository **Settings** → **Pages**
   - Source: **GitHub Actions**
   - Your site will be live at: `https://YOUR_USERNAME.github.io/web3-dapp/`

See [DEPLOY.md](./DEPLOY.md) for detailed deployment instructions.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ by **Riya Gupta** for the Web3 community
