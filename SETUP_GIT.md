# Git Configuration Guide

## Current Configuration

To check your current git configuration:
```bash
git config user.name
git config user.email
```

## Configure Git for This Repository

### Set Email and Name (Repository Level)
```bash
cd /Users/sevenbits/Desktop/RiyaPersonal/dapp

# Set your name
git config user.name "Riya Gupta"

# Set your email (replace with your actual email)
git config user.email "your-email@example.com"
```

### Set Email and Name (Global - All Repositories)
```bash
# Set globally for all repositories
git config --global user.name "Riya Gupta"
git config --global user.email "your-email@example.com"
```

## Common Email Options

### GitHub Email
If you want to use your GitHub email:
1. Go to GitHub → Settings → Emails
2. Copy your GitHub-provided email (e.g., `username@users.noreply.github.com`)
3. Or use your verified email address

### Example Commands
```bash
# For GitHub no-reply email
git config user.email "YOUR_USERNAME@users.noreply.github.com"

# For your personal email
git config user.email "riya.gupta@example.com"
```

## Verify Configuration

After setting, verify:
```bash
git config user.name
git config user.email
```

## Update Existing Commits

If you need to update the author of existing commits:
```bash
# Update last commit
git commit --amend --author="Riya Gupta <your-email@example.com>" --no-edit

# Update all commits (use with caution)
git filter-branch --env-filter '
OLD_EMAIL="old-email@example.com"
CORRECT_NAME="Riya Gupta"
CORRECT_EMAIL="new-email@example.com"

if [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_COMMITTER_NAME="$CORRECT_NAME"
    export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
fi
if [ "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_AUTHOR_NAME="$CORRECT_NAME"
    export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
fi
' --tag-name-filter cat -- --branches --tags
```

## Quick Setup

Run these commands to set up for this repository:

```bash
cd /Users/sevenbits/Desktop/RiyaPersonal/dapp
git config user.name "Riya Gupta"
git config user.email "YOUR_EMAIL_HERE"
```

Replace `YOUR_EMAIL_HERE` with your actual email address.
