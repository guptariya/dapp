# Changelog

## [1.1.0] - 2024-01-10

### ✨ Added

#### User Experience
- **Toast Notification System** - Beautiful, animated toast notifications for user feedback
  - Success, error, warning, and info toast types
  - Auto-dismiss with customizable duration
  - Slide-in animations

- **Transaction History** - Local storage-based transaction tracking
  - View all past transactions
  - Transaction details (hash, recipient, amount, timestamp)
  - Quick copy and explorer links
  - Clear history functionality
  - Transaction status tracking (pending, confirmed, failed)

- **Network Switcher** - Easy network switching UI
  - Visual network selector dropdown
  - Support for all configured networks
  - Current network indicator
  - One-click network switching

#### Developer Experience
- **Improvement Documentation** - Comprehensive improvement plan (`IMPROVEMENTS.md`)
- **Better Error Handling** - Toast notifications for errors
- **Transaction Tracking** - Automatic transaction history saving

### 🔧 Improved

- **Transaction Panel** - Now shows toast notifications and saves to history
- **Header** - Added Network Switcher and Transaction History buttons
- **Error Messages** - Better user feedback with toast notifications
- **CSS Animations** - Added slide-in animation for toasts

### 📝 Documentation

- Created `IMPROVEMENTS.md` with comprehensive improvement roadmap
- Created `FIX_NODE.md` for Node.js version troubleshooting
- Created `CHANGELOG.md` for tracking changes

## [1.0.0] - 2024-01-10

### ✨ Initial Release

- MetaMask wallet integration
- Send ETH transactions
- Sign messages
- Smart contract interactions (ERC20)
- Multi-chain support (Ethereum, Polygon, Base, Sepolia)
- Modern, responsive UI with Tailwind CSS
- Network switching capability
