# Propertifi - Local Testing Guide

## Quick Start

### 1. Start Database
Ensure MySQL/PostgreSQL is running on your machine.

### 2. Backend Setup (Laravel)

```bash
# Navigate to backend
cd /Users/ravi/Documents/gemini_projects/propertifi/propertifi-backend

# Install dependencies (if not done)
composer install

# Setup environment
cp .env.example .env
php artisan key:generate

# Configure .env file with:
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=propertifi
DB_USERNAME=root
DB_PASSWORD=your_password
SANCTUM_STATEFUL_DOMAINS=localhost:3000
SESSION_DOMAIN=localhost

# Setup database
php artisan migrate
php artisan db:seed

# Start server
php artisan serve
```

Backend will run at: **http://localhost:8000**

### 3. Frontend Setup (Next.js)

```bash
# Navigate to frontend
cd /Users/ravi/Documents/gemini_projects/propertifi/propertifi-frontend/nextjs-app

# Install dependencies (if not done)
npm install

# Create .env.local with:
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Start server
npm run dev
```

Frontend will run at: **http://localhost:3000**

## Testing Checklist

### ✅ Authentication Flow
- [ ] Register as Property Owner
- [ ] Register as Property Manager
- [ ] Login as Owner
- [ ] Login as Property Manager
- [ ] Login as Admin
- [ ] Logout functionality

### ✅ Admin Dashboard
- [ ] Access admin dashboard (http://localhost:3000/admin)
- [ ] View dashboard metrics
- [ ] Navigate between sections

### ✅ User Management
- [ ] View users list
- [ ] Search/filter users
- [ ] Create new user
- [ ] Edit user details
- [ ] Delete user
- [ ] Verify user
- [ ] Bulk actions (activate, deactivate, delete)

### ✅ Role Management
- [ ] View roles list
- [ ] Create new role
- [ ] Edit role permissions
- [ ] Clone role
- [ ] Delete role
- [ ] Assign role to user

### ✅ Property Manager Features
- [ ] View PM dashboard
- [ ] View/edit profile
- [ ] View leads
- [ ] Manage property listings

### ✅ Landing Page
- [ ] Hero section loads with dual login cards
- [ ] All features display correctly
- [ ] Property types section shows all 4 types
- [ ] Tools & Resources section
- [ ] Testimonials load
- [ ] Blog posts load
- [ ] Location browser works
- [ ] Footer links work

### ✅ Calculators
- [ ] ROI Calculator (http://localhost:3000/calculators/roi)
- [ ] Mortgage Calculator
- [ ] Rent vs Buy Calculator

### ✅ Legal Resources
- [ ] View document templates
- [ ] Download templates
- [ ] View landlord laws by state

## Common Issues & Solutions

### CORS Errors
**Error:** `CORS policy: No 'Access-Control-Allow-Origin' header`
**Fix:** Add to backend `.env`:
```
SANCTUM_STATEFUL_DOMAINS=localhost:3000
SESSION_DOMAIN=localhost
```

### API Connection Failed
**Error:** `Failed to fetch` or `Network Error`
**Fix:**
1. Verify backend is running: `curl http://localhost:8000/api/health`
2. Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`

### Database Connection Error
**Error:** `SQLSTATE[HY000] [2002]`
**Fix:**
1. Start database server
2. Verify credentials in backend `.env`
3. Create database: `CREATE DATABASE propertifi;`

### Session/Auth Issues
**Error:** `401 Unauthorized` on protected routes
**Fix:**
1. Clear browser cookies
2. Verify `SESSION_DOMAIN=localhost` in backend `.env`
3. Check `withCredentials: true` in API calls

## Test Accounts (After Seeding)

After running `php artisan db:seed`, you should have:

- **Admin:** admin@propertifi.com / password
- **Owner:** owner@propertifi.com / password
- **PM:** pm@propertifi.com / password

*Check your seeders for actual credentials*

## API Testing with cURL

### Test Health Check
```bash
curl http://localhost:8000/api/health
```

### Test Login
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@propertifi.com","password":"password"}'
```

### Test Protected Route (with token)
```bash
curl http://localhost:8000/api/admin/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Browser DevTools Checklist

### Network Tab
- [ ] All API requests return 200/201 (success)
- [ ] No CORS errors
- [ ] Cookies are being set (XSRF-TOKEN, session)
- [ ] Request/Response headers correct

### Console Tab
- [ ] No JavaScript errors
- [ ] No React hydration errors
- [ ] No missing image/asset warnings

### Application Tab
- [ ] Cookies are stored
- [ ] LocalStorage has theme preference
- [ ] SessionStorage (if used)

## Recommended Tools

1. **Browser Extensions:**
   - React Developer Tools
   - Redux DevTools (if using Redux)

2. **API Testing:**
   - Postman
   - Insomnia
   - Thunder Client (VS Code)

3. **Database Management:**
   - TablePlus
   - DBeaver
   - MySQL Workbench

## Performance Checks

- [ ] Pages load in < 2 seconds
- [ ] No layout shifts on page load
- [ ] Images are optimized
- [ ] API responses are < 500ms

## Mobile Testing

- [ ] Open http://localhost:3000 on mobile device (same network)
- [ ] Test responsive design
- [ ] Test touch interactions
- [ ] Test mobile navigation menu

## Final Verification

Run these commands to verify everything:

```bash
# Backend health
curl http://localhost:8000/api/health

# Frontend build (should complete without errors)
cd /Users/ravi/Documents/gemini_projects/propertifi/propertifi-frontend/nextjs-app
npm run build

# Backend tests (if available)
cd /Users/ravi/Documents/gemini_projects/propertifi/propertifi-backend
php artisan test
```

## Getting Help

If issues persist:
1. Check Laravel logs: `tail -f storage/logs/laravel.log`
2. Check Next.js console output
3. Review browser DevTools Console and Network tabs
4. Check database for actual data
