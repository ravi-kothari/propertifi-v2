#!/bin/bash

# RBAC Test User Setup Script
# This script helps set up test users for RBAC testing

echo "========================================="
echo "Propertifi RBAC Test User Setup"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Running database migrations...${NC}"
cd propertifi-backend
php artisan migrate:fresh
echo ""

echo -e "${BLUE}Step 2: Seeding roles with permissions...${NC}"
php artisan db:seed --class=DefaultRolesSeeder
echo ""

echo -e "${BLUE}Step 3: Seeding test users...${NC}"
php artisan db:seed --class=UsersSeeder
echo ""

echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}Test Users Created Successfully!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""

echo -e "${YELLOW}Available Test Users:${NC}"
echo ""
echo "1. ADMIN USER"
echo "   Email:    admin@propertifi.com"
echo "   Password: password123"
echo "   Role:     Administrator (26 permissions)"
echo ""
echo "2. PROPERTY MANAGER"
echo "   Email:    john@smithpm.com"
echo "   Password: password123"
echo "   Role:     Property Manager (12 permissions)"
echo ""
echo "3. PROPERTY OWNER"
echo "   Email:    robert@example.com"
echo "   Password: password123"
echo "   Role:     Owner (8 permissions)"
echo ""
echo "4. ADDITIONAL OWNERS"
echo "   Email:    jennifer@example.com / david@example.com"
echo "   Password: password123"
echo "   Role:     Owner (8 permissions)"
echo ""
echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}Next Steps:${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""
echo "1. Start the backend server:"
echo "   cd propertifi-backend && php artisan serve"
echo ""
echo "2. Start the Angular app:"
echo "   cd angular-app && npm start"
echo ""
echo "3. Open browser to http://localhost:4200"
echo ""
echo "4. Follow the testing guide:"
echo "   docs/RBAC_MANUAL_TESTING_CHECKLIST.md"
echo ""
echo -e "${GREEN}Happy Testing! 🚀${NC}"
echo ""
