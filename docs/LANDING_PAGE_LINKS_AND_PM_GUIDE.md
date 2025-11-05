# Landing Page Links Verification & Property Manager Testing Guide

## 🔗 Landing Page Links Analysis

### Navigation Header Links

Based on your Header component at `app/components/layout/Header.tsx`:

| Link | Type | Destination | Status | Notes |
|------|------|-------------|--------|-------|
| **Logo/Home** | Internal | `/` | ✅ Working | Next.js Link |
| **Home** | Internal | `/` | ✅ Working | Next.js Link |
| **Resources → Blog** | Internal | `/blog` | ✅ Working | Next.js Link |
| **Resources → Landlord Laws** | External | `http://localhost:8001/laws` | ⚠️ Check Backend | Laravel route |
| **Resources → Forms & Templates** | External | `http://localhost:8001/templates` | ⚠️ Check Backend | Laravel route |
| **Resources → Calculators** | External | `http://localhost:8001/tools/rental-roi` | ⚠️ Check Backend | Laravel route |
| **Resources → FAQ** | Internal | `/faq` | ✅ Working | Next.js Link |
| **About** | Internal | `/about` | ✅ Working | Next.js Link |
| **Owner Login** | External | `http://localhost:8001/owner/login` | ⚠️ Check Backend | Laravel route |
| **PM Login** | External | `http://localhost:8001/pm/login` | ⚠️ Check Backend | Laravel route |
| **Get Started** | Internal | `/get-started` | ✅ Working | Next.js Link |

### Landing Page Body Links

From `app/page.tsx`:

| Section | Link | Type | Destination | Status |
|---------|------|------|-------------|--------|
| **Hero - Owner Sign In** | External | `http://localhost:8001/owner/login` | ⚠️ Check Backend | Laravel |
| **Hero - Owner Get Started** | Internal | `/get-started` | ✅ Working | Next.js |
| **Hero - PM Sign In** | External | `http://localhost:8001/pm/login` | ⚠️ Check Backend | Laravel |
| **Hero - PM Join Now** | External | `http://localhost:8001/pm/register` | ⚠️ Check Backend | Laravel |
| **Tools - Try Calculators** | External | `http://localhost:8001/tools/rental-roi` | ⚠️ Check Backend | Laravel |
| **Tools - Browse Templates** | External | `http://localhost:8001/templates` | ⚠️ Check Backend | Laravel |
| **Tools - Read Blog** | Internal | `/blog` | ✅ Working | Next.js |

## 🏗️ Link Architecture

### Internal Links (Next.js Frontend - Port 3000)
These work natively in the Next.js app:
- `/` - Landing page
- `/blog` - Blog listing
- `/about` - About page
- `/faq` - FAQ page
- `/contact` - Contact page
- `/get-started` - Onboarding flow
- `/admin` - Admin dashboard

### External Links (Laravel Backend - Port 8001)
These redirect to the Laravel application:
- `/owner/login` - Owner login page
- `/pm/login` - Property Manager login page
- `/pm/register` - PM registration page
- `/laws` - Landlord laws by state
- `/templates` - Document templates
- `/tools/rental-roi` - ROI Calculator
- `/tools/mortgage` - Mortgage Calculator
- `/tools/rent-vs-buy` - Rent vs Buy Calculator

## 🧪 Testing All Links

### 1. Start Both Servers

```bash
# Terminal 1: Start Docker (includes both backend and frontend)
cd /Users/ravi/Documents/gemini_projects/propertifi
./docker-start.sh

# OR if using manual setup:

# Terminal 1: Backend
cd propertifi-backend
php artisan serve --port=8001

# Terminal 2: Frontend
cd propertifi-frontend/nextjs-app
npm run dev
```

### 2. Test Internal Links (Next.js)

Open http://localhost:3000 and click:

```bash
✅ Home → /
✅ Blog → /blog
✅ About → /about
✅ FAQ → /faq
✅ Get Started → /get-started
✅ Admin → /admin (requires login)
```

All these should navigate within the Next.js app without page reload.

### 3. Test External Links (Laravel)

These will redirect to port 8001:

```bash
⚠️ Owner Login → http://localhost:8001/owner/login
⚠️ PM Login → http://localhost:8001/pm/login
⚠️ PM Register → http://localhost:8001/pm/register
⚠️ Calculators → http://localhost:8001/tools/rental-roi
⚠️ Templates → http://localhost:8001/templates
⚠️ Laws → http://localhost:8001/laws
```

**Note:** These links will only work if:
1. Laravel backend is running on port 8001
2. These routes exist in Laravel's `routes/web.php`

### 4. Verify Backend Routes Exist

Check if Laravel has these routes:

```bash
cd propertifi-backend
php artisan route:list | grep -E "owner/login|pm/login|tools|templates|laws"
```

## 🏢 Property Manager Dashboard Access Guide

### Option 1: Using Test Account (After Seeding)

If you've run database seeders:

1. **Go to PM Login:**
   ```
   http://localhost:8001/pm/login
   ```

2. **Login Credentials:**
   ```
   Email: pm@propertifi.com
   Password: password
   ```

3. **Expected Redirect:**
   After login, you should be redirected to:
   ```
   http://localhost:3000/property-manager
   ```
   OR
   ```
   http://localhost:8001/property-manager
   ```

### Option 2: Register New PM Account

1. **Go to PM Registration:**
   ```
   http://localhost:8001/pm/register
   ```

2. **Fill in the form:**
   - Name: Test PM
   - Email: testpm@example.com
   - Password: password123
   - Company Name: Test Property Management
   - Phone: (555) 123-4567

3. **Submit and Login**

### Property Manager Dashboard Features to Test

