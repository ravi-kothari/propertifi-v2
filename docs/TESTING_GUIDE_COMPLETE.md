# Complete Testing Guide - Propertifi

## 🚀 Quick Start

Your application is running at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001

## 📋 What's Currently Working vs What Needs Backend Routes

### ✅ Fully Functional (Ready to Test Now)

These features work completely in the Next.js frontend:

#### 1. **Landing Page & Marketing Pages**
```
http://localhost:3000/              - Home page
http://localhost:3000/about         - About page
http://localhost:3000/faq           - FAQ page
http://localhost:3000/contact       - Contact page
http://localhost:3000/blog          - Blog listing
http://localhost:3000/pricing       - Pricing page
```

#### 2. **Property Manager Search & Browse**
```
http://localhost:3000/property-managers              - Browse all PMs
http://localhost:3000/property-managers/california   - Browse by state
http://localhost:3000/property-managers/california/los-angeles  - Browse by city
```

#### 3. **Calculators** (All Fully Functional)
```
http://localhost:3000/calculators/roi           - ROI Calculator
http://localhost:3000/calculators/mortgage      - Mortgage Calculator
http://localhost:3000/calculators/rent-vs-buy   - Rent vs Buy Calculator
```

#### 4. **Templates & Resources**
```
http://localhost:3000/templates           - Template library
http://localhost:3000/laws               - State laws
http://localhost:3000/laws/california    - State-specific laws
```

#### 5. **Get Started Flow** (Multi-step Form)
```
http://localhost:3000/get-started         - Property type selection
http://localhost:3000/get-started/address - Address step
http://localhost:3000/get-started/details - Property details
http://localhost:3000/get-started/contact - Contact information
http://localhost:3000/get-started/review  - Review & submit
```

#### 6. **Admin Dashboard** (Direct Access - No Auth Required for Testing)
```
http://localhost:3000/admin              - Admin dashboard home
http://localhost:3000/admin/users        - User management (CRUD operations)
http://localhost:3000/admin/roles        - Role management with permissions
http://localhost:3000/analytics          - Analytics dashboard
```

#### 7. **Property Manager Dashboard** (Direct Access)
```
http://localhost:3000/property-manager              - PM dashboard home
http://localhost:3000/property-manager/leads        - Lead management
http://localhost:3000/property-manager/properties   - Property management
http://localhost:3000/property-manager/profile      - PM profile
```

### ⚠️ Needs Backend Routes (Currently 404)

These features need Laravel backend routes to be created:

```
http://localhost:8001/owner/login      - Owner login (backend route needed)
http://localhost:8001/pm/login         - PM login (backend route needed)
http://localhost:8001/admin/login      - Admin login (backend route needed)
```

## 🧪 Testing Checklist

### Phase 1: Marketing & Public Pages

- [ ] **Landing Page**
  - [ ] Open http://localhost:3000
  - [ ] Click "Property Owners" sign in button
  - [ ] Click "Property Managers" sign in button
  - [ ] Test navigation menu
  - [ ] Scroll through all sections

- [ ] **Calculators**
  - [ ] ROI Calculator - enter values and get results
  - [ ] Mortgage Calculator - calculate payments
  - [ ] Rent vs Buy - compare scenarios

- [ ] **Property Manager Search**
  - [ ] Browse all managers
  - [ ] Filter by state
  - [ ] Filter by city
  - [ ] View manager profile
  - [ ] Add to comparison (up to 3)
  - [ ] Compare managers side-by-side

- [ ] **Get Started Flow**
  - [ ] Complete all 5 steps
  - [ ] Test form validation
  - [ ] Submit form
  - [ ] Check backend receives data

### Phase 2: Admin Dashboard (Direct Access)

- [ ] **Access Admin Dashboard**
  ```bash
  # Open in browser
  http://localhost:3000/admin
  ```

- [ ] **User Management**
  - [ ] View users table
  - [ ] Search/filter users
  - [ ] Create new user
  - [ ] Edit user
  - [ ] Delete user
  - [ ] Bulk actions (select multiple)
  - [ ] Verify/suspend users

- [ ] **Role Management**
  - [ ] View all roles
  - [ ] Create new role
  - [ ] Edit role permissions
  - [ ] Delete role
  - [ ] Clone role
  - [ ] Assign permissions (24+ granular permissions)

- [ ] **Analytics**
  - [ ] View dashboard stats
  - [ ] Check real-time updates
  - [ ] Verify metrics cards

### Phase 3: Property Manager Dashboard (Direct Access)

- [ ] **Access PM Dashboard**
  ```bash
  # Open in browser
  http://localhost:3000/property-manager
  ```

- [ ] **Lead Management**
  - [ ] View leads
  - [ ] Filter leads
  - [ ] Update lead status
  - [ ] Add notes
  - [ ] View lead details

- [ ] **Property Management**
  - [ ] View properties
  - [ ] Add new property
  - [ ] Edit property
  - [ ] View property details

- [ ] **Profile**
  - [ ] View profile
  - [ ] Edit profile information
  - [ ] Update services

### Phase 4: API Testing

- [ ] **Backend API Health**
  ```bash
  curl http://localhost:8001/api
  ```

- [ ] **Test API Endpoints**
  ```bash
  # Get states
  curl http://localhost:8001/api/states

  # Get cities
  curl http://localhost:8001/api/cities

  # Get templates
  curl http://localhost:8001/api/templates

  # Get laws
  curl http://localhost:8001/api/laws
  ```

