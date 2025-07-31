# 🔧 GitHub CLI & AI Code Analysis Setup

## 📦 **GitHub CLI Installation**

### **Option 1: Homebrew (Recommended for macOS)**
```bash
# Install Homebrew first if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install GitHub CLI
brew install gh
```

### **Option 2: Direct Download**
1. Go to: https://github.com/cli/cli/releases
2. Download the latest macOS release
3. Install the `.pkg` file

### **Option 3: Manual Install**
```bash
# Download and install
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh
```

## 🔐 **GitHub CLI Authentication**

After installation:
```bash
# Authenticate with GitHub
gh auth login

# Follow the prompts:
# 1. Choose "GitHub.com"
# 2. Choose "HTTPS" 
# 3. Choose "Yes" to authenticate Git with your GitHub credentials
# 4. Choose "Login with a web browser"
# 5. Follow browser authentication
```

## 🚀 **Useful GitHub CLI Commands for Your Project**

```bash
# Check authentication status
gh auth status

# View repository info
gh repo view

# Create pull request
gh pr create --title "Deploy to production" --body "Ready for production deployment"

# Check deployment status
gh run list

# View issues
gh issue list

# Create new branch and push
git checkout -b feature/new-feature
git push -u origin feature/new-feature
gh pr create

# Deploy to production (trigger Netlify)
git push origin main
```

---

# 🤖 **AI Code Analysis Tools ("Agent Engineers")**

## **1. GitHub Copilot CLI (Recommended)**

```bash
# Install GitHub Copilot CLI
npm install -g @githubnext/github-copilot-cli

# Setup
npx github-copilot-cli auth

# Usage examples
npx github-copilot-cli "analyze this React component for performance issues"
npx github-copilot-cli "review this TypeScript code for bugs"
npx github-copilot-cli "suggest improvements for this API endpoint"
```

## **2. CodeRabbit (AI Code Reviewer)**

- **Website**: https://coderabbit.ai
- **Features**: Automated PR reviews, security analysis, performance suggestions
- **Setup**: Connect your GitHub repo
- **Cost**: Free for public repos, paid for private

## **3. Sourcery (AI Code Improver)**

```bash
# Install Sourcery
pip install sourcery-cli

# Login
sourcery login

# Review code
sourcery review src/
sourcery review --diff
```

## **4. DeepCode/Snyk Code (Security Analysis)**

```bash
# Install Snyk CLI
npm install -g snyk

# Authenticate
snyk auth

# Scan for vulnerabilities
snyk code test
snyk test
```

## **5. Codeium (Free AI Assistant)**

- **Website**: https://codeium.com
- **Features**: Code completion, chat, explanations
- **VS Code Extension**: Search "Codeium" in extensions
- **Free**: Unlimited usage

## **6. SonarQube (Code Quality)**

```bash
# Install SonarScanner
npm install -g sonarqube-scanner

# Scan project
sonar-scanner \
  -Dsonar.projectKey=halal-sg-connect \
  -Dsonar.sources=./src \
  -Dsonar.host.url=http://localhost:9000
```

---

# 🎯 **Recommended Setup for Your Project**

## **Quick Start (5 minutes)**

1. **Install GitHub CLI**:
   ```bash
   brew install gh
   gh auth login
   ```

2. **Install Codeium VS Code Extension** (Free AI assistant)

3. **Setup GitHub Actions for automated checks**:
   ```yaml
   # .github/workflows/code-quality.yml
   name: Code Quality
   on: [push, pull_request]
   jobs:
     quality:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
         - run: npm install
         - run: npm run lint
         - run: npm run type-check
         - run: npm run test:run
   ```

## **Advanced Setup (15 minutes)**

1. **Add CodeRabbit to your repo** for PR reviews
2. **Install Sourcery** for Python-like improvements  
3. **Setup SonarCloud** for continuous quality monitoring
4. **Add GitHub Copilot** if you have access

---

# 🔍 **Code Analysis Commands for Your Halal SG Connect Project**

```bash
# Analyze the entire codebase
gh copilot suggest "analyze the entire Halal SG Connect codebase for security vulnerabilities and performance issues"

# Review specific components
gh copilot suggest "review the BulkImportUpload component for potential bugs and improvements"

# Check SEO implementation
gh copilot suggest "analyze the SEO implementation in the seo-generator.ts file for best practices"

# Review database queries
gh copilot suggest "check the Supabase queries in the codebase for optimization opportunities"

# Security audit
snyk code test src/
snyk test package.json
```

---

# 🚀 **Automated Deployment with GitHub CLI**

```bash
# Quick deployment script
#!/bin/bash
echo "🚀 Deploying Halal SG Connect..."

# Run quality checks
npm run lint:check
npm run type-check
npm run test:run

# Commit and push
git add .
git commit -m "🔧 Production deployment $(date)"
git push origin main

# Check deployment status
echo "✅ Checking Netlify deployment..."
sleep 10
curl -I https://vocal-puffpuff-8d486c.netlify.app/

echo "🎉 Deployment complete!"
```

**Save this as `deploy.sh` and run with `bash deploy.sh`**

---

Would you like me to help you set up any of these tools specifically?