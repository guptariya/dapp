# Node.js Version Fix

## The Problem
If you're getting this error:
```
TypeError: crypto$2.getRandomValues is not a function
```

It means you're using Node.js v24, which has compatibility issues with Vite.

## Quick Fix

**Option 1: Use the safe start script (Recommended)**
```bash
cd dapp
./start.sh
```

**Option 2: Manually switch to Node.js v20**
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20
cd dapp
npm run dev
```

**Option 3: Reload your shell**
```bash
source ~/.zshrc
cd dapp
npm run dev
```

## Automatic Fix (Already Done)
Your `.zshrc` has been updated to automatically use Node.js v20 when you `cd` into the `dapp` directory (via `.nvmrc` file).

Just open a **new terminal** and run:
```bash
cd dapp
npm run dev
```

## Verify Node Version
```bash
node --version
```
Should show: `v20.19.6` (or similar v20.x)

If it shows v24.x, run:
```bash
nvm use 20
```
