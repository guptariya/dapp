# Quick Start Guide

Get your DApp up and running in 5 minutes!

## Step 1: Install Dependencies

```bash
cd dapp
npm install
```

## Step 2: Start Development Server

```bash
npm run dev
```

The app will open automatically at `http://localhost:3000`

## Step 3: Install MetaMask

If you don't have MetaMask installed:

1. Go to [metamask.io](https://metamask.io/download/)
2. Install the browser extension
3. Create a new wallet or import an existing one
4. **Important**: Switch to Sepolia testnet (or your preferred testnet)

## Step 4: Get Testnet ETH

For testing on Sepolia:

1. Go to [Sepolia Faucet](https://sepoliafaucet.com/) or [Alchemy Faucet](https://sepoliafaucet.com/)
2. Request testnet ETH to your wallet address
3. Wait for the transaction to confirm

## Step 5: Connect Your Wallet

1. Click "Connect Wallet" in the DApp
2. Approve the connection in MetaMask
3. Start using the DApp!

## Testing Features

### Send Transaction
- Enter a recipient address (use another testnet address)
- Enter amount (e.g., 0.001 ETH)
- Click "Send Transaction"
- Approve in MetaMask

### Sign Message
- Enter any message
- Click "Sign Message"
- Approve in MetaMask
- View your signature

### Contract Interaction
- Enter a contract address (try an ERC20 token on Sepolia)
- Enter function name (e.g., `balanceOf`)
- Enter parameters (e.g., your wallet address)
- Click "Read Contract"

## Common ERC20 Token Addresses (Sepolia)

- USDC: `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238`
- DAI: `0x3e622317f8C93f7328350cF0B56b9C3bA4b1a6c6`

## Troubleshooting

**MetaMask not detected?**
- Refresh the page after installing MetaMask
- Make sure MetaMask is unlocked

**Transaction fails?**
- Check you have enough ETH for gas
- Verify you're on the correct network
- Check MetaMask for error details

**Network not supported?**
- The DApp defaults to Sepolia testnet
- You can manually switch networks in MetaMask
- Or update `src/config/walletConfig.js` to add your network

## Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Customize the UI in `src/App.jsx`
- Add your own smart contracts in `src/utils/contracts.js`
- Extend wallet support (WalletConnect, Coinbase Wallet)

Happy building! 🚀