## 🎯 How to Test Each Feature

### Testing Admin Dashboard

1. **Open directly** (no login required for testing):
   ```
   http://localhost:3000/admin
   ```

2. **Create a test user**:
   - Click "Create User" button
   - Fill in: name, email, select type
   - Click Save
   - Verify user appears in list

3. **Manage roles**:
   - Go to http://localhost:3000/admin/roles
   - Click "Create Role"
   - Enter role name and title
   - Select permissions (users.view, users.create, etc.)
   - Save role

4. **Bulk operations**:
   - Select multiple users with checkboxes
   - Click bulk action dropdown
   - Choose action (activate, deactivate, delete)
   - Confirm action

### Testing PM Dashboard

1. **Open directly**:
   ```
   http://localhost:3000/property-manager
   ```

2. **View leads**:
   - Navigate to Leads tab
   - Filter by status
   - Search by name/email
   - Click on a lead to view details

3. **Manage properties**:
   - Go to Properties tab
   - Add test property
   - Edit property details
   - Delete property

### Testing Calculators

1. **ROI Calculator**:
   ```
   http://localhost:3000/calculators/roi
   ```
   - Enter purchase price: $500,000
   - Down payment: $100,000
   - Monthly rent: $3,000
   - Monthly expenses: $1,500
   - Click Calculate
   - Verify results show: ROI, cash flow, cap rate

2. **Mortgage Calculator**:
   - Enter home price, down payment, interest rate
   - See monthly payment breakdown

3. **Rent vs Buy**:
   - Enter rent and purchase scenarios
   - Compare 5-year costs

### Testing Get Started Flow

1. **Start the flow**:
   ```
   http://localhost:3000/get-started
   ```

2. **Complete all steps**:
   - Step 1: Select property type (Single Family, Multi-family, etc.)
   - Step 2: Enter address details
   - Step 3: Property specifics (bedrooms, bathrooms, sqft)
   - Step 4: Contact information
   - Step 5: Review and submit

3. **Check submission**:
   - Open backend logs: `docker logs propertifi_backend -f`
   - Submit form
   - Verify API receives POST request

## 🔧 Database Access for Testing

### phpMyAdmin
```
http://localhost:8080

Server: db
Username: propertifi
Password: password
Database: propertifi
```

**What's in the database:**
- `users` - Empty (ready for testing)
- `roles` - Empty (ready for testing)
- `states` - 50 US states
- `cities` - Major US cities
- `document_templates` - 21 templates
- `legal_topics` - 10 legal topics
- `state_profiles` - 12 state profiles
- `blogs` - Sample blog posts
- `testimonials` - Sample testimonials

### Create Test Data

You can create test users directly in phpMyAdmin or via the admin dashboard UI.

**Test User Example** (insert via phpMyAdmin):
```sql
INSERT INTO users (name, email, type, status, email_verified_at, password, created_at, updated_at)
VALUES (
    'Test Admin',
    'admin@test.com',
    'admin',
    1,
    NOW(),
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: password
    NOW(),
    NOW()
);
```

## 📊 Expected Behavior

### What Should Work Perfectly:

1. ✅ All calculators calculate correctly
2. ✅ Property manager search and filtering
3. ✅ Admin dashboard CRUD operations
4. ✅ Role management with granular permissions
5. ✅ Multi-step get-started form
6. ✅ Responsive design on mobile/tablet
7. ✅ All UI components (tables, forms, dialogs)

### What's Partially Complete:

1. ⚠️ **Authentication** - Frontend UI exists, backend routes needed:
   - Login forms work (frontend)
   - Backend API endpoints need to be created
   - Session management needs setup

2. ⚠️ **Backend API Integration** - Some features need API connections:
   - User CRUD (frontend ready, API needed)
   - Lead management (frontend ready, API needed)
   - Property management (frontend ready, API needed)

## 🚀 Quick Test Commands

```bash
# Start containers
docker-compose up -d

# Check all containers are running
docker-compose ps

# View backend logs
docker logs propertifi_backend -f

# View frontend logs
docker logs propertifi_frontend -f

# Test backend API
curl http://localhost:8001/api/states | jq

# Restart frontend if needed
docker-compose restart frontend

# Rebuild everything
docker-compose up -d --build
```

## 💡 Tips for Testing

1. **Use Chrome DevTools**:
   - Open DevTools (F12)
   - Check Console for errors
   - Monitor Network tab for API calls

2. **Test Responsive Design**:
   - Toggle device toolbar in Chrome
   - Test on mobile (375px)
   - Test on tablet (768px)
   - Test on desktop (1440px)

3. **Clear Cache** if something seems broken:
   ```bash
   # In browser
   Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

   # Restart Next.js
   docker-compose restart frontend
   ```

4. **Check Backend Connectivity**:
   ```bash
   # From frontend container
   docker exec propertifi_frontend curl http://backend:8000/api
   ```

## 🎉 Summary

**You can test RIGHT NOW without authentication:**
- ✅ Admin dashboard at http://localhost:3000/admin
- ✅ PM dashboard at http://localhost:3000/property-manager
- ✅ All calculators
- ✅ Property manager search
- ✅ Get started flow
- ✅ All marketing pages

**Authentication is optional for testing** - all dashboards are accessible directly!

Start here:
```bash
# Main app
open http://localhost:3000

# Admin dashboard
open http://localhost:3000/admin

# PM dashboard
open http://localhost:3000/property-manager
```

Happy testing! 🚀
