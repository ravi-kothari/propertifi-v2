# 🚀 Quick Start Testing Guide

## Start Testing in 3 Steps

### Step 1: Start the Application (Docker - Recommended)

```bash
cd /Users/ravi/Documents/gemini_projects/propertifi
./docker-start.sh
```

Wait for the message showing all services are ready (~1-2 minutes).

**OR Manual Start:**

```bash
# Terminal 1: Backend
cd /Users/ravi/Documents/gemini_projects/propertifi/propertifi-backend
php artisan serve --port=8001

# Terminal 2: Frontend
cd /Users/ravi/Documents/gemini_projects/propertifi/propertifi-frontend/nextjs-app
npm run dev
```

### Step 2: Test All Links Automatically

```bash
cd /Users/ravi/Documents/gemini_projects/propertifi
./test-links.sh
```

This will check all links and report which ones work and which don't.

### Step 3: Access the Application

Open your browser to:
- **Landing Page**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **PM Dashboard**: http://localhost:3000/property-manager

---

## 🏢 Property Manager Dashboard - Complete Guide

### Access the PM Dashboard

**Method 1: Using Test Account (After Database Seeding)**

1. **Go to PM Login Page:**
   - The PM login is handled by the Laravel backend
   - You need to check if this route exists in Laravel

2. **Check if PM Login Route Exists:**
   ```bash
   cd propertifi-backend
   php artisan route:list | grep "pm/login"
   ```

3. **If Route Doesn't Exist, Add It:**
   Create or update `propertifi-backend/routes/web.php`:
   ```php
   // PM Authentication Routes
   Route::get('/pm/login', [App\Http\Controllers\Auth\PMAuthController::class, 'showLogin'])
       ->name('pm.login');

   Route::post('/pm/login', [App\Http\Controllers\Auth\PMAuthController::class, 'login']);

   Route::get('/pm/register', [App\Http\Controllers\Auth\PMAuthController::class, 'showRegister'])
       ->name('pm.register');
   ```

**Method 2: Direct Access (If Logged In)**

The PM dashboard exists at:
```
http://localhost:3000/property-manager
```

**Important:** The layout has authentication middleware that will redirect you to login if not authenticated.

### Test Credentials

After running database seeders:
```
Email: pm@propertifi.com
Password: password
```

To verify the account exists:
```bash
cd propertifi-backend
php artisan tinker
```

Then in tinker:
```php
User::where('email', 'pm@propertifi.com')->first();
```

### Available PM Dashboard Pages

Based on the frontend structure:

1. **Dashboard Home**
   ```
   http://localhost:3000/property-manager
   ```
   Shows overview, stats, recent leads

2. **Analytics**
   ```
   http://localhost:3000/property-manager/analytics
   ```
   Performance metrics and charts

### Testing PM Features

**Current Frontend PM Routes:**
- ✅ `/property-manager` - Dashboard home
- ✅ `/property-manager/analytics` - Analytics page
- ✅ `/property-manager/layout.tsx` - Has authentication check

**What to Test:**
1. Access without login → Should redirect to login
2. Login with PM credentials → Should access dashboard
3. View dashboard metrics
4. Navigate to analytics
5. Check data loads correctly

---

## 🔗 Link Testing Results

### Internal Links (Next.js - Port 3000)

These should work immediately:

| Link | URL | Expected |
|------|-----|----------|
| Landing Page | http://localhost:3000 | Home page loads |
| Blog | http://localhost:3000/blog | Blog listing |
| About | http://localhost:3000/about | About page |
| FAQ | http://localhost:3000/faq | FAQ page |
| Contact | http://localhost:3000/contact | Contact form |
| Get Started | http://localhost:3000/get-started | Onboarding flow |
| Admin | http://localhost:3000/admin | Admin dashboard (needs login) |
| PM Dashboard | http://localhost:3000/property-manager | PM dashboard (needs login) |

### External Links (Laravel - Port 8001)

These need Laravel backend routes to exist:

| Link | URL | Status | Action Needed |
|------|-----|--------|---------------|
| Owner Login | http://localhost:8001/owner/login | ⚠️ Check | Add Laravel route |
| PM Login | http://localhost:8001/pm/login | ⚠️ Check | Add Laravel route |
| PM Register | http://localhost:8001/pm/register | ⚠️ Check | Add Laravel route |
| Calculators | http://localhost:8001/tools/rental-roi | ⚠️ Check | Add Laravel route |
| Templates | http://localhost:8001/templates | ⚠️ Check | Add Laravel route |
| Laws | http://localhost:8001/laws | ⚠️ Check | Add Laravel route |

---

## 🛠️ Fix Missing Laravel Routes

If the test script shows Laravel routes are missing (404 errors), add them:

