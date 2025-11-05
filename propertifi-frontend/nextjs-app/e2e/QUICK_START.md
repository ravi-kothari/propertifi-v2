# E2E Tests - Quick Start Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Backend API running on port 8000
- Frontend running on port 3000

### First Time Setup

```bash
# Navigate to frontend directory
cd propertifi-frontend/nextjs-app

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Start backend (in another terminal)
cd ../../propertifi-backend
docker-compose up -d
php artisan serve

# Start frontend (in another terminal)
cd ../propertifi-frontend/nextjs-app
npm run dev
```

### Run Tests

```bash
# Run all tests
npm run test:e2e

# Run specific test suite
npm run test:e2e -- e2e/auth

# Run in UI mode (interactive)
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed
```

## 📊 Test Summary

- **Total Tests:** 560 (across 5 browsers)
- **Test Files:** 16
- **Categories:** Authentication, PM Dashboard, Owner, Public Features, Errors

## 🔧 Troubleshooting

### Tests Fail to Connect
- ✅ Check backend is running: `curl http://localhost:8000/api/health`
- ✅ Check frontend is running: `curl http://localhost:3000`
- ✅ Verify ports are not in use: `lsof -i :3000 :8000`

### Tests Timeout
- ✅ Increase timeout in `playwright.config.ts`
- ✅ Check network requests in browser DevTools
- ✅ Verify API endpoints are responding

### Email Verification Errors
- ✅ Create verified test users in database
- ✅ Or bypass email verification in test environment

## 📝 Test Structure

```
e2e/
├── auth/              # Authentication tests
├── property-manager/  # PM dashboard tests  
├── owner/             # Owner flow tests
├── public/            # Public feature tests
├── errors/            # Error handling tests
├── fixtures/          # Reusable test fixtures
├── helpers/           # Helper utilities
└── utils/             # Utility functions
```

## 🎯 Key Test Flows

1. **Authentication:** Registration → Login → Logout
2. **PM Dashboard:** View Leads → Open Detail → Respond
3. **Analytics:** View Metrics → Filter by Date → Export
4. **Templates:** Browse → Filter → Download
5. **Calculator:** Fill Form → Calculate → View Results

---

**For detailed documentation, see `README.md` and `TEST_REVIEW.md`**







