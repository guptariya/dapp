#!/bin/bash

# Script to add GitHub remote repository

echo "🔗 Add GitHub Remote Repository"
echo "================================"
echo ""

read -p "Enter your GitHub username: " GITHUB_USERNAME
read -p "Enter repository name (default: web3-dapp): " REPO_NAME
REPO_NAME=${REPO_NAME:-web3-dapp}

echo ""
echo "📝 Adding remote: https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
echo ""

# Remove existing remote if any
git remote remove origin 2>/dev/null

# Add new remote
git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

echo "✅ Remote added successfully!"
echo ""
echo "Verify with: git remote -v"
echo ""
echo "Next steps:"
echo "1. Create the repository on GitHub: https://github.com/new"
echo "   Name: $REPO_NAME"
echo "   Visibility: Public (for GitHub Pages)"
echo ""
echo "2. Push your code:"
echo "   git push -u origin main"
echo ""
