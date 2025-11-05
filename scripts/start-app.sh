#!/bin/bash

# Propertifi - Local Development Startup Script
# This script helps you start the full-stack application for testing

echo "🚀 Propertifi Local Development Startup"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Directories
BACKEND_DIR="/Users/ravi/Documents/gemini_projects/propertifi/propertifi-backend"
FRONTEND_DIR="/Users/ravi/Documents/gemini_projects/propertifi/propertifi-frontend/nextjs-app"

# Check if backend directory exists
if [ ! -d "$BACKEND_DIR" ]; then
    echo -e "${RED}❌ Backend directory not found!${NC}"
    exit 1
fi

# Check if frontend directory exists
if [ ! -d "$FRONTEND_DIR" ]; then
    echo -e "${RED}❌ Frontend directory not found!${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Pre-flight Checks${NC}"
echo "-------------------"

# Check if .env exists in backend
if [ ! -f "$BACKEND_DIR/.env" ]; then
    echo -e "${YELLOW}⚠️  Backend .env not found. Creating from .env.example...${NC}"
    cd "$BACKEND_DIR"
    cp .env.example .env
    php artisan key:generate
fi

# Check if .env.local exists in frontend
if [ ! -f "$FRONTEND_DIR/.env.local" ]; then
    echo -e "${YELLOW}⚠️  Frontend .env.local not found. Creating...${NC}"
    cat > "$FRONTEND_DIR/.env.local" << EOF
NEXT_PUBLIC_API_URL=http://localhost:8001
NEXT_PUBLIC_MAIN_APP_URL=http://localhost:8001
EOF
fi

echo -e "${GREEN}✅ Environment files verified${NC}"
echo ""

# Check database connection
echo -e "${YELLOW}🗄️  Checking Database Connection...${NC}"
cd "$BACKEND_DIR"
php artisan db:show 2>&1 | head -5

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database connection successful${NC}"
else
    echo -e "${RED}❌ Database connection failed!${NC}"
    echo -e "${YELLOW}Please ensure your database server is running and credentials in .env are correct${NC}"
    exit 1
fi
echo ""

# Ask if user wants to run migrations
echo -e "${YELLOW}Would you like to run migrations? (y/n)${NC}"
read -r run_migrations
if [ "$run_migrations" = "y" ]; then
    echo -e "${YELLOW}🔄 Running migrations...${NC}"
    php artisan migrate --force
    echo -e "${GREEN}✅ Migrations complete${NC}"
fi
echo ""

# Ask if user wants to seed database
echo -e "${YELLOW}Would you like to seed the database with test data? (y/n)${NC}"
read -r run_seed
if [ "$run_seed" = "y" ]; then
    echo -e "${YELLOW}🌱 Seeding database...${NC}"
    php artisan db:seed --force
    echo -e "${GREEN}✅ Database seeded${NC}"
fi
echo ""

echo -e "${GREEN}🎯 Starting Services...${NC}"
echo "======================="
echo ""
echo -e "${YELLOW}Starting Backend (Laravel) on port 8001...${NC}"
echo "Backend will be available at: http://localhost:8001"
echo ""

# Start backend in background
cd "$BACKEND_DIR"
php artisan serve --port=8001 > /tmp/propertifi-backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"
echo ""

# Wait a moment for backend to start
sleep 3

# Test backend health
echo -e "${YELLOW}Testing backend health...${NC}"
curl -s http://localhost:8001/api/health > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend is responding${NC}"
else
    echo -e "${YELLOW}⚠️  Backend health check failed, but continuing...${NC}"
fi
echo ""

echo -e "${YELLOW}Starting Frontend (Next.js) on port 3000...${NC}"
echo "Frontend will be available at: http://localhost:3000"
echo ""

# Start frontend in background
cd "$FRONTEND_DIR"
npm run dev > /tmp/propertifi-frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"
echo ""

# Wait for frontend to start
sleep 5

echo ""
echo -e "${GREEN}✨ Application Started Successfully!${NC}"
echo "===================================="
echo ""
echo -e "📱 Frontend: ${GREEN}http://localhost:3000${NC}"
echo -e "🔧 Backend API: ${GREEN}http://localhost:8001/api${NC}"
echo ""
echo -e "${YELLOW}📝 Test Accounts (if seeded):${NC}"
echo "   Admin: admin@propertifi.com / password"
echo "   Owner: owner@propertifi.com / password"
echo "   PM: pm@propertifi.com / password"
echo ""
echo -e "${YELLOW}📋 View Logs:${NC}"
echo "   Backend: tail -f /tmp/propertifi-backend.log"
echo "   Frontend: tail -f /tmp/propertifi-frontend.log"
echo ""
echo -e "${YELLOW}🛑 To Stop Services:${NC}"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "Press Ctrl+C to stop monitoring logs..."
echo ""

# Show logs
tail -f /tmp/propertifi-backend.log /tmp/propertifi-frontend.log
