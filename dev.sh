#!/bin/bash

# Unset npm_config_prefix to avoid conflicts with nvm
unset npm_config_prefix

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use Node version from .nvmrc
if [ -f .nvmrc ]; then
  nvm use --delete-prefix
fi

# Get the exact Node path from nvm
NVM_NODE_PATH=$(nvm which current)
NVM_NODE_DIR=$(dirname "$NVM_NODE_PATH")

# Verify we're using the right Node
CURRENT_VERSION=$($NVM_NODE_PATH --version | cut -d'v' -f2 | cut -d'.' -f1)
CURRENT_NODE=$(which node)

if [ "$CURRENT_VERSION" -ge 24 ]; then
  echo "❌ Error: Using Node.js $($NVM_NODE_PATH --version) from $CURRENT_NODE"
  echo "Expected Node.js v20 from nvm"
  echo "Please run: unset npm_config_prefix && nvm use --delete-prefix 20"
  exit 1
fi

echo "✅ Using Node.js $($NVM_NODE_PATH --version) from $NVM_NODE_PATH"

# Ensure nvm's node is in PATH first
export PATH="$NVM_NODE_DIR:$PATH"

# Run vite directly using the correct Node
exec "$NVM_NODE_PATH" "$NVM_NODE_DIR/../lib/node_modules/npm/bin/npm-cli.js" run dev --scripts-prepend-node-path=true
