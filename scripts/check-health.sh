#!/bin/bash

# Propertifi - Health Check Script
# Quickly verify if backend and frontend are running correctly

echo "🏥 Propertifi Health Check"
echo "========================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check Backend
echo -e "${YELLOW}Checking Backend (http://localhost:8001)...${NC}"
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8001/api/health 2>/dev/null)

if [ "$BACKEND_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Backend is running and healthy${NC}"
else
    echo -e "${RED}❌ Backend is not responding (HTTP $BACKEND_STATUS)${NC}"
fi
echo ""

# Check Frontend
echo -e "${YELLOW}Checking Frontend (http://localhost:3000)...${NC}"
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null)

if [ "$FRONTEND_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Frontend is running${NC}"
else
    echo -e "${RED}❌ Frontend is not responding (HTTP $FRONTEND_STATUS)${NC}"
fi
echo ""

# Check Database Connection
echo -e "${YELLOW}Checking Database Connection...${NC}"
cd /Users/ravi/Documents/gemini_projects/propertifi/propertifi-backend
DB_CHECK=$(php artisan db:show 2>&1)

if echo "$DB_CHECK" | grep -q "MySQL\|PostgreSQL"; then
    echo -e "${GREEN}✅ Database connection successful${NC}"
    echo "$DB_CHECK" | head -5
else
    echo -e "${RED}❌ Database connection failed${NC}"
    echo "$DB_CHECK"
fi
echo ""

# Check Running Processes
echo -e "${YELLOW}Checking Running Processes...${NC}"
BACKEND_PROCESS=$(ps aux | grep "[p]hp artisan serve" | wc -l)
FRONTEND_PROCESS=$(ps aux | grep "[n]ode.*next" | wc -l)

if [ "$BACKEND_PROCESS" -gt 0 ]; then
    echo -e "${GREEN}✅ Laravel process running${NC}"
else
    echo -e "${RED}❌ Laravel process not found${NC}"
fi

if [ "$FRONTEND_PROCESS" -gt 0 ]; then
    echo -e "${GREEN}✅ Next.js process running${NC}"
else
    echo -e "${RED}❌ Next.js process not found${NC}"
fi
echo ""

# Summary
echo "========================="
if [ "$BACKEND_STATUS" = "200" ] && [ "$FRONTEND_STATUS" = "200" ]; then
    echo -e "${GREEN}✨ All systems operational!${NC}"
    echo ""
    echo "🌐 Open in browser: http://localhost:3000"
else
    echo -e "${RED}⚠️  Some services are not running${NC}"
    echo ""
    echo "To start the application, run:"
    echo "./start-app.sh"
fi
