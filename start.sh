#!/bin/bash

# Unset npm_config_prefix to avoid conflicts with nvm
unset npm_config_prefix

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use Node version from .nvmrc
if [ -f .nvmrc ]; then
  nvm use
fi

# Ensure nvm's node is in PATH first (remove system node paths)
export PATH=$(echo "$PATH" | tr ':' '\n' | grep -v "^/usr/local/bin$" | grep -v "^/usr/local/bin:" | tr '\n' ':' | sed 's/:$//')
export PATH="$NVM_DIR/versions/node/$(nvm version)/bin:$PATH"

# Verify Node version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -ge 24 ]; then
  echo "❌ Error: Still using Node.js v$(node --version)"
  echo "Please run: unset npm_config_prefix && nvm use 20"
  exit 1
fi

echo "✅ Using Node.js $(node --version)"

# Start dev server
npm run dev
