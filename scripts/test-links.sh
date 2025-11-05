#!/bin/bash

# Landing Page Links Testing Script
# Tests all links on the landing page and reports status

echo "🔗 Testing Propertifi Landing Page Links"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

FRONTEND_URL="http://localhost:3000"
BACKEND_URL="http://localhost:8001"

# Test function
test_url() {
    local url=$1
    local name=$2
    local status=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)

    if [ "$status" = "200" ] || [ "$status" = "302" ]; then
        echo -e "${GREEN}✅ $name${NC} - $url (HTTP $status)"
        return 0
    else
        echo -e "${RED}❌ $name${NC} - $url (HTTP $status)"
        return 1
    fi
}

# Check if servers are running
echo "📡 Checking if servers are running..."
echo ""

if curl -s "$FRONTEND_URL" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend is running${NC} - $FRONTEND_URL"
else
    echo -e "${RED}❌ Frontend is NOT running${NC} - $FRONTEND_URL"
    echo "   Start it with: cd propertifi-frontend/nextjs-app && npm run dev"
    exit 1
fi

if curl -s "$BACKEND_URL/api/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is running${NC} - $BACKEND_URL"
else
    echo -e "${YELLOW}⚠️  Backend is NOT running${NC} - $BACKEND_URL"
    echo "   Start it with: cd propertifi-backend && php artisan serve --port=8001"
    echo "   Some links will fail without backend running."
fi

echo ""
echo "========================================="
echo "Testing Internal Links (Next.js)"
echo "========================================="
echo ""

# Test internal Next.js routes
test_url "$FRONTEND_URL/" "Landing Page"
test_url "$FRONTEND_URL/blog" "Blog"
test_url "$FRONTEND_URL/about" "About"
test_url "$FRONTEND_URL/faq" "FAQ"
test_url "$FRONTEND_URL/contact" "Contact"
test_url "$FRONTEND_URL/get-started" "Get Started"

echo ""
echo "========================================="
echo "Testing External Links (Laravel Backend)"
echo "========================================="
echo ""

# Test Laravel routes
test_url "$BACKEND_URL/owner/login" "Owner Login"
test_url "$BACKEND_URL/pm/login" "PM Login"
test_url "$BACKEND_URL/pm/register" "PM Register"
test_url "$BACKEND_URL/tools/rental-roi" "ROI Calculator"
test_url "$BACKEND_URL/tools/mortgage" "Mortgage Calculator"
test_url "$BACKEND_URL/tools/rent-vs-buy" "Rent vs Buy"
test_url "$BACKEND_URL/templates" "Templates"
test_url "$BACKEND_URL/laws" "Landlord Laws"

echo ""
echo "========================================="
echo "Testing API Endpoints"
echo "========================================="
echo ""

test_url "$BACKEND_URL/api/health" "API Health Check"
test_url "$BACKEND_URL/api/states" "States API"

echo ""
echo "========================================="
echo "Testing Admin & Dashboard Routes"
echo "========================================="
echo ""

test_url "$FRONTEND_URL/admin" "Admin Dashboard"
test_url "$FRONTEND_URL/property-manager" "PM Dashboard"

echo ""
echo "========================================="
echo "Summary"
echo "========================================="
echo ""
echo "✅ = Link is working (HTTP 200 or 302)"
echo "❌ = Link is broken (HTTP 404 or other error)"
echo ""
echo "If you see ❌ for Laravel routes, ensure:"
echo "1. Backend is running on port 8001"
echo "2. Routes exist in Laravel routes/web.php"
echo "3. Views exist for those routes"
echo ""
echo "To fix missing Laravel routes, see:"
echo "LANDING_PAGE_LINKS_AND_PM_GUIDE.md"
