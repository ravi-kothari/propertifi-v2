# Quick Start: Testing Lead Response System

## 🚀 Fastest Way to Test (5 minutes)

### Step 1: Install MSW

```bash
cd /Users/ravi/Documents/gemini_projects/propertifi/propertifi-frontend/nextjs-app
npm install msw --save-dev
```

### Step 2: Run Tests

```bash
npm test LeadResponseSystem
```

Expected output:
```
✓ should display response type options
✓ should show contact info form when selected
✓ should validate required fields
✓ should submit contact info response successfully
... (15+ tests should pass)
```

---

## 🌐 Test in Browser (Development Mode)

### Option A: With Mock Data (No Backend Needed)

1. **Initialize MSW Service Worker**

```bash
npx msw init public/ --save
```

2. **Enable MSW in Development**

Create `app/providers.tsx` (if not exists) and add:

```typescript
'use client';

import { useEffect } from 'react';

export function MSWProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (typeof window !== 'undefined') {
        import('../mocks/browser').then(({ worker }) => {
          worker.start({
            onUnhandledRequest: 'bypass',
          });
        });
      }
    }
  }, []);

  return <>{children}</>;
}
```

Wrap your app in `app/layout.tsx`:

```typescript
import { MSWProvider } from './providers';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <MSWProvider>
          <Providers>{children}</Providers>
        </MSWProvider>
      </body>
    </html>
  );
}
```

3. **Start Dev Server**

```bash
npm run dev
```

4. **Test the Flow**

- Go to: `http://localhost:3000/property-manager`
- You'll see 2 mock leads
- Click any lead → Modal opens
- Try all response types

### Option B: With Real Backend

1. **Start Backend**

```bash
cd /Users/ravi/Documents/gemini_projects/propertifi
php artisan serve
```

2. **Start Frontend**

```bash
cd propertifi-frontend/nextjs-app
npm run dev
```

3. **Create Test Lead** (in backend)

```bash
php artisan tinker
```

```php
$lead = new App\Models\Lead([
    'property_type' => 'Single Family',
    'street_address' => '123 Test St',
    'city' => 'LA',
    'state' => 'CA',
    'zip_code' => '90001',
    'full_name' => 'Test Owner',
    'email' => 'owner@test.com',
    'phone' => '555-1234',
    'preferred_contact' => 'email',
    'status' => 'new',
]);
$lead->save();
```

---

## 🎯 Manual Test Checklist

### Test 1: Open Lead Modal
- [ ] Click on a lead card
- [ ] Modal opens with lead details
- [ ] See 3 tabs: Details, Respond, History

### Test 2: Submit Contact Info
- [ ] Click "Respond" tab
- [ ] Select "Share Contact Info" 📞
- [ ] Fill message (min 10 chars)
- [ ] Fill phone: "555-123-4567"
- [ ] Fill email: "pm@example.com"
- [ ] Click "Send Response"
- [ ] See success (redirects to History tab)
- [ ] Response appears in history

### Test 3: Submit Availability
- [ ] Select "Schedule Viewing" 📅
- [ ] Fill message
- [ ] Select date (tomorrow)
- [ ] Select time (10:00)
- [ ] Optional: location
- [ ] Submit
- [ ] Verify in history

### Test 4: Submit Price Quote
- [ ] Select "Send Quote" 💰
- [ ] Fill message
- [ ] Amount: 2000
- [ ] Frequency: Monthly
- [ ] Details: "Full management services..."
- [ ] Add service: "Tenant Screening"
- [ ] Submit
- [ ] Verify in history

### Test 5: Form Validation
- [ ] Try submit with empty message → Error
- [ ] Try submit contact info with no phone/email → Error
- [ ] Enter invalid email → Error
- [ ] Enter negative quote amount → Error

### Test 6: Response History
- [ ] Open lead with responses
- [ ] Go to History tab
- [ ] See all past responses
- [ ] Responses show correct details
- [ ] Color coding matches type

### Test 7: View Tracking
- [ ] Open DevTools Network tab
- [ ] Open a lead modal
- [ ] See POST to `/property-managers/{id}/leads/{id}/view`
- [ ] Response: `{ viewed_at: "..." }`

---

## 🐛 Common Issues & Fixes

### Issue: "Module not found: 'msw'"
**Fix:**
```bash
npm install msw --save-dev
```

### Issue: Tests fail with "server is not defined"
**Fix:** Check `jest.setup.ts` imports `./mocks/server`

### Issue: Modal doesn't open
**Fix:** Check `@headlessui/react` is installed:
```bash
npm install @headlessui/react
```

### Issue: Forms don't validate
**Fix:** Install zod and react-hook-form:
```bash
npm install zod react-hook-form @hookform/resolvers
```

### Issue: API calls fail in development
**Fix:** Check `.env.local` has:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## 📊 Expected Results

### Test Coverage
After running `npm test -- --coverage`:

```
File                           | % Stmts | % Branch | % Funcs | % Lines
-------------------------------|---------|----------|---------|--------
useLeadResponse.ts            |   90.00 |    85.00 |   95.00 |   92.00
ResponseForm.tsx              |   88.00 |    82.00 |   90.00 |   89.00
ContactInfoForm.tsx           |   85.00 |    80.00 |   88.00 |   86.00
AvailabilityScheduler.tsx     |   85.00 |    78.00 |   87.00 |   84.00
PriceQuoteForm.tsx            |   86.00 |    81.00 |   89.00 |   87.00
ResponseHistory.tsx           |   90.00 |    88.00 |   92.00 |   91.00
LeadDetailModal.tsx           |   87.00 |    83.00 |   90.00 |   88.00
```

### Browser Console
When modal opens, you should see:

```
[MSW] Mocking enabled.
POST /v2/property-managers/1/leads/1/view 200 OK
GET /v2/leads/1/responses 200 OK
```

---

## ✅ Success Criteria

You've successfully tested the system when:

1. ✅ All 15+ unit tests pass
2. ✅ Can open lead modal in browser
3. ✅ Can submit all 4 response types
4. ✅ Form validation works correctly
5. ✅ Response history displays
6. ✅ View tracking fires on modal open
7. ✅ No console errors

---

## 🎉 Next Steps

Once testing is complete:

1. **Commit your changes**
```bash
git add .
git commit -m "feat: Complete Lead Response System with tests"
```

2. **Move to Phase 5: Document Templates**

3. **Deploy to staging** for user acceptance testing

---

## 💡 Pro Tips

1. **Use React Query DevTools** to debug queries:
   ```typescript
   import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
   ```

2. **Check Network Tab** for API call details

3. **Use MSW Browser DevTools** to see mocked requests

4. **Run tests in watch mode** while developing:
   ```bash
   npm test -- --watch
   ```

5. **Test on real devices** not just DevTools

---

**Questions?** Check `TESTING.md` for comprehensive guide or ask for help!
