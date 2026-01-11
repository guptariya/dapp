# Update GitHub Remote Repository

## Current Remote
Your repository is currently connected to: `guptariya/dapp.git`

## Update Remote URL

### Option 1: Update to Your GitHub Account

Replace `YOUR_USERNAME` with your actual GitHub username:

```bash
cd /Users/sevenbits/Desktop/RiyaPersonal/dapp

# Remove current remote
git remote remove origin

# Add your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/dapp.git

# Or if you want a different repository name
git remote add origin https://github.com/YOUR_USERNAME/web3-dapp.git
```

### Option 2: Keep guptariya Account

If `guptariya` is your GitHub account, you can keep it:

```bash
# Verify it's correct
git remote -v

# If correct, no changes needed
```

### Option 3: Update Existing Remote

If you want to change the remote URL without removing it:

```bash
git remote set-url origin https://github.com/YOUR_USERNAME/REPO_NAME.git
```

## Verify Remote

After updating, verify:

```bash
git remote -v
```

## Authentication

If you need to authenticate with GitHub:

1. **Personal Access Token** (recommended):
   - Go to GitHub → Settings → Developer settings → Personal access tokens
   - Generate a new token with `repo` permissions
   - Use it when pushing:
     ```bash
     git push -u origin main
     # Username: YOUR_USERNAME
     # Password: YOUR_TOKEN
     ```

2. **SSH** (alternative):
   - Set up SSH keys on GitHub
   - Change remote to SSH:
     ```bash
     git remote set-url origin git@github.com:YOUR_USERNAME/REPO_NAME.git
     ```

## Next Steps

After updating the remote:

1. Create the repository on GitHub (if it doesn't exist)
2. Push your code:
   ```bash
   git push -u origin main
   ```
