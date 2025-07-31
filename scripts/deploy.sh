#!/bin/bash

# 🚀 Halal SG Connect - Production Deployment Script
# This script runs quality checks and deploys to production

set -e  # Exit on any error

echo "🚀 Starting Halal SG Connect deployment..."
echo "📅 Deployment started at: $(date)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if required commands exist
command -v npm >/dev/null 2>&1 || { print_error "npm is required but not installed. Aborting." >&2; exit 1; }
command -v git >/dev/null 2>&1 || { print_error "git is required but not installed. Aborting." >&2; exit 1; }

# 1. Install dependencies
print_status "📦 Installing dependencies..."
npm ci || {
    print_error "Failed to install dependencies"
    exit 1
}
print_success "Dependencies installed"

# 2. Run type checking
print_status "🔍 Running TypeScript type checking..."
npm run type-check || {
    print_error "TypeScript type checking failed"
    exit 1
}
print_success "Type checking passed"

# 3. Run linting
print_status "🧹 Running ESLint..."
npm run lint:check || {
    print_warning "Linting issues found. Attempting to fix..."
    npm run lint || {
        print_error "Unable to fix linting issues automatically"
        exit 1
    }
}
print_success "Linting passed"

# 4. Run tests
print_status "🧪 Running tests..."
npm run test:run || {
    print_error "Tests failed"
    exit 1
}
print_success "All tests passed"

# 5. Build the project
print_status "🏗️ Building project..."
npm run build || {
    print_error "Build failed"
    exit 1
}
print_success "Build completed successfully"

# 6. Check build size
print_status "📊 Checking build size..."
BUILD_SIZE=$(du -sh dist/ | cut -f1)
print_success "Build size: $BUILD_SIZE"

# 7. Security audit
print_status "🔒 Running security audit..."
npm audit --audit-level moderate || {
    print_warning "Security vulnerabilities found. Review before deploying to production."
}

# 8. Git operations
print_status "📝 Preparing Git commit..."

# Check if there are any changes to commit
if git diff --staged --quiet && git diff --quiet; then
    print_warning "No changes to commit"
else
    # Add all changes
    git add .
    
    # Create commit message with timestamp
    COMMIT_MSG="🚀 Production deployment - $(date '+%Y-%m-%d %H:%M:%S')"
    git commit -m "$COMMIT_MSG" || {
        print_warning "Nothing to commit or commit failed"
    }
fi

# 9. Push to main branch
print_status "⬆️ Pushing to main branch..."
git push origin main || {
    print_error "Failed to push to main branch"
    exit 1
}
print_success "Pushed to main branch"

# 10. Wait for deployment and check status
print_status "⏳ Waiting for Netlify deployment..."
sleep 15

print_status "🌐 Checking deployment status..."
SITE_URL="https://vocal-puffpuff-8d486c.netlify.app"

# Check if site is responding
if curl -s --head "$SITE_URL" | head -n 1 | grep -q "200 OK"; then
    print_success "✅ Site is live and responding!"
    print_success "🌍 URL: $SITE_URL"
else
    print_warning "⚠️ Site may still be deploying. Check Netlify dashboard."
fi

# 11. Run post-deployment checks
print_status "🔍 Running post-deployment checks..."

# Check if sitemap is accessible
if curl -s "$SITE_URL/sitemap.xml" | grep -q "<urlset"; then
    print_success "✅ Sitemap is accessible"
else
    print_warning "⚠️ Sitemap may not be generated yet"
fi

# Check if robots.txt is accessible
if curl -s "$SITE_URL/robots.txt" | grep -q "User-agent"; then
    print_success "✅ Robots.txt is accessible"
else
    print_warning "⚠️ Robots.txt may not be accessible"
fi

# 12. Summary
echo ""
echo "🎉 =================================="
echo "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo "🎉 =================================="
echo ""
print_success "🌍 Live URL: $SITE_URL"
print_success "⏰ Deployment completed at: $(date)"
print_success "📊 Build size: $BUILD_SIZE"
echo ""
print_status "📋 Next steps:"
echo "   1. Test functionality on live site"
echo "   2. Import sample business data via /admin/import"
echo "   3. Generate SEO pages via /admin/system"
echo "   4. Submit sitemap to Google Search Console"
echo ""
print_success "🚀 Happy deploying!"