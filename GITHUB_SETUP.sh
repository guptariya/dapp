#!/bin/bash

# GitHub Repository Setup Script
# This script helps you push your DApp to GitHub

echo "🚀 GitHub Deployment Setup"
echo "=========================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not initialized"
    exit 1
fi

# Get repository name
read -p "Enter your GitHub username: " GITHUB_USERNAME
read -p "Enter your repository name (default: web3-dapp): " REPO_NAME
REPO_NAME=${REPO_NAME:-web3-dapp}

echo ""
echo "📝 Repository will be: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo ""

# Update vite.config.js if repo name is different
if [ "$REPO_NAME" != "web3-dapp" ]; then
    echo "⚠️  Updating vite.config.js base path..."
    sed -i.bak "s|/web3-dapp/|/$REPO_NAME/|g" vite.config.js
    rm vite.config.js.bak 2>/dev/null
    echo "✅ Updated base path to /$REPO_NAME/"
fi

# Check if remote exists
if git remote get-url origin >/dev/null 2>&1; then
    echo "⚠️  Remote 'origin' already exists"
    read -p "Do you want to update it? (y/n): " UPDATE_REMOTE
    if [ "$UPDATE_REMOTE" = "y" ]; then
        git remote set-url origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
        echo "✅ Updated remote origin"
    fi
else
    git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
    echo "✅ Added remote origin"
fi

# Rename branch to main if needed
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    git branch -M main
    echo "✅ Renamed branch to main"
fi

echo ""
echo "📤 Ready to push! Run these commands:"
echo ""
echo "1. Create the repository on GitHub first:"
echo "   https://github.com/new"
echo "   Name: $REPO_NAME"
echo "   Visibility: Public (for free GitHub Pages)"
echo ""
echo "2. Then push your code:"
echo "   git push -u origin main"
echo ""
echo "3. Enable GitHub Pages:"
echo "   - Go to Settings → Pages"
echo "   - Source: GitHub Actions"
echo "   - Your site will be at: https://$GITHUB_USERNAME.github.io/$REPO_NAME/"
echo ""
