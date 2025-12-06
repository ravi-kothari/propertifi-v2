# Propertifi Backend Documentation

**Last Updated:** 2025-11-24
**Laravel Version:** Latest
**API Version:** V2

This directory contains backend-specific documentation for the Propertifi Laravel API.

---

## 📁 Documentation Structure

### 📘 [API Documentation](./api/)
API endpoint documentation and implementation details
- **AUTH_API_DOCUMENTATION.md** - V2 Authentication API (8 endpoints)
  - Registration, login, logout
  - Password reset flow
  - Email verification
  - Complete request/response examples
- **LEAD_RESPONSE_IMPLEMENTATION.md** - Lead response system
  - PM response endpoints
  - Lead feedback tracking
  - Response workflow

### 📗 [Guides](./guides/)
Backend development and operational guides
- **TESTING_QUICK_START.md** - API testing with curl commands
  - Quick test examples for all major endpoints
  - Authentication flow testing
  - Lead management testing

### 📦 [Archive](./archive/)
Historical backend documentation
- **obsolete_CURRENT_STATUS.md** - Historical status snapshot (Nov 2025)
- **obsolete_PHASE_COMPLETION_SUMMARY.md** - Historical phase completion

---

## 🚀 Quick Start

### For New Backend Developers
1. Review API documentation in `api/` folder
2. Test endpoints using `guides/TESTING_QUICK_START.md`
3. Check main project docs at `/docs/` for overall architecture

### Testing the API
```bash
# Navigate to backend directory
cd propertifi-backend

# Test authentication
curl -X POST http://localhost:8000/api/v2/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","password_confirmation":"password123"}'

# See guides/TESTING_QUICK_START.md for more examples
```

---

## 📚 Key Documentation

### Authentication & Authorization
- **api/AUTH_API_DOCUMENTATION.md** - Complete V2 auth system
  - All 8 auth endpoints documented
  - Laravel Sanctum integration
  - Token-based authentication

### Lead Management
- **api/LEAD_RESPONSE_IMPLEMENTATION.md** - Lead response system
  - How PMs respond to leads
  - Feedback and tracking
  - Status management

### Testing
- **guides/TESTING_QUICK_START.md** - Quick testing guide
  - Curl command examples
  - Common test scenarios
  - Endpoint verification

---

## 🔗 Related Documentation

### Main Project Documentation
- [/docs/](../../docs/) - Main documentation directory
- [/docs/strategy/](../../docs/strategy/) - Product strategy and roadmaps
- [/docs/technical/](../../docs/technical/) - Technical implementation docs

### Frontend Documentation
- [/propertifi-frontend/nextjs-app/e2e/](../../propertifi-frontend/nextjs-app/e2e/) - E2E tests

### Other Backend Resources
- [QUEUE_WORKER_GUIDE.md](./guides/QUEUE_WORKER_GUIDE.md) - Queue worker setup (if exists)
- Database migrations in `/database/migrations/`
- API routes in `/routes/api.php`

---

## 🛠️ Development Workflow

### API Development
1. Create routes in `routes/api.php`
2. Create controllers in `app/Http/Controllers/Api/V2/`
3. Create models in `app/Models/`
4. Create migrations in `database/migrations/`
5. Document in appropriate docs file
6. Test with curl or Postman
7. Write tests in `tests/`

### Common Tasks
- **Add new API endpoint** → Update api.php, create controller, document
- **Database change** → Create migration, update models, test
- **Auth changes** → Review AUTH_API_DOCUMENTATION.md, update

---

## 📊 API Status

### Implemented Features
- ✅ V2 Authentication API (complete)
- ✅ Lead Management System
- ✅ Lead Response & Feedback
- ✅ Property Manager Preferences
- ✅ Lead Distribution & Matching
- ✅ AI Lead Scoring
- ✅ WebSocket Notifications
- ✅ Queue Workers for background jobs

### API Versions
- **V1** - Legacy endpoints (being phased out)
- **V2** - Current API version (use this for new development)

---

## 🧪 Testing

### Quick API Tests
See `guides/TESTING_QUICK_START.md` for curl command examples.

### Unit Tests
```bash
# Run all tests
php artisan test

# Run specific test
php artisan test --filter=AuthTest
```

### Database Testing
```bash
# Refresh database with test data
php artisan migrate:fresh --seed

# Create specific test data
php artisan db:seed --class=TestDataSeeder
```

---

## 📝 Documentation Standards

### API Documentation Format
```markdown
## Endpoint Name

**Method:** POST/GET/PUT/DELETE
**URL:** /api/v2/endpoint
**Auth Required:** Yes/No

### Request
{
  "field": "value"
}

### Response
{
  "success": true,
  "data": {}
}

### Error Responses
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
```

### When to Document
- New API endpoints
- Significant changes to existing endpoints
- New backend features
- Database schema changes
- Queue jobs and workers

---

## 🔧 Common Issues

### API Not Responding
1. Check Docker containers are running
2. Verify .env configuration
3. Check Laravel logs in `storage/logs/laravel.log`

### Authentication Errors
1. Check Sanctum configuration
2. Verify CORS settings in `config/cors.php`
3. Check token expiration

### Database Issues
1. Run migrations: `php artisan migrate`
2. Check database connection in .env
3. Verify MySQL container is running

---

## 📞 Getting Help

### For API Questions
- Check `api/` folder for endpoint documentation
- Review Laravel docs: https://laravel.com/docs
- Check Sanctum docs: https://laravel.com/docs/sanctum

### For Testing Questions
- See `guides/TESTING_QUICK_START.md`
- Review test files in `tests/`

### For Architecture Questions
- See main project docs at `/docs/strategy/`
- Review `propertifi-v2-backend-implementation.md` (if exists)

---

**Maintained by:** Backend Development Team
**API Base URL:** http://localhost:8000/api/v2
**Documentation Health:** ✅ Current and organized
