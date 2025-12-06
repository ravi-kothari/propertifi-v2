# Propertifi E2E Testing Suite

This directory contains End-to-End (E2E) tests for the Propertifi application using Playwright.

## Setup

### Prerequisites

- Node.js 18+ installed
- Docker and Docker Compose installed
- Backend API running on `http://localhost:8000`
- Frontend running on `http://localhost:3000`

### Installation

```bash
# Install dependencies (Playwright is already in package.json)
npm install

# Install Playwright browsers
npx playwright install
```

### Test Environment

Tests use Docker services for isolated test database. Start test services:

```bash
cd ../../propertifi-backend
docker-compose -f docker-compose.test.yml up -d
```

## Running Tests

### Run All Tests

```bash
npm run test:e2e
```

### Run Specific Test Suite

```bash
# Authentication tests
npm run test:e2e -- e2e/auth

# Property Manager tests
npm run test:e2e -- e2e/property-manager

# Owner tests
npm run test:e2e -- e2e/owner
```

### Run Tests in UI Mode

```bash
npm run test:e2e:ui
```

### Run Tests in Headed Mode (See Browser)

```bash
npm run test:e2e:headed
```

### Run Tests in Debug Mode

```bash
npm run test:e2e:debug
```

### View Test Report

```bash
npm run test:e2e:report
```

## Test Structure

```
e2e/
├── auth/              # Authentication flows
│   ├── registration.spec.ts
│   ├── login.spec.ts
│   ├── logout.spec.ts
│   ├── password-reset.spec.ts
│   └── email-verification.spec.ts
├── property-manager/  # PM dashboard tests
│   ├── dashboard.spec.ts
│   ├── lead-viewing.spec.ts
│   ├── lead-response.spec.ts
│   └── analytics.spec.ts
├── owner/             # Owner flows
│   ├── lead-submission.spec.ts
│   └── dashboard.spec.ts
├── public/            # Public features
│   ├── document-templates.spec.ts
│   └── calculator.spec.ts
├── fixtures/          # Reusable test fixtures
│   ├── auth.fixture.ts
│   ├── api.fixture.ts
│   └── test-data.fixture.ts
├── helpers/           # Helper utilities
│   ├── api-helpers.ts
│   ├── dom-helpers.ts
│   └── navigation-helpers.ts
└── utils/             # Utility functions
    ├── test-data-generator.ts
    └── docker-helpers.ts
```

## Configuration

### Playwright Configuration

See `playwright.config.ts` in the project root for:
- Browser configurations
- Test timeout settings
- Screenshot/video capture on failure
- Base URL configuration

### Environment Variables

Test environment variables are configured in `.env.testing` (if needed):
- `PLAYWRIGHT_TEST_BASE_URL` - Frontend URL
- `NEXT_PUBLIC_API_URL` - Backend API URL
- Test database connection details

## Test Data

Tests use generated test data via `TestDataGenerator`:
- Test users (PM, Owner, Admin)
- Test leads with various property types
- Sample response data

## Writing Tests

### Using Fixtures

Tests use Playwright fixtures for authentication and helpers:

```typescript
import { test, expect, login } from '../fixtures/auth.fixture';

test('example test', async ({ page, nav, dom, api }) => {
  // Use helpers
  await nav.goto('/property-manager');
  await dom.fillField('input[name="email"]', 'test@example.com');
  await api.waitForEndpoint('/api/v2/leads');
});
```

### Page Object Pattern

Consider using Page Objects for complex pages:

```typescript
class LoginPage {
  constructor(private page: Page) {}
  
  async login(email: string, password: string) {
    await this.page.fill('input[name="email"]', email);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('button[type="submit"]');
  }
}
```

## Best Practices

1. **Keep tests independent** - Each test should work in isolation
2. **Use meaningful test descriptions** - Clear test names help debugging
3. **Wait for elements properly** - Use Playwright's auto-waiting
4. **Handle async operations** - Wait for API calls and navigation
5. **Use test.skip() for incomplete features** - Don't break CI for unimplemented features
6. **Capture screenshots on failure** - Configured automatically in `playwright.config.ts`

## CI/CD Integration

Tests are configured to run in GitHub Actions. See `.github/workflows/e2e-tests.yml` for CI configuration.

## Troubleshooting

### Tests Timing Out

- Check if backend/frontend servers are running
- Increase timeout in `playwright.config.ts`
- Check network requests in browser DevTools

### Flaky Tests

- Add explicit waits for dynamic content
- Use `waitForLoadState('networkidle')`
- Check for race conditions in test logic

### Docker Services Not Starting

- Verify Docker is running
- Check port conflicts (33061, 6380, etc.)
- Review `docker-compose.test.yml` configuration

## Next Steps

- Add more test coverage for Owner flows
- Implement public feature tests (templates, calculator)
- Add error scenario tests
- Set up visual regression testing
- Configure performance testing









