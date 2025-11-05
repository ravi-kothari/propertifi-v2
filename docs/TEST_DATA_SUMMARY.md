# Test Data Summary

## Database Seeded Successfully!

The database has been populated with comprehensive test data for testing the Propertifi application.

## Test Users

All test users have the password: `password123`

### Admin Users (1)
| Name | Email | Role |
|------|-------|------|
| Admin User | admin@propertifi.com | Admin |

### Property Managers (5)

| Name | Email | Location | Units | Specialties | Verified |
|------|-------|----------|-------|-------------|----------|
| John Smith Property Management | john@smithpm.com | Los Angeles, CA | 250 | Single Family, Multi Family, Association | ✓ Featured |
| Sarah Johnson Properties | sarah@johnsonproperties.com | San Francisco, CA | 500 | Multi Family, Association, Commercial | ✓ Featured |
| Austin Elite Property Management | info@austinelitepm.com | Austin, TX | 180 | Single Family, Multi Family, Association | ✓ Featured |
| Manhattan Property Experts | contact@manhattanpm.com | New York, NY | 750 | Multi Family, Commercial | ✓ Featured |
| Miami Coastal Properties | info@miamicoastal.com | Miami, FL | 50 | Single Family, Multi Family, Association | Not Verified |

### Property Owners (3)

| Name | Email | Portfolio Type | Units |
|------|-------|----------------|-------|
| Robert Davis | robert@example.com | Single Family | 3 |
| Jennifer Martinez | jennifer@example.com | Multi Family | 12 |
| David Thompson | david@example.com | Mixed | 25 |

## Test Leads (8)

| Lead Name | Location | Property Type | Status | Quality Score | Distributed To |
|-----------|----------|---------------|--------|---------------|----------------|
| Michael Anderson | Los Angeles, CA | Multi Family (8 units) | New | 90 | 3 PMs |
| Susan Williams | San Francisco, CA | Single Family | Pending | 70 | 1 PM |
| James Martinez | Austin, TX | Multi Family (12 units) | New | 95 | Not Distributed |
| Corporate Properties LLC | New York, NY | Commercial (25 units) | Contacted | 85 | 1 PM |
| Sunset HOA Board | Miami, FL | Association (45 units) | New | 80 | Not Distributed |
| Quick Question | Los Angeles, CA | Single Family | New | 30 | Not Distributed |
| Patricia Brown | Los Angeles, CA | Multi Family (6 units) | Converted | 100 | 1 PM (Converted) |
| Richard Taylor | San Francisco, CA | Single Family | Lost | 60 | 1 PM (Lost) |

## Lead Distribution Summary

- **Total Leads**: 8
- **Distributed Leads**: 5
- **Total Distributions**: 12 (some leads distributed to multiple PMs)
- **Lead Statuses**: New, Pending, Contacted, Converted, Lost

## Database Statistics

- **Total Users**: 9 (1 Admin, 5 PMs, 3 Owners)
- **Total Leads**: 14
- **Total Lead Distributions**: 12
- **Verified Property Managers**: 4
- **Featured Property Managers**: 4

## Test Login Credentials

### Admin Access
```
Email: admin@propertifi.com
Password: password123
```

### Sample Property Manager
```
Email: john@smithpm.com
Password: password123
```

### Sample Owner
```
Email: robert@example.com
Password: password123
```

## Testing Scenarios

### High-Quality Leads
- **Michael Anderson** - Multi-family property, 90 quality score, distributed to 3 PMs
- **James Martinez** - Multi-family property, 95 quality score, not yet distributed

### Low-Quality Lead
- **Quick Question** - Minimal information, 30 quality score

### Commercial Lead
- **Corporate Properties LLC** - Large commercial property in NYC

### Lead Lifecycle Testing
- **Converted**: Patricia Brown (full conversion with notes)
- **Lost**: Richard Taylor (lost to competitor)
- **New**: Several leads for testing distribution

## Geographic Distribution

- **California**: 4 leads (Los Angeles: 3, San Francisco: 1)
- **Texas**: 1 lead (Austin)
- **New York**: 1 lead (Manhattan)
- **Florida**: 1 lead (Miami)

## Property Types Covered

- Single Family
- Multi Family
- Commercial
- Association (HOA)

## Next Steps

1. Test the frontend dashboards with real data
2. Test lead distribution system
3. Test property manager search and filtering
4. Test calculator save functionality with users
5. Test analytics with actual data points

## Database Reset

To reset and re-seed the database:

```bash
docker-compose exec backend php artisan migrate:fresh --seed
```

## Viewing Data

- **phpMyAdmin**: http://localhost:8080
- **MailHog** (email testing): http://localhost:8025

---

Generated: 2025-11-03