### 1. Create Controller

```bash
cd propertifi-backend
php artisan make:controller Auth/PMAuthController
```

### 2. Add Routes to `routes/web.php`

```php
use App\Http\Controllers\Auth\PMAuthController;

// PM Authentication
Route::get('/pm/login', [PMAuthController::class, 'showLogin'])->name('pm.login');
Route::post('/pm/login', [PMAuthController::class, 'login']);
Route::get('/pm/register', [PMAuthController::class, 'showRegister'])->name('pm.register');
Route::post('/pm/register', [PMAuthController::class, 'register']);

// After successful login, redirect to Next.js PM dashboard
Route::get('/pm/dashboard', function () {
    return redirect('http://localhost:3000/property-manager');
})->middleware('auth');
```

### 3. Create Controller Methods

In `app/Http/Controllers/Auth/PMAuthController.php`:

```php
<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PMAuthController extends Controller
{
    public function showLogin()
    {
        return view('pm.login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (auth()->attempt($credentials)) {
            $request->session()->regenerate();

            // Redirect to Next.js PM dashboard
            return redirect('http://localhost:3000/property-manager');
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ]);
    }

    public function showRegister()
    {
        return view('pm.register');
    }

    public function register(Request $request)
    {
        // Handle registration
    }
}
```

### 4. Create Views

```bash
mkdir -p resources/views/pm
```

Create `resources/views/pm/login.blade.php` with a simple login form.

---

## 🎯 Testing Workflow

### 1. Verify Services Are Running

```bash
./test-links.sh
```

Should show:
- ✅ Frontend is running
- ✅ Backend is running

### 2. Test Internal Navigation

Open http://localhost:3000 and click through:
- [x] Home
- [x] Blog
- [x] About
- [x] FAQ
- [x] Contact
- [x] Get Started

All should navigate within the Next.js app smoothly.

### 3. Test Login Flow

**For Admin:**
1. Go to http://localhost:3000/admin
2. Should redirect to login (if not authenticated)
3. Login with: admin@propertifi.com / password
4. Should access admin dashboard

**For Property Manager:**
1. Go to http://localhost:3000/property-manager
2. Should redirect to login (if not authenticated)
3. Need to setup Laravel PM login route first
4. Login with: pm@propertifi.com / password
5. Should access PM dashboard

### 4. Test External Links

Click links that go to Laravel backend:
- Owner Login
- PM Login
- Calculators
- Templates

If you get 404, those routes need to be added to Laravel.

---

## 🐛 Common Issues

### Issue: PM Dashboard Shows 404

**Solution:** The route exists at `/property-manager`, not `/pm/dashboard`.

The correct URL is:
```
http://localhost:3000/property-manager
```

### Issue: Redirect Loop on PM Dashboard

**Cause:** Authentication middleware redirecting because no valid session.

**Solution:**
1. Ensure you're logged in via Laravel backend first
2. Check session cookie is set
3. Verify CORS/session settings in Laravel `.env`:
   ```
   SESSION_DOMAIN=localhost
   SANCTUM_STATEFUL_DOMAINS=localhost:3000
   ```

### Issue: Laravel Links Show 404

**Cause:** Routes don't exist in Laravel yet.

**Solution:** Add the routes following the guide above.

### Issue: Can't Login to PM Dashboard

**Cause:** No PM authentication route in Laravel.

**Solution:**
1. Add PM login routes to Laravel
2. Create PMAuthController
3. Set up session sharing between Laravel and Next.js

---

## 📋 Quick Command Reference

```bash
# Test all links
./test-links.sh

# Start with Docker
./docker-start.sh

# Stop Docker
./docker-stop.sh

# Check Laravel routes
cd propertifi-backend && php artisan route:list

# Check database users
cd propertifi-backend && php artisan tinker
# Then: User::all();

# Clear Laravel cache
cd propertifi-backend && php artisan cache:clear

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

---

## 🎉 Success Checklist

- [ ] Both servers start without errors
- [ ] Landing page loads at http://localhost:3000
- [ ] All internal links work (Blog, About, FAQ, etc.)
- [ ] Admin dashboard accessible at /admin
- [ ] PM dashboard exists at /property-manager
- [ ] Can login to admin with test credentials
- [ ] No console errors in browser DevTools
- [ ] Database has seeded data
- [ ] API endpoints respond (test with curl)

---

## 📚 Related Documentation

- **LANDING_PAGE_LINKS_AND_PM_GUIDE.md** - Detailed link analysis
- **DOCKER_GUIDE.md** - Docker setup and commands
- **TESTING_GUIDE.md** - Comprehensive testing steps
- **README.md** - Project overview

---

**Ready to test?** Run `./docker-start.sh` and open http://localhost:3000! 🚀
