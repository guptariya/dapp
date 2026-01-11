# GitHub Deployment Guide

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right → "New repository"
3. Repository name: `web3-dapp` (or your preferred name)
4. Description: "Modern Web3 DApp with MetaMask integration"
5. Set to **Public** (required for free GitHub Pages)
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

## Step 2: Push Code to GitHub

Run these commands in your terminal:

```bash
cd /Users/sevenbits/Desktop/RiyaPersonal/dapp

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Web3 DApp with MetaMask integration"

# Add your GitHub repository as remote
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/web3-dapp.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section (left sidebar)
4. Under **Source**, select:
   - **Deploy from a branch**
   - Branch: `main` or `master`
   - Folder: `/ (root)`
5. Click **Save**

**OR** use GitHub Actions (recommended):

1. Go to **Actions** tab in your repository
2. The workflow will run automatically on push
3. After first deployment, go to **Settings** → **Pages**
4. Under **Source**, select **GitHub Actions**
5. Your site will be available at: `https://YOUR_USERNAME.github.io/web3-dapp/`

## Step 4: Update Base Path (Important!)

If your repository name is NOT `web3-dapp`, update `vite.config.js`:

```javascript
base: process.env.NODE_ENV === 'production' ? '/YOUR_REPO_NAME/' : '/',
```

## Step 5: Verify Deployment

1. Wait a few minutes for GitHub Actions to complete
2. Go to **Actions** tab to see deployment status
3. Once deployed, visit: `https://YOUR_USERNAME.github.io/web3-dapp/`

## Troubleshooting

### Build Fails
- Check GitHub Actions logs
- Ensure Node.js version is 20 (configured in workflow)
- Verify all dependencies are in package.json

### 404 Errors
- Check base path in vite.config.js matches repository name
- Ensure GitHub Pages source is set correctly
- Clear browser cache

### Assets Not Loading
- Verify base path is correct
- Check browser console for errors
- Ensure all files are committed

## Custom Domain (Optional)

1. Add a `CNAME` file in `public/` folder with your domain
2. Configure DNS settings with your domain provider
3. Update GitHub Pages settings with custom domain

## Updating the Site

Simply push changes to main branch:

```bash
git add .
git commit -m "Your update message"
git push origin main
```

GitHub Actions will automatically rebuild and deploy!
