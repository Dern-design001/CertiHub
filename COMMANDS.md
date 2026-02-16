# 🎯 Quick Command Reference

## Git Commands

### First Time Setup
```bash
# Initialize git repository
git init

# Add all files to staging
git add .

# Create first commit
git commit -m "Initial commit"

# Connect to GitHub (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/certihub.git

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

### Regular Updates
```bash
# Check status
git status

# Add all changes
git add .

# Commit with message
git commit -m "Update: your message here"

# Push to GitHub (triggers auto-deploy on Vercel)
git push
```

### Useful Git Commands
```bash
# See commit history
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard all local changes
git reset --hard

# Create new branch
git checkout -b feature-name

# Switch branch
git checkout main

# See all branches
git branch -a
```

## NPM Commands

### Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open at: http://localhost:5173
```

### Build & Preview
```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Open at: http://localhost:4173
```

### Maintenance
```bash
# Update all packages
npm update

# Check for outdated packages
npm outdated

# Install specific package
npm install package-name

# Remove package
npm uninstall package-name
```

## Vercel CLI (Optional)

### Install Vercel CLI
```bash
npm install -g vercel
```

### Deploy from Terminal
```bash
# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs
```

## Firebase Commands (Optional)

### Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Firebase Commands
```bash
# Login to Firebase
firebase login

# Initialize project
firebase init

# Deploy hosting
firebase deploy

# View logs
firebase functions:log
```

## Useful Terminal Commands

### Windows (CMD/PowerShell)
```bash
# List files
dir

# Change directory
cd folder-name

# Go back one directory
cd ..

# Clear screen
cls

# Create folder
mkdir folder-name

# Delete folder
rmdir folder-name

# Open current folder in VS Code
code .
```

### Mac/Linux (Bash)
```bash
# List files
ls -la

# Change directory
cd folder-name

# Go back one directory
cd ..

# Clear screen
clear

# Create folder
mkdir folder-name

# Delete folder
rm -rf folder-name

# Open current folder in VS Code
code .
```

## Quick Deployment Workflow

```bash
# 1. Make changes to your code

# 2. Test locally
npm run dev

# 3. Build to check for errors
npm run build

# 4. Commit and push
git add .
git commit -m "Update: describe changes"
git push

# 5. Vercel auto-deploys!
# Check: https://vercel.com/dashboard
```

## Emergency Commands

### Reset Everything
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install

# Clear npm cache
npm cache clean --force

# Reset git to last commit
git reset --hard HEAD
```

### Fix Common Issues
```bash
# Port already in use
# Kill process on port 5173 (Windows)
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Port already in use (Mac/Linux)
lsof -ti:5173 | xargs kill -9

# Permission denied
# Run as administrator (Windows)
# Or use sudo (Mac/Linux)
sudo npm install
```

## Environment Variables

### Create .env file
```bash
# Copy example file
cp .env.example .env

# Edit with your values
# Windows: notepad .env
# Mac: nano .env
```

### Check Environment Variables (Vercel)
```bash
# Using Vercel CLI
vercel env ls

# Add environment variable
vercel env add VARIABLE_NAME

# Remove environment variable
vercel env rm VARIABLE_NAME
```

## Helpful Aliases (Optional)

Add to your `.bashrc` or `.zshrc`:

```bash
# Git shortcuts
alias gs='git status'
alias ga='git add .'
alias gc='git commit -m'
alias gp='git push'
alias gl='git log --oneline'

# NPM shortcuts
alias ni='npm install'
alias nd='npm run dev'
alias nb='npm run build'
alias np='npm run preview'

# Quick deploy
alias deploy='git add . && git commit -m "Update" && git push'
```

## Cheat Sheet

| Task | Command |
|------|---------|
| Start dev server | `npm run dev` |
| Build for production | `npm run build` |
| Preview build | `npm run preview` |
| Add all changes | `git add .` |
| Commit changes | `git commit -m "message"` |
| Push to GitHub | `git push` |
| Check git status | `git status` |
| View commit history | `git log --oneline` |
| Install dependencies | `npm install` |
| Update packages | `npm update` |

## Pro Tips

1. **Always test locally before pushing**
   ```bash
   npm run build && npm run preview
   ```

2. **Write meaningful commit messages**
   ```bash
   git commit -m "Add: new feature"
   git commit -m "Fix: bug in profile section"
   git commit -m "Update: improve styling"
   ```

3. **Check what you're committing**
   ```bash
   git status
   git diff
   ```

4. **Create branches for big features**
   ```bash
   git checkout -b new-feature
   # Make changes
   git push -u origin new-feature
   ```

5. **Keep dependencies updated**
   ```bash
   npm outdated
   npm update
   ```

---

**💡 Tip**: Bookmark this file for quick reference!
