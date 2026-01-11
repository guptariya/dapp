# Transaction Preview & Decoding Feature

## Overview

Before sending any transaction, the DApp now decodes and displays all transaction details in a preview modal. This allows users to review exactly what the transaction will do before confirming.

## Features

### 🔍 Transaction Decoding

The DApp automatically decodes:
- **Recipient Address** - Where the transaction is going
- **Amount** - How much ETH is being sent
- **Gas Information** - Estimated gas limit and current gas prices
- **Transaction Cost** - Total estimated cost (amount + gas fees)
- **Contract Interactions** - If it's a contract call, shows function name and parameters
- **Network** - Which chain the transaction will execute on
- **Raw Data** - Full transaction data (expandable)

### 📋 Preview Modal

When you click "Preview Transaction", you'll see:

1. **Warning Banner** - Reminds you to review carefully
2. **Transaction Details** - All decoded information
3. **Gas Estimation** - Real-time gas limit and price estimates
4. **Total Cost** - Amount + gas fees
5. **Contract Info** - If calling a contract, shows function details
6. **Action Buttons** - Cancel or Confirm & Send

## How It Works

### User Flow

1. **Enter Transaction Details**
   - Fill in recipient address
   - Enter amount to send
   - Click "Preview Transaction"

2. **Transaction Decoding**
   - DApp builds the transaction object
   - Estimates gas requirements
   - Fetches current gas prices
   - Decodes contract calls (if applicable)
   - Shows preview modal

3. **Review & Confirm**
   - Review all transaction details
   - Check total cost
   - Click "Confirm & Send" to proceed
   - Or "Cancel" to go back

4. **Transaction Execution**
   - Transaction is sent to MetaMask
   - User approves in MetaMask
   - Transaction is broadcast
   - Status updates in real-time

## Security Benefits

✅ **Transparency** - See exactly what you're sending
✅ **Gas Awareness** - Know the total cost before confirming
✅ **Contract Safety** - See what function is being called
✅ **Error Prevention** - Catch mistakes before sending
✅ **No Surprises** - Full visibility into transaction details

## Technical Details

### Decoding Process

1. **Transaction Object Creation**
   ```javascript
   {
     to: recipientAddress,
     value: amountInWei,
     data: '0x' // or contract call data
   }
   ```

2. **Gas Estimation**
   - Uses `provider.estimateGas()` for accurate estimates
   - Includes sender address for proper estimation

3. **Fee Data Retrieval**
   - Gets current gas prices from network
   - Supports both legacy (gasPrice) and EIP-1559 (maxFeePerGas)

4. **Contract Call Decoding**
   - Attempts to decode standard ERC20 functions
   - Shows function name and parameters
   - Falls back to "Unknown Function" for custom calls

5. **Cost Calculation**
   - Calculates: `gasLimit × gasPrice`
   - Shows total: `amount + gasCost`

### Supported Contract Functions

Currently decodes:
- `transfer(address, uint256)`
- `approve(address, uint256)`
- `transferFrom(address, address, uint256)`

More functions can be added by extending the ABI in `transactionDecoder.js`.

## UI Components

### TransactionPreview Component

- **Modal overlay** - Prevents interaction with background
- **Glass card design** - Matches DApp theme
- **Responsive layout** - Works on all screen sizes
- **Loading states** - Shows when decoding/processing
- **Error handling** - Graceful error messages

### Information Display

- **Formatted addresses** - Short format with full address on hover
- **ETH formatting** - 6 decimal places for precision
- **Gas formatting** - Gwei units for readability
- **Expandable sections** - Raw data hidden by default

## Example Preview

```
┌─────────────────────────────────────┐
│ Transaction Preview          [X]    │
├─────────────────────────────────────┤
│ ⚠️ Review Transaction Details       │
│                                     │
│ To Address: 0x742d...5f0b           │
│ Amount: 0.100000 ETH                │
│                                     │
│ Gas Limit: 21,000                   │
│ Gas Price: 20.50 Gwei               │
│                                     │
│ Estimated Gas Cost: 0.000430 ETH    │
│ Total Amount: 0.100430 ETH          │
│                                     │
│ Network: Chain ID: 11155111         │
│                                     │
│ [Cancel]  [Confirm & Send]          │
└─────────────────────────────────────┘
```

## Future Enhancements

Potential improvements:
- [ ] Support for more contract functions
- [ ] ENS name resolution in preview
- [ ] Transaction simulation (dry run)
- [ ] Risk assessment indicators
- [ ] Historical gas price comparison
- [ ] Custom gas price override
- [ ] Batch transaction preview
- [ ] Transaction templates

## Testing

To test the feature:

1. Connect your wallet
2. Enter a recipient address
3. Enter an amount
4. Click "Preview Transaction"
5. Review all details
6. Confirm or cancel

Try with:
- Simple ETH transfer
- Contract interaction (if you have contract addresses)
- Different amounts
- Different networks

## Troubleshooting

### Gas Estimation Fails

- Check network connection
- Verify recipient address is valid
- Ensure you have sufficient balance
- Try again (network may be busy)

### Preview Not Showing

- Check browser console for errors
- Verify wallet is connected
- Ensure provider is available
- Refresh the page

### Contract Not Decoding

- Contract may use non-standard functions
- Raw data will still be shown
- Function name will show as "Unknown Function"