Based on your frontend code, PM dashboard should be at:
```
http://localhost:3000/property-manager
```

**Available Features:**

1. **Dashboard Home**
   - Overview metrics
   - Recent leads
   - Performance stats

2. **Lead Management**
   - View incoming leads
   - Respond to leads
   - Track lead status

3. **Profile Management**
   - Edit PM profile
   - Update company details
   - Manage services offered

4. **Property Listings**
   - Add properties under management
   - Update property details

## 🔧 Fixing Broken Links

### Issue 1: Laravel Routes Don't Exist

If clicking "PM Login" or other Laravel links gives 404:

**Solution:** Create the routes in Laravel backend:

```php
// propertifi-backend/routes/web.php

// PM Authentication Routes
Route::get('/pm/login', function () {
    return view('pm.login');
})->name('pm.login');

Route::get('/pm/register', function () {
    return view('pm.register');
})->name('pm.register');

// Owner Authentication Routes
Route::get('/owner/login', function () {
    return view('owner.login');
})->name('owner.login');

// Tools Routes
Route::get('/tools/rental-roi', function () {
    return view('tools.roi-calculator');
})->name('tools.roi');

Route::get('/tools/mortgage', function () {
    return view('tools.mortgage-calculator');
})->name('tools.mortgage');

Route::get('/tools/rent-vs-buy', function () {
    return view('tools.rent-vs-buy');
})->name('tools.rent-vs-buy');

// Templates & Laws
Route::get('/templates', function () {
    return view('templates.index');
})->name('templates.index');

Route::get('/laws', function () {
    return view('laws.index');
})->name('laws.index');
```

### Issue 2: PM Dashboard is on Laravel, Not Next.js

If PM dashboard is supposed to be on Laravel backend:

Update frontend `.env.local`:
```bash
NEXT_PUBLIC_MAIN_APP_URL=http://localhost:8001
```

### Issue 3: CORS Errors

If you get CORS errors when clicking external links:

Update Laravel backend `.env`:
```bash
SANCTUM_STATEFUL_DOMAINS=localhost,localhost:3000,localhost:8001
SESSION_DOMAIN=localhost
```

And update `config/cors.php`:
```php
'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'register'],
'allowed_origins' => ['http://localhost:3000', 'http://localhost:8001'],
'supports_credentials' => true,
```

## 📝 Complete Testing Checklist

### Header Navigation
- [ ] Click "Home" → Should go to `/`
- [ ] Click "Resources" dropdown → Should show submenu
- [ ] Click "Blog" in dropdown → Should go to `/blog`
- [ ] Click "Landlord Laws" → Should go to `http://localhost:8001/laws`
- [ ] Click "Forms & Templates" → Should go to `http://localhost:8001/templates`
- [ ] Click "Calculators" → Should go to `http://localhost:8001/tools/rental-roi`
- [ ] Click "FAQ" in dropdown → Should go to `/faq`
- [ ] Click "About" → Should go to `/about`
- [ ] Click "Owner Login" → Should go to `http://localhost:8001/owner/login`
- [ ] Click "PM Login" → Should go to `http://localhost:8001/pm/login`
- [ ] Click "Get Started" button → Should go to `/get-started`

### Landing Page Body
- [ ] Hero: Click "Sign In" (Owner) → Owner login page
- [ ] Hero: Click "Get Started" (Owner) → `/get-started`
- [ ] Hero: Click "Sign In" (PM) → PM login page
- [ ] Hero: Click "Join Now" (PM) → PM registration page
- [ ] Tools: Click "Try Calculators →" → Calculator page
- [ ] Tools: Click "Browse Templates →" → Templates page
- [ ] Tools: Click "Read Blog →" → `/blog`

### PM Dashboard Access
- [ ] Login as PM at `http://localhost:8001/pm/login`
- [ ] Verify redirect to PM dashboard
- [ ] Check dashboard loads without errors
- [ ] Test navigation within PM dashboard
- [ ] Verify PM can view leads
- [ ] Verify PM can edit profile

## 🚨 Common Issues & Solutions

### Issue: "404 Not Found" on Laravel Links

**Cause:** Laravel backend doesn't have those routes defined

**Solution:**
```bash
# Check Laravel routes
cd propertifi-backend
php artisan route:list

# If routes are missing, add them to routes/web.php
```

### Issue: PM Dashboard Shows 404

**Cause:** Route doesn't exist in Next.js or Laravel

**Check Next.js routes:**
```bash
ls -la propertifi-frontend/nextjs-app/app/\(dashboard\)/property-manager/
```

**Check Laravel routes:**
```bash
php artisan route:list | grep property-manager
```

### Issue: Infinite Redirect Loop

**Cause:** Middleware redirecting logged-in users incorrectly

**Solution:** Check authentication middleware in both Next.js and Laravel

### Issue: CORS Policy Error

**Cause:** Backend not allowing requests from frontend domain

**Solution:** Update Laravel CORS configuration (see Issue 3 above)

## 📊 Quick Verification Commands

```bash
# Check if backend is running
curl http://localhost:8001/api/health

# Check if frontend is running
curl http://localhost:3000

# Check specific route exists
curl -I http://localhost:8001/pm/login

# Check PM dashboard route
curl -I http://localhost:3000/property-manager
```

## 🎯 Next Steps

1. **Start both servers** (frontend on 3000, backend on 8001)
2. **Test each link** from the checklist
3. **Document any 404 errors** you encounter
4. **Create missing Laravel routes** if needed
5. **Verify PM dashboard** is accessible after login
6. **Test PM features** (leads, profile, properties)

---

**Need more help?** Check the specific error messages and refer to this guide for solutions.
