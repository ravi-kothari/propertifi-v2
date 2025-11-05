#!/bin/bash

# Propertifi - Stop Application Script
# Safely stop all running services

echo "🛑 Stopping Propertifi Application"
echo "==================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Find and kill Laravel process
echo -e "${YELLOW}Stopping Laravel backend...${NC}"
LARAVEL_PIDS=$(ps aux | grep "[p]hp artisan serve" | awk '{print $2}')

if [ -z "$LARAVEL_PIDS" ]; then
    echo -e "${YELLOW}No Laravel process found${NC}"
else
    echo "$LARAVEL_PIDS" | xargs kill 2>/dev/null
    echo -e "${GREEN}✅ Laravel stopped${NC}"
fi

# Find and kill Next.js process
echo -e "${YELLOW}Stopping Next.js frontend...${NC}"
NEXTJS_PIDS=$(ps aux | grep "[n]ode.*next" | awk '{print $2}')

if [ -z "$NEXTJS_PIDS" ]; then
    echo -e "${YELLOW}No Next.js process found${NC}"
else
    echo "$NEXTJS_PIDS" | xargs kill 2>/dev/null
    echo -e "${GREEN}✅ Next.js stopped${NC}"
fi

# Clean up log files
if [ -f "/tmp/propertifi-backend.log" ]; then
    rm /tmp/propertifi-backend.log
    echo -e "${GREEN}✅ Backend log cleared${NC}"
fi

if [ -f "/tmp/propertifi-frontend.log" ]; then
    rm /tmp/propertifi-frontend.log
    echo -e "${GREEN}✅ Frontend log cleared${NC}"
fi

echo ""
echo -e "${GREEN}✨ Application stopped successfully${NC}"
