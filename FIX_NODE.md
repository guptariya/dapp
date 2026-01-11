# 🔧 Fix: Node.js Version Issue

## The Problem
You're getting this error:
```
TypeError: crypto$2.getRandomValues is not a function
```

This happens because Node.js v24 has compatibility issues with Vite.

## ✅ Solution: Use the Safe Dev Script

**DO NOT run `npm run dev` directly!**

Instead, always use:
```bash
cd /Users/sevenbits/Desktop/RiyaPersonal/dapp
./dev.sh
```

Or:
```bash
npm run dev:safe
```

## Why This Happens

When you run `npm run dev` directly, npm might use a different Node.js version (v24) than what's in your PATH. The `dev.sh` script ensures the correct Node.js v20 is used.

## Quick Fix for Current Terminal

If you're in the dapp directory, run:
```bash
unset npm_config_prefix
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use --delete-prefix 20
./dev.sh
```

## Verify Node Version

Before running the dev server, always check:
```bash
node --version
```

Should show: `v20.19.6` (or any v20.x)

If it shows v24.x, run:
```bash
unset npm_config_prefix
nvm use --delete-prefix 20
```

## Permanent Fix

Your `.zshrc` has been updated to:
- Auto-load nvm
- Auto-switch to Node v20 when entering the dapp directory (via `.nvmrc`)
- Unset `npm_config_prefix` to avoid conflicts

**Just open a new terminal and use `./dev.sh`**
