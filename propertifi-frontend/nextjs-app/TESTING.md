# Lead Response System - Testing Guide

## Overview

This guide explains how to test the Lead Response System end-to-end, including unit tests, integration tests, and manual testing in development.

---

## Prerequisites

1. **Install Dependencies**

```bash
npm install
```

2. **Install MSW (Mock Service Worker)**

```bash
npm install msw --save-dev
```

3. **Install Testing Utilities** (if not already installed)

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

---

## Running Tests

### 1. Unit & Integration Tests

Run all tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm test -- --watch
```

Run specific test file:

```bash
npm test LeadResponseSystem
```

Run with coverage:

```bash
npm test -- --coverage
```

---

## Manual Testing with Mock Data

### Option 1: Using MSW in Development

1. **Enable MSW in Development** (Optional)

Add the following to `app/layout.tsx`:

```typescript
if (process.env.NODE_ENV === 'development') {
  if (typeof window !== 'undefined') {
    const { worker } = require('../mocks/browser');
    worker.start();
  }
}
```

2. **Start Development Server**

```bash
npm run dev
```

3. **Test the Flow**

- Navigate to `http://localhost:3000/property-manager` (after login)
- You should see 2 mock leads in the pipeline
- Click on any lead card to open the detail modal
- Test all 4 response types:
  - **Contact Info**: Fill phone/email and submit
  - **Availability**: Select date/time and submit
  - **Price Quote**: Enter amount, frequency, details
  - **Decline**: Write a polite message
- Check the "History" tab to see submitted responses

### Option 2: Using Real Backend API

1. **Start Backend Server**

Make sure your Laravel backend is running on `http://localhost:8000`

2. **Disable MSW**

Comment out or remove any MSW initialization code

3. **Test with Real Data**

- Create test leads in your database
- Test the complete flow with actual API calls

---

## Test Scenarios

### Scenario 1: Submit Contact Info Response

1. Open any "New" lead
2. Click "Respond" tab
3. Select "Share Contact Info" 📞
4. Fill required fields:
   - Message: "I'd love to manage your property..."
   - Phone: "555-123-4567"
   - Email: "pm@example.com"
5. Click "Send Response"
6. Verify:
   - Success message appears
   - Response appears in "History" tab
   - Lead status updates

### Scenario 2: Schedule Viewing

1. Open a lead
2. Select "Schedule Viewing" 📅
3. Fill fields:
   - Message: "Let's schedule a viewing..."
   - Date: Tomorrow
   - Time: 10:00 AM
   - Location: "Property address"
4. Submit and verify

### Scenario 3: Send Price Quote

1. Open a lead
2. Select "Send Quote" 💰
3. Fill fields:
   - Message: "Here's my competitive quote..."
   - Amount: 2000
   - Frequency: Monthly
   - Details: Detailed description (min 10 chars)
   - Add services: "Tenant Screening", "Maintenance"
4. Submit and verify

### Scenario 4: Decline Lead

1. Open a lead
2. Select "Not Interested" 👋
3. Write polite message
4. Submit and verify lead is marked as declined

### Scenario 5: View Response History

1. Open a lead that has responses (ID: 2 in mock data)
2. Go to "History" tab
3. Verify:
   - All responses are listed
   - Timestamps are correct
   - Details are expandable
   - Color coding by type

---

## Form Validation Tests

### Test Invalid Inputs

1. **Empty Message**
   - Try to submit without message
   - Should show: "Message must be at least 10 characters"

2. **Missing Contact Method**
   - Select "Contact Info"
   - Leave phone AND email empty
   - Should show: "At least one contact method is required"

3. **Invalid Email**
   - Enter "notanemail"
   - Should show: "Invalid email address"

4. **Missing Required Fields**
   - Select "Availability"
   - Leave date/time empty
   - Should show field-specific errors

5. **Invalid Quote Amount**
   - Select "Price Quote"
   - Enter negative number
   - Should show: "Amount must be positive"

---

## API Integration Tests

### Verify API Calls

Open browser DevTools Network tab and verify:

1. **View Tracking**
   - Open lead modal
   - Should call: `POST /v2/property-managers/1/leads/1/view`

2. **Submit Response**
   - Submit any response
   - Should call: `POST /v2/leads/1/responses`
   - Verify request body matches form data

3. **Load History**
   - Switch to History tab
   - Should call: `GET /v2/leads/1/responses`

4. **Cache Invalidation**
   - After submitting response
   - Lead list should refetch
   - Response history should refetch

---

## Accessibility Testing

1. **Keyboard Navigation**
   - Tab through all form fields
   - Use Enter to select response types
   - Verify all interactive elements are reachable

2. **Screen Reader**
   - Test with screen reader (e.g., NVDA, JAWS)
   - Verify labels are announced
   - Verify error messages are announced

3. **Color Contrast**
   - Use browser DevTools Accessibility panel
   - Verify all text meets WCAG AA standards

---

## Mobile Testing

Test responsive design on different screen sizes:

```bash
# Chrome DevTools
- iPhone SE (375px)
- iPad (768px)
- Desktop (1920px)
```

Verify:
- Modal is scrollable on small screens
- Forms are readable
- Buttons are tappable (min 44x44px)
- Tabs work on mobile

---

## Performance Testing

1. **Check Bundle Size**

```bash
npm run build
npm run analyze  # if you have bundle analyzer
```

2. **Check Lighthouse Score**

- Open Chrome DevTools
- Run Lighthouse audit
- Target: Performance > 90

3. **Check React Query DevTools**

```bash
# Install if needed
npm install @tanstack/react-query-devtools
```

Add to app:
```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<ReactQueryDevtools initialIsOpen={false} />
```

Verify:
- Queries are cached properly
- No unnecessary refetches
- Stale time is correct (2-5 minutes)

---

## Troubleshooting

### Tests Failing

1. **MSW Not Starting**
   - Check `jest.setup.ts` is configured
   - Verify `server.listen()` is called in beforeAll

2. **API Mocks Not Working**
   - Check base URL matches in `mocks/handlers.ts`
   - Verify request paths match exactly

3. **Form Validation Failing**
   - Check Zod schemas in `/lib/validations/leadResponse.ts`
   - Verify react-hook-form integration

### Development Issues

1. **Modal Not Opening**
   - Check `@headlessui/react` is installed
   - Verify `isOpen` state is managed correctly

2. **Forms Not Submitting**
   - Check React Query mutation
   - Verify API client is configured
   - Check network tab for errors

3. **View Tracking Not Working**
   - Verify `useAuth()` returns valid user ID
   - Check useEffect dependencies in LeadDetailModal

---

## CI/CD Integration

Add to `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## Test Coverage Goals

Target coverage:

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

Critical paths requiring 100% coverage:

- Form validation
- API mutations
- Error handling
- View tracking

---

## Next Steps

After testing the Lead Response System:

1. **Phase 5: Document Templates**
   - Template library
   - Download functionality

2. **Phase 6: Property Calculators**
   - ROI calculator
   - Chart visualizations

3. **Phase 7: SEO & Performance**
   - Meta tags
   - Sitemap generation

4. **Phase 8: Testing & Deployment**
   - E2E tests with Cypress
   - Production deployment

---

## Resources

- [React Testing Library Docs](https://testing-library.com/react)
- [MSW Documentation](https://mswjs.io/)
- [Jest Documentation](https://jestjs.io/)
- [React Query Testing](https://tanstack.com/query/latest/docs/react/guides/testing)
