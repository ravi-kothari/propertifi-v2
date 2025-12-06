# Propertifi v2 Frontend Development Plan

**Document Created:** 2025-10-29
**Status:** Planning Phase
**Backend Status:** Phases 1-5 Complete (30+ API v2 endpoints ready)

---

## Executive Summary

This document outlines the comprehensive frontend development strategy for Propertifi v2, based on analysis of the backend API readiness and the frontend implementation guide. The plan identifies critical blockers, recommends development sequence, and provides a roadmap for MVP and post-launch features.

### Critical Finding
**Authentication APIs Missing** - The most critical gap blocking User Dashboard development. Must be implemented before proceeding with protected routes and user-specific features.

---

## Table of Contents

1. [Backend API Readiness Assessment](#backend-api-readiness-assessment)
2. [Recommended Development Sequence](#recommended-development-sequence)
3. [Backend-Frontend Integration Mapping](#backend-frontend-integration-mapping)
4. [Critical Path Dependencies](#critical-path-dependencies)
5. [MVP vs Post-Launch Features](#mvp-vs-post-launch-features)
6. [Risk Assessment](#risk-assessment)
7. [Implementation Roadmap](#implementation-roadmap)
8. [Sprint Planning](#sprint-planning)

---

## Backend API Readiness Assessment

### ✅ Completed Backend APIs (Ready for Integration)

**Authentication APIs**
- User registration endpoint
- Login/logout endpoints
- JWT or session management

**Lead Distribution System** (`/api/v2/leads/...`)
- `GET /api/v2/leads/{id}/matches` - Preview matching PMs
- `POST /api/v2/leads/{id}/distribute` - Initial distribution
- `POST /api/v2/leads/{id}/redistribute` - Additional distribution
- `GET /api/v2/leads/{id}/distribution-stats` - Analytics
- Features: 100-point scoring algorithm, tier-based priority, geographic matching

**Property Manager Lead Management** (`/api/v2/property-managers/...`)
- `GET /api/v2/property-managers/{pmId}/leads` - PM dashboard leads
- `POST /api/v2/property-managers/{pmId}/leads/{leadId}/view` - Track views
- Features: Lead pipeline, view tracking, response management

**Analytics Service** (`/api/v2/analytics/...`)
- Dashboard overview with real-time stats
- Conversion funnel analysis (5-stage)
- PM performance metrics
- Template download statistics
- Time-series data aggregation

**Document Templates** (`/api/v2/templates/...`)
- Full CRUD operations
- Template filtering by category/state
- Download tracking with rate limiting
- Free vs gated templates

**User Preferences** (`/api/v2/preferences/...`)
- Property type preferences
- Unit count ranges
- Geographic preferences (zip codes + radius)
- Notification settings

**Lead Responses** (`/api/v2/responses/...`)
- Response type tracking (interested, not_interested, need_more_info, contact_requested)
- Contact information capture
- Availability scheduling
- Price quoting
- Response analytics

### ❌ Critical Gaps (Blocking Development)

**Authentication APIs** (CRITICAL - Blocks Phase 4)
- User registration endpoint
- Login/logout endpoints
- JWT or session management
- Password reset flow
- Email verification
- Role-based access control (Owner vs PM roles)
- User profile management
- Token refresh mechanism

**Legal Content APIs** (Blocks Phase 2 - Legal Center)
- `GET /api/legal/states` - List all states with law summaries
- `GET /api/legal/states/{state}` - Detailed state laws
- `GET /api/legal/topics` - Legal topics/categories
- `GET /api/legal/content/{id}` - Specific legal content
- Admin endpoints for content management

**Calculator Storage APIs** (Blocks Phase 3 save functionality)
- `POST /api/calculators/save` - Save calculation results
- `GET /api/calculators/history` - User calculation history
- `GET /api/calculators/{id}` - Retrieve saved calculation

**Owner-Specific APIs** (Blocks Owner Dashboard)
- Lead submission endpoints
- Lead history for owners
- Owner preferences management
- Owner-PM communication

---

## Recommended Development Sequence

### Phase Priority with Rationale

**1. Phase 1: Project Setup & Architecture** (Week 1)
- **Rationale:** Foundational requirement for all subsequent work
- **Deliverables:**
  - Next.js 14+ project initialization with App Router
  - TypeScript configuration
  - Tailwind CSS with custom design system
  - Basic SEO setup (next-seo, meta tags)
  - API client configuration (React Query)
  - Folder structure setup
  - Environment configuration
  - Development workflow (ESLint, Prettier)

**2. Authentication Backend Implementation** (Week 2)
- **Rationale:** Critical blocker for Phase 4 (PM Dashboard) - MVP core feature
- **Priority:** CRITICAL
- **Deliverables:**
  - User registration/login/logout endpoints
  - JWT authentication with refresh tokens
  - Password reset flow
  - Email verification system
  - Role-based middleware (Owner/PM/Admin)
  - User profile CRUD endpoints
  - Session management

**3. Phase 4: Property Manager Dashboard** (Weeks 3-5)
- **Rationale:** Highest value delivery, leverages most completed backend APIs
- **Priority:** HIGH (MVP Core)
- **Focus Order:**
  1. **PM Dashboard Core** (Week 3)
     - Authentication integration
     - Lead pipeline view (new/viewed/responded)
     - Lead detail modal
     - Basic response functionality
  2. **Lead Management** (Week 4)
     - Response submission
     - Contact information forms
     - Lead filtering and sorting
     - View tracking integration
  3. **Analytics Dashboard** (Week 5)
     - Performance metrics display
     - Conversion funnel visualization
     - Response rate tracking
     - Lead distribution stats

**4. Phase 2: Document Templates** (Week 6)
- **Rationale:** Direct backend integration ready, tangible user value
- **Priority:** MEDIUM (MVP Enhancement)
- **Deliverables:**
  - Template library with filtering
  - Download functionality with tracking
  - Free template access (no gating for MVP)
  - Category/state filtering
  - Search functionality

**5. Phase 3: Property Calculators** (Week 7)
- **Rationale:** Client-side functionality, minimal backend dependency
- **Priority:** MEDIUM (Post-MVP)
- **Deliverables:**
  - ROI calculator with Chart.js
  - Client-side calculation logic
  - Print/export functionality
  - Responsive design
  - (Save functionality deferred until Calculator Storage APIs ready)

**6. Phase 5: SEO & Performance Optimization** (Week 8)
- **Rationale:** Pre-launch optimization for visibility
- **Priority:** HIGH (Pre-Launch)
- **Deliverables:**
  - Dynamic sitemap generation
  - Structured data (JSON-LD)
  - Meta tag optimization
  - Image optimization
  - Performance audit and fixes
  - Lighthouse score optimization

**7. Phase 6: Testing & Deployment** (Week 9)
- **Rationale:** Launch readiness
- **Priority:** HIGH (Pre-Launch)
- **Deliverables:**
  - E2E testing suite (Playwright/Cypress)
  - Unit tests for critical components
  - Integration tests for API calls
  - Deployment configuration
  - CI/CD pipeline setup
  - Staging environment testing

---

## Backend-Frontend Integration Mapping

### Ready for Integration (✅ Green Light)

| Frontend Component | Backend Endpoint | Status | Notes |
|---|---|---|---|
| **PM Lead Pipeline** | `GET /property-managers/{pmId}/leads` | ✅ Ready | Fully functional with filtering |
| **Lead Detail View** | `GET /leads/{id}` | ✅ Ready | Complete lead information |
| **Lead Matching Preview** | `GET /leads/{id}/matches` | ✅ Ready | 100-point scoring display |
| **Lead Distribution** | `POST /leads/{id}/distribute` | ✅ Ready | Intelligent matching |
| **View Tracking** | `POST /property-managers/{pmId}/leads/{leadId}/view` | ✅ Ready | Analytics integration |
| **Response Submission** | `POST /responses` | ✅ Ready | Multi-type responses |
| **Dashboard Analytics** | `GET /analytics/dashboard` | ✅ Ready | Real-time stats |
| **Conversion Funnel** | `GET /analytics/funnel` | ✅ Ready | 5-stage visualization |
| **PM Performance** | `GET /analytics/pm/{pmId}` | ✅ Ready | Individual metrics |
| **Template Library** | `GET /templates` | ✅ Ready | Filtering + pagination |
| **Template Download** | `GET /templates/{id}/download` | ✅ Ready | Rate limiting active |
| **User Preferences** | `GET/PUT /preferences` | ✅ Ready | CRUD operations |

### Critical Gaps (❌ Blocking)

| Frontend Feature | Required Backend | Status | Impact |
|---|---|---|---|
| **All Protected Routes** | Authentication APIs | ❌ Missing | CRITICAL - Blocks entire dashboard |
| **User Registration** | `POST /auth/register` | ❌ Missing | CRITICAL - No user onboarding |
| **User Login** | `POST /auth/login` | ❌ Missing | CRITICAL - No access control |
| **State Laws Pages** | `GET /legal/states/{state}` | ❌ Missing | Blocks Legal Center |
| **Interactive State Map** | `GET /legal/states` | ❌ Missing | Blocks Legal Center |
| **Calculator Save** | `POST /calculators/save` | ❌ Missing | Limits calculator utility |
| **Owner Dashboard** | Owner-specific endpoints | ❌ Missing | Blocks owner features |
| **Lead Submission** | `POST /leads/submit` | ❌ Missing | Blocks owner lead creation |

### Partial Gaps (⚠️ Workaround Available)

| Frontend Feature | Backend Gap | Workaround | Priority |
|---|---|---|---|
| **Legal Center Content** | Content APIs missing | Use static content for MVP states | Medium |
| **Dynamic Sitemap** | Multiple content APIs | Generate static sitemap initially | Low |
| **Owner Lead History** | Owner endpoints missing | Focus on PM dashboard first | Medium |

---

## Critical Path Dependencies

### Dependency Chain Analysis
Authentication APIs (Week 2) ↓ PM Dashboard Access (Week 3) ↓ Lead Pipeline Display (Week 3) ↓ Response Management (Week 4) ↓ Analytics Integration (Week 5) ↓ MVP Launch Ready

### Blocking Dependencies

**Level 1 - Critical (Blocks MVP)**
1. **Authentication System**
   - Blocks: All user dashboards, protected routes, role-based features
   - Impact: Cannot launch MVP without this
   - Timeline: Must complete by end of Week 2

**Level 2 - High (Blocks Major Features)**
2. **Legal Content APIs**
   - Blocks: Full Legal Resource Center implementation
   - Impact: Can launch with static content workaround
   - Timeline: Can defer to post-MVP

3. **Owner-Specific APIs**
   - Blocks: Owner dashboard, lead submission
   - Impact: Can launch with PM-only features
   - Timeline: Can defer to Phase 2 launch

**Level 3 - Medium (Limits Functionality)**
4. **Calculator Storage APIs**
   - Blocks: Save/load calculator results
   - Impact: Calculator works without save feature
   - Timeline: Post-MVP enhancement

---

## MVP vs Post-Launch Features

### MVP (Minimum Viable Product) - Target: Week 8

**Core Features (Must Have)**
- ✅ User authentication (registration, login, logout)
- ✅ PM Dashboard with lead pipeline
- ✅ Lead detail view with full information
- ✅ PM response submission (interested/not interested/need info)
- ✅ Basic performance analytics
- ✅ Document template library (view & download)
- ✅ Basic SEO (meta tags, static sitemap)
- ✅ Responsive design (mobile-first)

**Technical Requirements**
- Next.js 14+ with App Router
- TypeScript with strict mode
- Tailwind CSS styling
- React Query for API integration
- JWT authentication
- Role-based access control (PM role only for MVP)
- Error handling and loading states
- Basic analytics tracking

**Acceptance Criteria**
- Property Manager can register and log in
- PM can view assigned leads in pipeline
- PM can respond to leads with contact information
- PM can view their performance metrics
- PM can download free document templates
- All pages are mobile-responsive
- Page load time < 3 seconds
- Lighthouse score > 85

### Post-Launch Features (Phase 2)

**Owner Dashboard** (Weeks 9-11)
- Owner registration and authentication
- Lead submission form
- Lead tracking and history
- PM contact management
- Notifications for PM responses

**Advanced PM Features** (Weeks 12-14)
- Calendar integration
- Availability scheduling
- Revenue tracking
- Team management (for PM companies)
- Advanced analytics (trend analysis, forecasting)
- Lead pipeline drag-and-drop
- Bulk actions on leads

**Legal Resource Center** (Weeks 15-17)
- Interactive state map with hover states
- Comprehensive state law pages (all 50 states)
- Legal topic categorization
- Search functionality
- Content filtering
- Bookmark/favorite functionality

**Property Calculators** (Week 18)
- ROI calculator with save/load
- Calculation history
- Share calculations via link
- Export to PDF
- Additional calculators (cash flow, cap rate, etc.)

**Advanced SEO** (Week 19)
- Fully dynamic sitemap
- Advanced structured data
- Blog integration
- Case studies pages
- Testimonials system

**Admin Portal** (Weeks 20-22)
- User management
- Lead distribution monitoring
- Content management (legal content)
- Analytics dashboard (platform-wide)
- Template management
- System configuration

---

## Risk Assessment

### Critical Risks

| Risk | Severity | Probability | Impact | Mitigation Strategy |
|---|---|---|---|---|
| **Authentication APIs not implemented** | CRITICAL | High | Blocks entire MVP | Immediate action required - prioritize as Week 2 sprint |
| **Backend-Frontend API contract mismatch** | HIGH | Medium | Integration delays | Create API documentation, use TypeScript types, conduct integration testing |
| **Performance issues with lead pipeline** | MEDIUM | Medium | Poor UX for PMs | Implement pagination, infinite scroll, optimize queries |
| **Mobile responsiveness gaps** | MEDIUM | Low | Poor mobile experience | Mobile-first design, testing on multiple devices |
| **SEO implementation incomplete** | LOW | Low | Reduced organic traffic | Basic SEO in Phase 1, advanced in Phase 5 |

### Dependency Risks

| Dependency | Risk | Mitigation |
|---|---|---|
| **Legal Content APIs** | Medium - Blocks Legal Center | Use static content for MVP (5-10 states), build API-ready components |
| **Calculator Storage APIs** | Low - Limits calculator utility | Launch calculator without save feature, client-side only |
| **Owner APIs** | Medium - Blocks owner features | Launch PM-focused MVP first, add owner features in Phase 2 |
| **Third-party integrations** | Low - Calendar, maps, etc. | Use basic implementations, upgrade post-launch |

### Technical Risks

| Risk Area | Concern | Mitigation |
|---|---|---|
| **React Query Learning Curve** | Team unfamiliarity | Create reusable hooks, document patterns, provide training |
| **Next.js 14 App Router** | New paradigm vs Pages Router | Follow official docs, use TypeScript, create template components |
| **State Management Complexity** | Lead pipeline state, filters | Use React Query for server state, minimal client state |
| **Authentication Security** | JWT implementation, XSS/CSRF | Follow OWASP guidelines, use httpOnly cookies, implement CSRF tokens |
| **API Rate Limiting** | Template downloads, API calls | Implement client-side throttling, show clear error messages |

---

## Implementation Roadmap

### Week 1: Project Setup & Architecture

**Goals:**
- Initialize Next.js project with proper configuration
- Set up development environment
- Establish code standards and workflow

**Tasks:**
1. Create Next.js 14+ project with TypeScript
2. Configure Tailwind CSS with custom theme
3. Set up folder structure (app/, components/, lib/)
4. Configure React Query and API client
5. Install dependencies (next-seo, framer-motion, etc.)
6. Set up ESLint and Prettier
7. Configure environment variables
8. Create base layout components
9. Implement basic SEO setup
10. Set up Git workflow and branching strategy

**Deliverables:**
- ✅ Working Next.js project
- ✅ Development environment configured
- ✅ Basic layout and navigation
- ✅ API client ready for integration
- ✅ Code quality tools configured

**Success Metrics:**
- Project builds without errors
- Development server runs successfully
- All dependencies installed and working
- Team can run project locally

---

### Week 2: Authentication Backend Implementation

**Goals:**
- Implement complete authentication system (backend)
- Enable user registration and login
- Set up role-based access control

**Backend Tasks:**
1. Create authentication migrations (users table updates)
2. Create User model with roles (Owner, PM, Admin)
3. Implement registration endpoint (`POST /api/v2/auth/register`)
4. Implement login endpoint (`POST /api/v2/auth/login`)
5. Implement logout endpoint (`POST /api/v2/auth/logout`)
6. Set up JWT token generation and validation
7. Create token refresh endpoint
8. Implement password reset flow
9. Create email verification system
10. Add role-based middleware
11. Create user profile endpoints (GET/PUT `/api/v2/user/profile`)
12. Add authentication tests

### API Endpoints to Create

- `POST /api/v2/auth/register` - User registration
- `POST /api/v2/auth/login` - User login
- `POST /api/v2/auth/logout` - User logout
- `POST /api/v2/auth/refresh` - Refresh JWT token
- `POST /api/v2/auth/forgot-password` - Request password reset
- `POST /api/v2/auth/reset-password` - Reset password with token
- `POST /api/v2/auth/verify-email` - Verify email address
- `GET /api/v2/auth/me` - Get authenticated user
- `PUT /api/v2/auth/profile` - Update user profile
- `PUT /api/v2/auth/password` - Change password


**Deliverables:**
- ✅ Complete authentication API
- ✅ JWT token system working
- ✅ Role-based access control
- ✅ Email verification flow
- ✅ Password reset functionality
- ✅ API tests passing

**Success Metrics:**
- Can register new PM user
- Can log in and receive JWT token
- Token validates correctly
- Role middleware blocks unauthorized access
- Email verification works
- Password reset works

---

### Week 3: PM Dashboard Core

**Goals:**
- Build authenticated PM dashboard
- Display lead pipeline
- Implement lead detail view

**Frontend Tasks:**
1. Create authentication context/hooks
2. Implement login page
3. Implement registration page
4. Create protected route wrapper
5. Build PM dashboard layout
6. Implement lead pipeline component
7. Create lead card component
8. Build lead detail modal
9. Add lead status indicators
10. Implement basic filtering (status, date)
11. Add error handling for API calls
12. Create loading states

components/
├── auth/
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   └── ProtectedRoute.tsx
├── dashboard/
│   ├── DashboardLayout.tsx
│   ├── DashboardHeader.tsx
│   └── DashboardSidebar.tsx
├── leads/
│   ├── LeadPipeline.tsx
│   ├── LeadCard.tsx
│   ├── LeadDetail.tsx
│   └── LeadFilters.tsx
└── ui/
    ├── Button.tsx
    ├── Modal.tsx
    ├── Badge.tsx
    └── LoadingSpinner.tsx


**Pages to Create:**
app/
├── (auth)/
│   ├── login/page.tsx
│   └── register/page.tsx
└── (dashboard)/
    └── property-manager/
        ├── layout.tsx
        └── page.tsx

**Deliverables:**
- ✅ Working login/registration flow
- ✅ PM dashboard with lead pipeline
- ✅ Lead cards showing key information
- ✅ Lead detail modal
- ✅ Basic filtering functionality
- ✅ Responsive design

**Success Metrics:**
- PM can register and log in
- Dashboard displays assigned leads
- Lead cards show property details
- Modal shows full lead information
- Filters update lead display
- Works on mobile devices

---

### Week 4: Lead Management

**Goals:**
- Implement PM response functionality
- Add lead interaction features
- Integrate view tracking

**Frontend Tasks:**
1. Create response submission form
2. Build response type selector (interested/not interested/need info/contact requested)
3. Implement contact information form
4. Add availability scheduling UI
5. Create price quoting form
6. Add response success/error feedback
7. Implement view tracking on lead open
8. Add response history display
9. Create lead notes functionality
10. Add lead action buttons (respond, skip, save)
11. Implement optimistic UI updates
12. Add form validation

**Components to Create:**
components/
├── leads/
│   ├── ResponseForm.tsx
│   ├── ResponseTypeSelector.tsx
│   ├── ContactInfoForm.tsx
│   ├── AvailabilityScheduler.tsx
│   ├── PriceQuoteForm.tsx
│   ├── ResponseHistory.tsx
│   └── LeadNotes.tsx


**API Integrations:**
POST /api/v2/property-managers/{pmId}/leads/{leadId}/view POST /api/v2/responses GET /api/v2/leads/{id}/responses


**Deliverables:**
- ✅ Complete response submission flow
- ✅ All response types functional
- ✅ Contact information capture
- ✅ View tracking working
- ✅ Response history visible
- ✅ Form validation working

**Success Metrics:**
- PM can submit all response types
- Contact information saves correctly
- View tracking records correctly
- Response appears in history immediately
- Validation prevents invalid submissions
- Loading states provide good UX

---

### Week 5: Analytics Dashboard

**Goals:**
- Display PM performance metrics
- Show conversion funnel
- Integrate analytics visualizations

**Frontend Tasks:**
1. Create analytics dashboard page
2. Build metrics cards (total leads, response rate, avg response time)
3. Implement conversion funnel visualization
4. Create response rate chart (Chart.js)
5. Add lead distribution stats
6. Build time-series charts (leads over time)
7. Add date range selector
8. Create export functionality (CSV/PDF)
9. Add comparison metrics (vs previous period)
10. Implement real-time stat updates
11. Create mobile-friendly analytics view

**Components to Create:**
ccomponents/
├── analytics/
│   ├── AnalyticsDashboard.tsx
│   ├── MetricsCard.tsx
│   ├── ConversionFunnel.tsx
│   ├── ResponseRateChart.tsx
│   ├── TimeSeriesChart.tsx
│   ├── DateRangeSelector.tsx
│   └── ExportButton.tsx

**Pages to Create:**
app/
└── (dashboard)/
    └── property-manager/
        └── analytics/page.tsx


**API Integrations:**
GET /api/v2/analytics/dashboard GET /api/v2/analytics/funnel GET /api/v2/analytics/pm/{pmId} GET /api/v2/analytics/time-series


**Deliverables:**
- ✅ Analytics dashboard page
- ✅ Key metrics displayed
- ✅ Conversion funnel visualization
- ✅ Charts with real data
- ✅ Date range filtering
- ✅ Export functionality

**Success Metrics:**
- Metrics load within 2 seconds
- Charts display correctly
- Date range filtering works
- Export generates correct files
- Mobile view is readable
- Real-time updates work

---

### Week 6: Document Templates

**Goals:**
- Build template library interface
- Implement download functionality
- Add filtering and search

**Frontend Tasks:**
1. Create template library page
2. Build template grid/list view
3. Create template card component
4. Implement category filtering
5. Add state filtering
6. Create search functionality
7. Build template detail modal
8. Implement download tracking
9. Add download button with rate limiting feedback
10. Create "recently downloaded" section
11. Add template preview (if applicable)
12. Implement pagination

**Components to Create:**
components/
├── templates/
│   ├── TemplateLibrary.tsx
│   ├── TemplateGrid.tsx
│   ├── TemplateCard.tsx
│   ├── TemplateFilters.tsx
│   ├── TemplateSearch.tsx
│   ├── TemplateDetail.tsx
│   └── DownloadButton.tsx


**Pages to Create:**
app/
└── (marketing)/
    └── templates/
        ├── page.tsx
        └── [id]/page.tsx

**API Integrations:**
GET /api/v2/templates GET /api/v2/templates/{id} GET /api/v2/templates/{id}/download GET /api/v2/templates/categories


**Deliverables:**
- ✅ Template library page
- ✅ Template cards with previews
- ✅ Filtering by category/state
- ✅ Search functionality
- ✅ Download tracking
- ✅ Rate limiting feedback

**Success Metrics:**
- Templates load quickly
- Filtering works smoothly
- Search returns relevant results
- Downloads track correctly
- Rate limiting displays clearly
- Pagination works

---

### Week 7: Property Calculators

**Goals:**
- Build ROI calculator
- Implement chart visualizations
- Add print/export functionality

**Frontend Tasks:**
1. Create ROI calculator page
2. Build calculator input form
3. Implement calculation logic
4. Create results display component
5. Add Chart.js visualizations (ROI chart, cash flow chart)
6. Implement print functionality
7. Add export to PDF
8. Create responsive calculator layout
9. Add input validation
10. Create tooltips for complex inputs
11. Add calculator examples/presets

**Components to Create:**
components/
├── calculators/
│   ├── ROICalSculator.tsx
│   ├── CalculatorForm.tsx
│   ├── CalculatorResults.tsx
│   ├── ROIChart.tsx
│   ├── CashFlowChart.tsx
│   ├── PrintButton.tsx
│   └── ExportPDFButton.tsx


**Pages to Create:**
app/
└── (marketing)/
    └── calculators/
        └── roi/page.tsx


**Deliverables:**
- ✅ Working ROI calculator
- ✅ Accurate calculations
- ✅ Chart visualizations
- ✅ Print functionality
- ✅ PDF export
- ✅ Mobile-responsive

**Success Metrics:**
- Calculations are accurate
- Charts update in real-time
- Print layout is clean
- PDF exports correctly
- Mobile inputs work well
- Validation prevents errors

---

### Week 8: SEO & Performance Optimization

**Goals:**
- Optimize for search engines
- Improve page performance
- Generate sitemap and structured data

**Frontend Tasks:**
1. Implement dynamic meta tags for all pages
2. Create sitemap generation (static for MVP)
3. Add structured data (JSON-LD) to key pages
4. Optimize images (next/image)
5. Implement lazy loading
6. Add Open Graph tags
7. Create robots.txt
8. Run Lighthouse audits
9. Fix accessibility issues
10. Optimize bundle size
11. Implement code splitting
12. Add performance monitoring

**SEO Pages to Optimize:**
- Homepage
- Template library
- ROI calculator
- PM dashboard (noindex)
- Login/register (noindex)

**Technical Tasks:**
Configure next-seo for all pages

Generate static sitemap.xml

Add JSON-LD structured data

Optimize Core Web Vitals

Fix accessibility violations

Reduce bundle size < 200KB

Implement image optimization


**Deliverables:**
- ✅ All pages have meta tags
- ✅ Sitemap generated
- ✅ Structured data added
- ✅ Lighthouse score > 85
- ✅ Accessibility score > 90
- ✅ Performance optimized

**Success Metrics:**
- Lighthouse Performance > 85
- Lighthouse SEO > 90
- Lighthouse Accessibility > 90
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- No console errors

---

### Week 9: Testing & Deployment

**Goals:**
- Comprehensive testing
- Deploy to production
- Monitor and fix issues

**Testing Tasks:**
1. Write E2E tests for critical flows (login, lead response, template download)
2. Write unit tests for key components
3. Write integration tests for API calls
4. Conduct manual testing on multiple devices
5. Perform security testing
6. Load testing for API endpoints
7. Test error scenarios
8. Verify mobile responsiveness
9. Cross-browser testing (Chrome, Safari, Firefox, Edge)
10. Accessibility testing with screen readers

**Deployment Tasks:**
1. Set up production environment
2. Configure environment variables
3. Set up CI/CD pipeline
4. Deploy backend to production
5. Deploy frontend to Vercel/production
6. Configure domain and SSL
7. Set up error monitoring (Sentry)
8. Configure analytics (Google Analytics)
9. Set up performance monitoring
10. Create deployment documentation

**Test Coverage Goals:**
- E2E: Critical user flows (login, lead management, responses)
- Unit: All utility functions, complex components
- Integration: All API calls with mocked responses

**Deliverables:**
- ✅ Test suite passing
- ✅ Production deployment successful
- ✅ Monitoring configured
- ✅ Documentation complete
- ✅ MVP launched

**Success Metrics:**
- All tests passing
- Zero critical bugs
- Production stable
- Monitoring active
- Users can register and use system

---

## Sprint Planning

### Sprint Structure

**Sprint Duration:** 1 week per sprint
**Total MVP Duration:** 9 sprints (9 weeks)
**Sprint Planning:** Monday 9am
**Sprint Review/Retro:** Friday 3pm
**Daily Standups:** 9:30am (15 mins)

---

### Sprint 1: Foundation (Week 1)
**Theme:** Project Setup & Architecture

**Sprint Goals:**
- Initialize Next.js project with proper configuration
- Establish development workflow
- Create base components and layouts

**User Stories:**
1. As a developer, I need a properly configured Next.js project so that I can start building features
2. As a developer, I need a consistent code style so that the codebase remains maintainable
3. As a developer, I need API client setup so that I can integrate with the backend

**Tasks:**
- [ ] Initialize Next.js 14+ with TypeScript
- [ ] Configure Tailwind CSS with custom theme
- [ ] Set up folder structure
- [ ] Install and configure React Query
- [ ] Set up ESLint and Prettier
- [ ] Create base layout components
- [ ] Configure environment variables
- [ ] Set up next-seo
- [ ] Create API client configuration
- [ ] Document setup process

**Definition of Done:**
- Project builds and runs without errors
- All team members can run locally
- Code quality tools working
- Base layout renders correctly
- API client ready for integration

---

### Sprint 2: Authentication (Week 2)
**Theme:** User Authentication System

**Sprint Goals:**
- Implement complete authentication backend
- Enable secure user registration and login
- Set up role-based access control

**User Stories:**
1. As a Property Manager, I want to register an account so that I can access the platform
2. As a Property Manager, I want to log in securely so that I can manage my leads
3. As a user, I want to reset my password if I forget it
4. As the system, I want role-based access control so that users only see appropriate features

**Backend Tasks:**
- [ ] Create authentication migrations
- [ ] Create User model with roles
- [ ] Implement registration endpoint
- [ ] Implement login endpoint with JWT
- [ ] Implement logout endpoint
- [ ] Create token refresh mechanism
- [ ] Implement password reset flow
- [ ] Add email verification
- [ ] Create role-based middleware
- [ ] Write authentication tests
- [ ] Document API endpoints

**API Endpoints:**
POST /api/v2/auth/register

POST /api/v2/auth/login

POST /api/v2/auth/logout

POST /api/v2/auth/refresh

POST /api/v2/auth/forgot-password

POST /api/v2/auth/reset-password

POST /api/v2/auth/verify-email

GET /api/v2/auth/me

PUT /api/v2/auth/profile


**Definition of Done:**
- All authentication endpoints working
- JWT tokens generate and validate correctly
- Role middleware blocks unauthorized access
- Email verification sends and validates
- Password reset works end-to-end
- Tests passing with >80% coverage
- API documentation complete

---

### Sprint 3: PM Dashboard Core (Week 3)
**Theme:** Property Manager Dashboard Foundation

**Sprint Goals:**
- Build authenticated dashboard interface
- Display lead pipeline with real data
- Implement lead detail view

**User Stories:**
1. As a Property Manager, I want to see my assigned leads so that I can review opportunities
2. As a Property Manager, I want to view detailed lead information so that I can make informed decisions
3. As a Property Manager, I want to filter leads by status so that I can prioritize my work
4. As a Property Manager, I want a mobile-friendly dashboard so that I can work from anywhere

**Frontend Tasks:**
- [ ] Create authentication context and hooks
- [ ] Build login page with form validation
- [ ] Build registration page
- [ ] Create protected route wrapper
- [ ] Build PM dashboard layout
- [ ] Create lead pipeline component
- [ ] Build lead card component
- [ ] Create lead detail modal
- [ ] Implement lead status indicators
- [ ] Add basic filtering (status, date)
- [ ] Add error boundaries
- [ ] Create loading states
- [ ] Implement responsive design

**Definition of Done:**
- PM can register and log in
- Dashboard displays real leads from API
- Lead cards show all key information
- Modal shows complete lead details
- Filtering updates display correctly
- Error handling works properly
- Loading states display appropriately
- Fully responsive on mobile/tablet
- No console errors

---

### Sprint 4: Lead Response System (Week 4)
**Theme:** Lead Interaction & Response Management

**Sprint Goals:**
- Enable PMs to respond to leads
- Capture contact information and preferences
- Track lead interactions

**User Stories:**
1. As a Property Manager, I want to respond to leads with my interest level so that owners know I'm interested
2. As a Property Manager, I want to provide my contact information so that owners can reach me
3. As a Property Manager, I want to indicate my availability so that we can schedule viewings
4. As a Property Manager, I want to quote a management fee so that owners know my pricing
5. As a Property Manager, I want to see my response history so that I can track my interactions

**Frontend Tasks:**
- [ ] Create response submission form
- [ ] Build response type selector (4 types)
- [ ] Implement contact information form
- [ ] Add availability scheduling UI
- [ ] Create price quoting form
- [ ] Add form validation (Zod schemas)
- [ ] Implement view tracking on lead open
- [ ] Add response history component
- [ ] Create optimistic UI updates
- [ ] Add success/error notifications
- [ ] Implement response confirmation modal

**API Integrations:**
- [ ] POST /api/v2/property-managers/{pmId}/leads/{leadId}/view
- [ ] POST /api/v2/responses
- [ ] GET /api/v2/leads/{id}/responses

**Definition of Done:**
- All response types can be submitted
- Contact information validates and saves
- Availability scheduling works
- Price quoting saves correctly
- View tracking records on lead open
- Response history displays correctly
- Optimistic updates provide immediate feedback
- Form validation prevents invalid data
- Error handling works properly
- Mobile-friendly forms

---

### Sprint 5: Analytics Dashboard (Week 5)
**Theme:** Performance Metrics & Reporting

**Sprint Goals:**
- Display PM performance analytics
- Visualize conversion funnel
- Show trends and insights

**User Stories:**
1. As a Property Manager, I want to see my performance metrics so that I can track my success
2. As a Property Manager, I want to see my conversion funnel so that I can identify improvement areas
3. As a Property Manager, I want to see trends over time so that I can understand my growth
4. As a Property Manager, I want to export my analytics so that I can share with my team

**Frontend Tasks:**
- [ ] Create analytics dashboard page
- [ ] Build metrics cards (leads, response rate, avg response time)
- [ ] Implement conversion funnel visualization
- [ ] Create response rate chart (Chart.js)
- [ ] Add lead distribution stats display
- [ ] Build time-series chart (leads over time)
- [ ] Add date range selector
- [ ] Create export functionality (CSV)
- [ ] Add comparison metrics (vs previous period)
- [ ] Implement chart responsiveness
- [ ] Add loading skeletons

**API Integrations:**
- [ ] GET /api/v2/analytics/dashboard
- [ ] GET /api/v2/analytics/funnel
- [ ] GET /api/v2/analytics/pm/{pmId}
- [ ] GET /api/vj2/analytics/time-series

**Charts to Implement:**
- Conversion funnel (5 stages)
- Response rate over time (line chart)
- Lead distribution by property type (bar chart)
- Lead status distribution (pie chart)

**Definition of Done:**
- Analytics page displays all metrics
- Charts render with real data
- Conversion funnel shows all 5 stages
- Date range filtering works
- Export generates correct CSV
- Charts are responsive
- Loading states display
- No performance issues with large datasets

---

### Sprint 6: Document Templates (Week 6)
**Theme:** Template Library & Downloads

**Sprint Goals:**
- Build template library interface
- Implement download tracking
- Add search and filtering

**User Stories:**
1. As a Property Manager, I want to browse document templates so that I can find useful resources
2. As a Property Manager, I want to filter templates by category so that I can find relevant documents
3. As a Property Manager, I want to search templates so that I can quickly find what I need
4. As a Property Manager, I want to download templates so that I can use them in my business
5. As a Property Manager, I want to see my download history so that I can access templates again

**Frontend Tasks:**
- [ ] Create template library page
- [ ] Build template grid layout
- [ ] Create template card component
- [ ] Implement category filtering
- [ ] Add state filtering
- [ ] Create search functionality
- [ ] Build template detail modal
- [ ] Implement download button with tracking
- [ ] Add rate limiting feedback
- [ ] Create "recently downloaded" section
- [ ] Implement pagination
- [ ] Add template preview (if applicable)

**API Integrations:**
- [ ] GET /api/v2/templates (with filters)
- [ ] GET /api/v2/templates/{id}
- [ ] GET /api/v2/templates/{id}/download
- [ ] GET /api/v2/templates/categories

**Definition of Done:**
- Template library displays all templates
- Category filtering works instantly
- State filtering works
- Search returns relevant results
- Downloads track correctly
- Rate limiting displays clearly (10/hour)
- Pagination works smoothly
- Mobile-responsive grid
- Preview works (if implemented)
- Download history accessible

---

### Sprint 7: Property Calculators (Week 7)
**Theme:** ROI Calculator Tool

**Sprint Goals:**
- Build functional ROI calculator
- Visualize results with charts
- Enable print and export

**User Stories:**
1. As a Property Owner, I want to calculate potential ROI so that I can make investment decisions
2. As a Property Owner, I want to see visual charts so that I can understand the numbers better
3. As a Property Owner, I want to print my results so that I can share with partners
4. As a Property Owner, I want to export to PDF so that I can save for later

**Frontend Tasks:**
- [ ] Create ROI calculator page
- [ ] Build calculator input form (12+ inputs)
- [ ] Implement calculation logic (ROI, cash flow, cap rate)
- [ ] Create results display component
- [ ] Add ROI chart (Chart.js line chart)
- [ ] Add cash flow chart (bar chart)
- [ ] Implement print functionality
- [ ] Add export to PDF (jsPDF)
- [ ] Create responsive layout
- [ ] Add input validation
- [ ] Create tooltips for complex inputs
- [ ] Add example/preset values

**Calculator Inputs:**
- Purchase price
- Down payment
- Interest rate
- Loan term
- Monthly rent
- Vacancy rate
- Property taxes
- Insurance
- HOA fees
- Maintenance
- Property management fee
- Other expenses

**Results to Display:**
- Annual ROI percentage
- Monthly cash flow
- Annual cash flow
- Cap rate
- Cash-on-cash return
- Total investment
- 5-year projection

**Definition of Done:**
- All inputs validate correctly
- Calculations are accurate
- Charts update in real-time
- Print layout is clean
- PDF exports with all data
- Responsive on all devices
- Tooltips explain complex terms
- Example values help users
- No calculation errors

---

### Sprint 8: SEO & Performance (Week 8)
**Theme:** Search Engine Optimization & Performance Tuning

**Sprint Goals:**
- Optimize all pages for search engines
- Improve page load performance
- Achieve Lighthouse score > 85

**User Stories:**
1. As a user, I want pages to load quickly so that I have a good experience
2. As a search engine, I want proper meta tags so that I can index pages correctly
3. As a user, I want accessible pages so that everyone can use the platform
4. As a business, I want good SEO so that we get organic traffic

**Frontend Tasks:**
- [ ] Implement dynamic meta tags for all pages
- [ ] Create static sitemap.xml
- [ ] Add structured data (JSON-LD) to key pages
- [ ] Optimize all images with next/image
- [ ] Implement lazy loading for components
- [ ] Add Open Graph tags for social sharing
- [ ] Create robots.txt
- [ ] Run Lighthouse audits on all pages
- [ ] Fix accessibility violations
- [ ] Optimize bundle size (code splitting)
- [ ] Implement route prefetching
- [ ] Add performance monitoring

**Pages to Optimize:**
1. Homepage (marketing)
2. Template library (marketing)
3. ROI calculator (marketing)
4. PM dashboard (noindex, but fast)
5. Login/register (noindex)

**SEO Requirements:**
- Unique meta title for each page
- Unique meta description (150-160 chars)
- Open Graph tags for social sharing
- Structured data for organization
- Sitemap with all public pages
- Robots.txt with proper directives

**Performance Targets:**
- Lighthouse Performance > 85
- Lighthouse SEO > 90
- Lighthouse Accessibility > 90
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Total Blocking Time < 300ms

**Definition of Done:**
- All pages have unique meta tags
- Sitemap generated and accessible
- Structured data validates
- Lighthouse scores meet targets
- No accessibility violations
- Bundle size < 200KB
- Images optimized
- No console errors/warnings

---

### Sprint 9: Testing & Deployment (Week 9)
**Theme:** Quality Assurance & Production Launch

**Sprint Goals:**
- Comprehensive testing across all features
- Deploy to production environment
- Monitor and fix critical issues

**User Stories:**
1. As a developer, I want automated tests so that we catch bugs early
2. As a business, I want a stable production deployment so that users have a reliable experience
3. As a user, I want a bug-free experience so that I can use the platform confidently

**Testing Tasks:**
- [ ] Write E2E tests for critical flows (Playwright)
  - [ ] Registration flow
  - [ ] Login flow
  - [ ] Lead viewing flow
  - [ ] Lead response flow
  - [ ] Template download flow
  - [ ] Calculator usage flow
- [ ] Write unit tests for components
  - [ ] Form components
  - [ ] Calculator logic
  - [ ] Utility functions
- [ ] Write integration tests for API calls
  - [ ] Authentication
  - [ ] Lead fetching
  - [ ] Response submission
  - [ ] Analytics fetching
- [ ] Manual testing on devices
  - [ ] iPhone (Safari)
  - [ ] Android (Chrome)
  - [ ] iPad (Safari)
  - [ ] Desktop (Chrome, Safari, Firefox)
- [ ] Security testing
  - [ ] SQL injection attempts
  - [ ] XSS attempts
  - [ ] CSRF protection
  - [ ] Rate limiting
- [ ] Performance testing
  - [ ] Load testing (100 concurrent users)
  - [ ] API response times
  - [ ] Database query performance

**Deployment Tasks:**
- [ ] Set up production environment (AWS/Vercel)
- [ ] Configure production environment variables
- [ ] Set up CI/CD pipeline (GitHub Actions)
- [ ] Deploy backend to production
- [ ] Deploy frontend to production (Vercel)
- [ ] Configure custom domain
- [ ] Set up SSL certificate
- [ ] Configure error monitoring (Sentry)
- [ ] Set up analytics (Google Analytics)
- [ ] Configure performance monitoring (Vercel Analytics)
- [ ] Create deployment runbook
- [ ] Document rollback procedure

**Test Coverage Goals:**
- E2E: 100% of critical user flows
- Unit: >80% coverage of utility functions
- Integration: 100% of API endpoints

**Definition of Done:**
- All test suites passing
- E2E tests cover critical flows
- Production deployment successful
- Custom domain working with SSL
- Error monitoring active
- Analytics tracking correctly
- No critical bugs in production
- Deployment documentation complete
- Rollback procedure tested
- MVP launched and accessible

---

## Next Steps & Action Items

### Immediate Actions (This Week)

**1. Prioritize Authentication Backend Development**
- **Owner:** Backend Team Lead
- **Due:** End of Week 2
- **Action Items:**
  - Review authentication requirements
  - Design database schema for auth
  - Implement JWT token system
  - Create all authentication endpoints
  - Write comprehensive tests
  - Document API contracts

**2. Initiate Frontend Setup**
- **Owner:** Frontend Team Lead
- **Due:** End of Week 1
- **Action Items:**
  - Initialize Next.js project
  - Configure Tailwind CSS
  - Set up React Query
  - Create folder structure
  - Configure development tools
  - Document setup process

**3. Define API Contracts**
- **Owner:** Tech Lead
- **Due:** ASAP (before Week 2)
- **Action Items:**
  - Create OpenAPI/Swagger documentation
  - Define TypeScript types for all endpoints
  - Share contracts with frontend team
  - Create mock API for frontend development
  - Version API endpoints properly

### Short-term Goals (Weeks 1-4)

- ✅ Complete Project Setup (Week 1)
- ✅ Implement Authentication System (Week 2)
- ✅ Build PM Dashboard Core (Week 3)
- ✅ Complete Lead Management (Week 4)

### Mid-term Goals (Weeks 5-7)

- ✅ Launch Analytics Dashboard (Week 5)
- ✅ Complete Template Library (Week 6)
- ✅ Build ROI Calculator (Week 7)

### Pre-launch Goals (Weeks 8-9)

- ✅ SEO & Performance Optimization (Week 8)
- ✅ Testing & Deployment (Week 9)
- 🚀 **MVP LAUNCH**

---

## Communication & Collaboration

### Team Structure
- **Backend Team:** 2 developers (Laravel, APIs)
- **Frontend Team:** 2 developers (Next.js, React)
- **Tech Lead:** 1 (Architecture, code review)
- **Product Manager:** 1 (Requirements, prioritization)
- **QA/Testing:** 1 (Manual + automated testing)

### Communication Channels
- **Daily Standups:** 9:30am (15 mins via Slack huddle or Zoom)
- **Sprint Planning:** Monday 9am (1 hour)
- **Sprint Review/Retro:** Friday 3pm (1 hour)
- **Technical Design Reviews:** As needed (1 hour)
- **Slack Channels:**
  - #propertifi-dev (general development)
  - #propertifi-frontend (frontend-specific)
  - #propertifi-backend (backend-specific)
  - #propertifi-deployments (deployment notifications)

### Documentation
- **Technical Docs:** Stored in `/docs` folder in repository
- **API Documentation:** Swagger/OpenAPI at `/api/docs`
- **Component Storybook:** For UI component documentation
- **Wiki:** GitHub Wiki for architecture decisions, runbooks

---

## Success Metrics & KPIs

### Development Metrics
- **Sprint Velocity:** Track story points completed per sprint
- **Code Quality:** Maintain >80% test coverage
- **Bug Rate:** <5 critical bugs per sprint
- **Code Review Time:** <24 hours for PR reviews
- **Build Time:** <5 minutes for CI/CD pipeline

### Product Metrics (Post-Launch)
- **User Registration:** Target 50 PM registrations in first month
- **Lead Response Rate:** Target >60% of leads get responses
- **Template Downloads:** Target 200 downloads in first month
- **Page Load Time:** <3 seconds for all pages
- **Uptime:** >99.5% availability

### Business Metrics (Post-Launch)
- **User Engagement:** Daily active users
- **Feature Adoption:** % of users using each feature
- **Conversion Rate:** % of visitors who register
- **Retention Rate:** % of users who return after 30 days

---

## Appendix

### Technology Stack Summary

**Frontend:**
- Next.js 14+ (App Router)
- TypeScript 5+
- Tailwind CSS 3+
- React Query (TanStack Query)
- Chart.js 4
- Framer Motion
- next-seo
- Headless UI
- Zod (validation)

**Backend:**
- Laravel 8
- MySQL 8
- Redis (caching)
- JWT authentication
- RESTful API (v2)

**DevOps:**
- Docker (local development)
- GitHub Actions (CI/CD)
- Vercel (frontend hosting)
- AWS/DigitalOcean (backend hosting)
- Sentry (error monitoring)
- Vercel Analytics (performance)

**Testing:**
- Playwright (E2E)
- Jest (unit tests)
- React Testing Library (component tests)
- PHPUnit (backend tests)

### File Structure Reference

propertifi-frontend/
├── app/
│   ├── (marketing)/          # Public marketing pages
│   │   ├── page.tsx          # Homepage
│   │   ├── templates/        # Template library
│   │   └── calculators/      # ROI calculator
│   ├── (dashboard)/          # Protected dashboard pages
│   │   └── property-manager/ # PM dashboard
│   ├── (auth)/               # Auth pages (login, register)
│   ├── api/                  # API route handlers
│   └── layout.tsx            # Root layout
├── components/
│   ├── auth/                 # Authentication components
│   ├── dashboard/            # Dashboard components
│   ├── leads/                # Lead-related components
│   ├── analytics/            # Analytics components
│   ├── templates/            # Template components
│   ├── calculators/          # Calculator components
│   ├── ui/                   # Reusable UI components
│   └── layout/               # Layout components
├── lib/
│   ├── api.ts                # API client (React Query)
│   ├── auth.ts               # Auth utilities
│   ├── seo.ts                # SEO utilities
│   ├── validations.ts        # Zod schemas
│   └── utils.ts              # General utilities
├── hooks/
│   ├── useAuth.ts            # Auth hook
│   ├── useLeads.ts           # Leads data hook
│   └── useAnalytics.ts       # Analytics hook
├── types/
│   ├── api.ts                # API type definitions
│   ├── models.ts             # Data models
│   └── index.ts              # Type exports
├── public/
│   ├── images/               # Static images
│   └── documents/            # Static documents
├── styles/
│   └── globals.css           # Global styles
├── tests/
│   ├── e2e/                  # E.g. tests
│   ├── unit/                 # Unit tests
│   └── integration/          # Integration tests
├── .env.local                # Environment variables
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies


### Glossary

**Terms:**
- **PM:** Property Manager
- **MVP:** Minimum Viable Product
- **E2E:** End-to-End (testing)
- **JWT:** JSON Web Token
- **ROI:** Return on Investment
- **API:** Application Programming Interface
- **CRUD:** Create, Read, Update, Delete
- **CI/CD:** Continuous Integration/Continuous Deployment
- **SEO:** Search Engine Optimization
- **SSR:** Server-Side Rendering
- **SSG:** Static Site Generation

---

## Document History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2025-10-29 | Claude/Gemini | Initial comprehensive plan created |

---

**End of Frontend Development Plan**

This plan should be reviewed weekly and updated based on progress, blockers, and changing requirements. All team members should have access to this document and refer to it regularly for alignment.

---
---

# Propertifi v2 - Frontend Implementation Guide (Aligned)

## Overview
This document provides step-by-step instructions for AI agents to implement the Next.js frontend for Propertifi v2, based on the 9-week `FRONTEND_DEVELOPMENT_PLAN.md`. Each phase corresponds to a sprint week.

---

## Phase 1 (Week 1): Project Setup & Architecture

**Objective**: Initialize the Next.js 14+ project, configure the development environment, and establish the core architecture.

### Task 1.1: Next.js Project Initialization

**AI Agent Prompt**:
Create a Next.js 14+ project with the following requirements:

App Router structure

TypeScript configuration

Tailwind CSS with custom theme

API client configuration using React Query (TanStack Query)

Setup for ESLint and Prettier

Base layout components (Header, Footer, Sidebar)

Configuration for environment variables (.env.local)


**Implementation Steps**:

1.  **Initialize Project**:
    ```bash
    npx create-next-app@latest propertifi-v2 --typescript --tailwind --eslint --app
    cd propertifi-v2
    ```

2.  **Install Dependencies**:
    ```bash
    npm install @tanstack/react-query axios framer-motion @headlessui/react @heroicons/react next-seo zod
    ```

3.  **Configure Tailwind** (`tailwind.config.js`):
    ```javascript
    /** @type {import('tailwindcss').Config} */
    module.exports = {
      content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
      ],
      theme: {
        extend: {
          colors: {
            primary: {
              50: '#f0f9ff',
              500: '#3b82f6',
              600: '#2563eb',
              700: '#1d4ed8',
            },
            // Add other Propertifi brand colors
          },
        },
      },
      plugins: [require('@tailwindcss/forms')],
    };
    ```

4.  **Setup API Client** (`lib/api.ts`):
    ```typescript
    import { QueryClient } from '@tanstack/react-query';
    import axios from 'axios';

    export const apiClient = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      withCredentials: true,
    });

    export const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5, // 5 minutes
          retry: 2,
        },
      },
    });
    ```

5.  **Create Providers** (`app/providers.tsx`):
    ```typescript
    'use client';
    import { QueryClientProvider } from '@tanstack/react-query';
    import { queryClient } from '@/lib/api';

    export function Providers({ children }: { children: React.ReactNode }) {
      return (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );
    }
    ```

6.  **Update Root Layout** (`app/layout.tsx`):
    ```typescript
    import './globals.css';
    import { Inter } from 'next/font/google';
    import { Providers } from './providers';

    const inter = Inter({ subsets: ['latin'] });

    export const metadata = {
      title: 'Propertifi',
      description: 'Property Management Solutions',
    };

    export default function RootLayout({
      children,
    }: {
      children: React.ReactNode;
    }) {
      return (
        <html lang="en">
          <body className={inter.className}>
            <Providers>{children}</Providers>
          </body>
        </html>
      );
    }
    ```

**Validation**: Project builds and runs successfully. React Query provider wraps the application.

---

## Phase 2 (Week 2): Authentication Backend Implementation

**Objective**: Implement the critical backend authentication APIs required to unblock the frontend dashboard development.

**Note**: This is a **backend-focused phase**. The prompts are for a backend developer (e.g., using Laravel/Node.js) to create the necessary endpoints.

### Task 2.1: Implement Authentication API Endpoints

**AI Agent Prompt**:
Implement the complete backend authentication system. Required API endpoints:

POST /api/v2/auth/register (User registration)

POST /api/v2/auth/login (User login, returns JWT)

POST /api/v2/auth/logout (User logout)

POST /api/v2/auth/refresh (Refresh JWT token)

POST /api/v2/auth/forgot-password (Request password reset)

POST /api/v2/auth/reset-password (Reset password with token)

POST /api/v2/auth/verify-email (Verify email address)

GET /api/v2/auth/me (Get authenticated user profile)

PUT /api/v2/auth/profile (Update user profile)

Requirements:

Use JWT for authentication.

Include Role-Based Access Control (Owner, PM, Admin).

Implement email verification and password reset flows.

Return appropriate HTTP status codes and JSON responses.


**Implementation Steps (Backend - Example in Express/Node.js)**:

1.  **User Model** (`models/User.js`):
    ```javascript
    // Define User schema with email, password (hashed), role,
    // verificationToken, resetPasswordToken, etc.
    ```
2.  **Register Route** (`routes/auth.js`):
    ```javascript
    // POST /api/v2/auth/register
    // 1. Validate input (email, password)
    // 2. Check if user exists
    // 3. Hash password
    // 4. Create new user
    // 5. Generate email verification token
    // 6. Send verification email
    // 7. Return 201 Created
    ```
3.  **Login Route** (`routes/auth.js`):
    ```javascript
    // POST /api/v2/auth/login
    // 1. Validate input
    // 2. Find user by email
    // 3. Compare hashed password
    // 4. Check if email is verified
    // 5. Generate JWT (access token) and refresh token
    // 6. Set refresh token in httpOnly cookie
    // 7. Return user data and access token
    ```
4.  **Auth Middleware** (`middleware/auth.js`):
    ```javascript
    // 1. Check for Authorization header (Bearer token)
    // 2. Verify JWT
    // 3. Attach user to request object
    // 4. Call next()
    ```
5.  **Role Middleware** (`middleware/roles.js`):
    ```javascript
    // 1. Run after auth middleware
    // 2. Check if req.user.role is in the allowed roles list
    // 3. If not, return 403 Forbidden
    ```

**Validation**: All API endpoints are functional and tested. Frontend team can successfully register, log in, and authenticate requests.

---

## Phase 3 (Week 3): PM Dashboard Core

**Objective**: Build the authenticated frontend dashboard for Property Managers (PMs), integrate with the new Auth API, and display the lead pipeline.

### Task 3.1: Implement Auth Pages & Protected Routes

**AI Agent Prompt**:
Create the frontend authentication components:

Login page at app/(auth)/login/page.tsx

Registration page at app/(auth)/register/page.tsx

An authentication context/hook (hooks/useAuth.ts) to manage auth state.

A protected route wrapper/component (components/auth/ProtectedRoute.tsx) that redirects unauthenticated users to the login page.


**Implementation Steps**:

1.  **Auth Context** (`lib/auth.ts`):
    ```typescript
    import { create } from 'zustand';
    // Create a simple state store for user and token
    // Include login, logout, register functions
    ```
2.  **Login Form** (`components/auth/LoginForm.tsx`):
    ```typescript
    'use client';
    import { useForm } from 'react-hook-form';
    // ... use the auth store/hook to call login API
    ```
3.  **Login Page** (`app/(auth)/login/page.tsx`):
    ```typescript
    import { LoginForm } from '@/components/auth/LoginForm';
    export default function LoginPage() {
      return <LoginForm />;
    }
    ```
4.  **Protected Route / Layout** (`app/(dashboard)/property-manager/layout.tsx`):
    ```typescript
    'use client';
    import { useAuth } from '@/hooks/useAuth';
    import { redirect } from 'next/navigation';

    export default function DashboardLayout({ children }: { children: React.ReactNode }) {
      const { user, isLoading } = useAuth(); // Example hook

      if (isLoading) return <div>Loading...</div>;

      if (!user) {
        redirect('/login');
      }

      if (user.role !== 'property_manager') {
         redirect('/unauthorized');
      }

      return (
        <div>
          {/* Add DashboardHeader / DashboardSidebar here */}
          <main>{children}</main>
        </div>
      );
    }
    ```

### Task 3.2: Build Lead Pipeline

**AI Agent Prompt**:
Build the core PM lead pipeline UI:

Fetch leads from GET /api/v2/property-managers/{pmId}/leads.

Create LeadPipeline.tsx component to display leads.

Create LeadCard.tsx component for individual leads.

Create LeadDetail.tsx modal to show full lead info.

Implement basic filtering (status, date).

Include loading and error states.


**Implementation Steps**:

1.  **Lead Pipeline Hook** (`hooks/useLeads.ts`):
    ```typescript
    import { useQuery } from '@tanstack/react-query';
    import { apiClient } from '@/lib/api';

    const fetchLeads = async (pmId: string) => {
      const { data } = await apiClient.get(`/property-managers/${pmId}/leads`);
      return data;
    };

    export const useLeads = (pmId: string) => {
      return useQuery({
        queryKey: ['leads', pmId],
        queryFn: () => fetchLeads(pmId),
      });
    };
    ```
2.  **Lead Card** (`components/leads/LeadCard.tsx`):
    ```typescript
    // Component to display lead summary: address, status, date
    // On click, it should open the LeadDetail modal
    ```
3.  **Dashboard Page** (`app/(dashboard)/property-manager/page.tsx`):
    ```typescript
    'use client';
    import { useLeads } from '@/hooks/useLeads';
    import { useAuth } from '@/hooks/useAuth';
    import { LeadPipeline } from '@/components/leads/LeadPipeline';
    import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

    export default function DashboardPage() {
      const { user } = useAuth();
      const { data: leads, isLoading, isError } = useLeads(user.id);

      if (isLoading) return <LoadingSpinner />;
      if (isError) return <div>Error loading leads.</div>;

      return (
        <div>
          <h1 className="text-3xl font-bold">Your Lead Pipeline</h1>
          <LeadPipeline leads={leads} />
        </div>
      );
    }
    ```

**Validation**: PM can log in, is redirected to the dashboard, and sees a list of leads fetched from the API.

---

## Phase 4 (Week 4): Lead Management

**Objective**: Implement the frontend components for PMs to respond to leads and track interactions.

### Task 4.1: Implement Response Forms

**AI Agent Prompt**:
Build the lead response system:

Create a ResponseForm.tsx component.

Include a ResponseTypeSelector.tsx for "interested", "not_interested", "need_more_info", etc..

Add forms for ContactInfoForm.tsx, AvailabilityScheduler.tsx, and PriceQuoteForm.tsx.

Integrate with POST /api/v2/responses to submit the form data.

Add form validation (e.g., using Zod).

Show success/error feedback notifications.


**Implementation Steps**:

1.  **Response Hook** (`hooks/useLeadResponse.ts`):
    ```typescript
    import { useMutation } from '@tanstack/react-query';
    import { apiClient } from '@/lib/api';

    const submitResponse = async (responseData: any) => {
      const { data } = await apiClient.post('/responses', responseData);
      return data;
    };

    export const useLeadResponse = () => {
      return useMutation({
        mutationFn: submitResponse,
        onSuccess: () => {
          // Invalidate leads query to refetch
          queryClient.invalidateQueries(['leads']);
          // Show success toast
        },
        onError: () => {
          // Show error toast
        },
      });
    };
    ```
2.  **Main Response Form** (`components/leads/ResponseForm.tsx`):
    ```typescript
    // This component will conditionally render other forms
    // (ContactInfoForm, etc.) based on the selected response type.
    // It will use react-hook-form and Zod for validation.
    // On submit, it calls the `useLeadResponse` mutation.
    ```

### Task 4.2: Implement View Tracking & History

**AI Agent Prompt**:
Implement lead interaction tracking:

Trigger POST /api/v2/property-managers/{pmId}/leads/{leadId}/view when a lead detail modal is opened.

Create a ResponseHistory.tsx component to display past responses by fetching from GET /api/v2/leads/{id}/responses.

Add optimistic UI updates: when a PM responds, show the response in the history immediately.


**Implementation Steps**:

1.  **Lead Detail Modal** (`components/leads/LeadDetail.tsx`):
    ```typescript
    'use client';
    import { useEffect } from 'react';
    import { useMutation } from '@tanstack/react-query';
    // ...
    const trackView = useMutation(/* ... */);

    useEffect(() => {
      if (isOpen) {
        trackView.mutate({ pmId, leadId });
      }
    }, [isOpen, pmId, leadId]);

    // ... render modal content, including ResponseForm and ResponseHistory
    ```

**Validation**: PM can submit all response types. View tracking is triggered. Response history is displayed.

---

## Phase 5 (Week 5): Analytics Dashboard

**Objective**: Build the analytics page for PMs, showing performance metrics and visualizations.

### Task 5.1: Implement Analytics UI

**AI Agent Prompt**:
Build the Analytics Dashboard page at app/(dashboard)/property-manager/analytics/page.tsx.

Create MetricsCard.tsx to show key stats (total leads, response rate).

Build ConversionFunnel.tsx to visualize the 5-stage funnel.

Create ResponseRateChart.tsx and TimeSeriesChart.tsx using Chart.js.

Add a DateRangeSelector.tsx.

Implement an ExportButton.tsx (CSV/PDF).


**Implementation Steps**:

1.  **Analytics Hook** (`hooks/useAnalytics.ts`):
    ```typescript
    import { useQuery } from '@tanstack/react-query';
    // ...
    const fetchDashboardStats = (pmId, dateRange) =>
      apiClient.get(`/analytics/dashboard?pmId=${pmId}&range=${dateRange}`);
    const fetchFunnelStats = (pmId, dateRange) =>
      apiClient.get(`/analytics/funnel?pmId=${pmId}&range=${dateRange}`);
    // ...
    ```
2.  **Chart Component** (`components/analytics/ResponseRateChart.tsx`):
    ```typescript
    'use client';
    import { Bar } from 'react-chartjs-2';
    import { Chart as ChartJS, CategoryScale, ... } from 'chart.js';
    ChartJS.register(CategoryScale, ...);
    // ...
    export function ResponseRateChart({ data }) {
      return <Bar data={data} options={...} />;
    }
    ```
3.  **Analytics Page** (`app/(dashboard)/property-manager/analytics/page.tsx`):
    ```typescript
    'use client';
    import { useState } from 'react';
    import { useAnalytics } from '@/hooks/useAnalytics';
    // ... import components
    export default function AnalyticsPage() {
      const [dateRange, setDateRange] = useState(...);
      const { data: stats, isLoading } = useAnalytics(user.id, dateRange);
      // ...
      return (
        <div>
          <DateRangeSelector onChange={setDateRange} />
          <MetricsCard data={stats.summary} />
          <ConversionFunnel data={stats.funnel} />
          <ResponseRateChart data={stats.charts.responseRate} />
        </div>
      );
    }
    ```

**Validation**: Analytics dashboard loads and displays metrics. Charts render with real data. Date filtering works.

---

## Phase 6 (Week 6): Document Templates

**Objective**: Build the public-facing document template library with filtering and download functionality.

### Task 6.1: Build Template Library

**AI Agent Prompt**:
Build the Document Template Library at app/(marketing)/templates/page.tsx.

Fetch templates from GET /api/v2/templates.

Create TemplateLibrary.tsx with a grid/list view.

Create TemplateCard.tsx.

Implement TemplateFilters.tsx (by category, state).

Implement TemplateSearch.tsx.

Implement pagination.


**Implementation Steps**:

1.  **Templates Hook** (`hooks/useTemplates.ts`):
    ```typescript
    import { useQuery } from '@tanstack/react-query';
    // ...
    const fetchTemplates = async (filters) => {
      const params = new URLSearchParams(filters);
      const { data } = await apiClient.get(`/templates?${params}`);
      return data;
    };
    // ...
    ```
2.  **Template Library** (`components/templates/TemplateLibrary.tsx`):
    ```typescript
    'use client';
    import { useState } from 'react';
    import { useTemplates } from '@/hooks/useTemplates';
    // ...
    export function TemplateLibrary() {
      const [filters, setFilters] = useState({ search: '', category: '', state: '' });
      const { data, isLoading } = useTemplates(filters);
      // ...
      return (
        <div>
          <TemplateSearch onChange={(s) => setFilters(f => ({...f, search: s}))} />
          <TemplateFilters onChange={(c) => setFilters(f => ({...f, category: c}))} />
          {/* ... render TemplateGrid ... */}
        </div>
      );
    }
    ```

### Task 6.2: Implement Template Download

**AI Agent Prompt**:
Implement the download functionality:

Create a DownloadButton.tsx.

On click, call GET /api/v2/templates/{id}/download.

Implement download tracking.

Display rate limiting feedback from the API (e.g., "You have reached your download limit").


**Implementation Steps**:

1.  **Download Button** (`components/templates/DownloadButton.tsx`):
    ```typescript
    'use client';
    import { useState } from 'react';
    // ...
    const handleDownload = async (templateId) => {
      try {
        const response = await apiClient.get(`/templates/${templateId}/download`, {
          responseType: 'blob',
        });
        // Logic to trigger file download in browser
      } catch (error) {
        if (error.response.status === 429) {
          // Set rate limit error message
        }
      }
    };
    ```

**Validation**: Template library loads and filters templates. Users can download files. Rate limiting feedback is displayed.

---

## Phase 7 (Week 7): Property Calculators

**Objective**: Build the public-facing ROI calculator with client-side logic and visualizations.

### Task 7.1: Build ROI Calculator

**AI Agent Prompt**:
Build the ROI Calculator at app/(marketing)/calculators/roi/page.tsx.

Create CalculatorForm.tsx with inputs for purchase price, rent, expenses, etc..

Implement client-side calculation logic.

Create CalculatorResults.tsx to display metrics (ROI, cash flow, cap rate).

Add Chart.js visualizations (e.g., CashFlowChart.tsx).

Add input validation.


**Implementation Steps**:

1.  **ROI Calculator** (`components/calculators/ROICalculator.tsx`):
    ```typescript
    'use client';
    import { useState }s from 'react';
    import { useForm } from 'react-hook-form';
    import { CalculatorForm } from './CalculatorForm';
    import { CalculatorResults } from './CalculatorResults';
    import { calculateROI } from '@/lib/calculations'; // Utility function

    export function ROICalculator() {
      const [results, setResults] = useState(null);
      const form = useForm();

      const onSubmit = (data) => {
        const newResults = calculateROI(data);
        setResults(newResults);
      };

      return (
        <div>
          <CalculatorForm form={form} onSubmit={onSubmit} />
          {results && <CalculatorResults data={results} />}
        </div>
      );
    }
    ```

### Task 7.2: Add Print/Export

**AI Agent Prompt**:
Add print and export functionality to the calculator:

Implement a print-friendly stylesheet.

Add a PrintButton.tsx that triggers window.print().

Add an ExportPDFButton.tsx (using a library like jsPDF) to export the results.


**Validation**: Calculator accurately computes ROI. Charts update dynamically. Print and PDF export functions work.

---

## Phase 8 (Week 8): SEO & Performance Optimization

**Objective**: Optimize the site for search engines and improve Lighthouse scores before launch.

### Task 8.1: Implement SEO Foundations

**AI Agent Prompt**:
Implement site-wide SEO optimizations:

Use next-seo to implement dynamic meta tags (title, description) for all public pages.

Create robots.txt.

Generate a static sitemap.xml for the MVP.

Add structured data (JSON-LD) for key pages (e.g., Organization, WebSite).

Add Open Graph tags for social sharing.


**Implementation Steps**:

1.  **Dynamic SEO** (`app/(marketing)/templates/[id]/page.tsx`):
    ```typescript
    import { Metadata } from 'next';

    async function getTemplateData(id) {
      // ... fetch template
    }

    export async function generateMetadata({ params }): Promise<Metadata> {
      const template = await getTemplateData(params.id);
      return {
        title: template.title,
        description: template.meta_description,
        openGraph: {
          title: template.title,
          // ...
        },
      };
    }
    ```
2.  **Sitemap** (`app/sitemap.ts`):
    ```typescript
    import { MetadataRoute } from 'next';
    export default function sitemap(): MetadataRoute.Sitemap {
      return [
        { url: '[https://propertifi.co](https://propertifi.co)', lastModified: new Date() },
        { url: '[https://propertifi.co/templates](https://propertifi.co/templates)', lastModified: new Date() },
        { url: '[https://propertifi.co/calculators/roi](https://propertifi.co/calculators/roi)', lastModified: new Date() },
      ];
    }
    ```

### Task 8.2: Optimize Performance

**AI Agent Prompt**:
Implement performance optimizations to achieve a Lighthouse score > 85:

Optimize all images using next/image.

Implement lazy loading for components below the fold.

Run Lighthouse audits and fix accessibility issues.

Optimize bundle size by checking for large dependencies and using code splitting.


**Validation**: Lighthouse Performance score is > 85, and SEO/Accessibility scores are > 90.

---

## Phase 9 (Week 9): Testing & Deployment

**Objective**: Conduct comprehensive testing and deploy the MVP to production.

### Task 9.1: Implement Testing Suite

**AI Agent Prompt**:
Write a comprehensive testing suite:

Set up Jest and React Testing Library for unit tests.

Write unit tests for critical components (e.g., CalculatorForm, ResponseForm).

Set up Playwright/Cypress for E2E tests.

Write E2E tests for critical user flows:

User Registration

User Login

PM Lead Response

Template Download


**Implementation Steps**:

1.  **Unit Test Example** (`__tests__/Calculator.test.tsx`):
    ```typescript
    import { render, screen, fireEvent } from '@testing-library/react';
    import { ROICalculator } from '@/components/calculators/ROICalculator';

    it('calculates ROI correctly', () => {
      render(<ROICalculator />);
      // ... fill inputs
      // ... click calculate
      // ... expect(screen.getByText(...)).toBeInTheDocument();
    });
    ```
2.  **E2E Test Example** (`e2e/login.spec.ts`):
    ```typescript
    import { test, expect } from '@playwright/test';

    test('should allow a PM to log in', async ({ page }) => {
      await page.goto('/login');
      await page.fill('input[name="email"]', 'pm@example.com');
      await page.fill('input[name="password"]', 'password123');
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL('/property-manager');
      await expect(page.locator('h1')).toHaveText('Your Lead Pipeline');
    });
    ```

### Task 9.2: Deploy to Production

**AI Agent Prompt**:
Prepare and execute the production deployment:

Set up the production environment (e.g., Vercel).

Configure all production environment variables.

Set up the CI/CD pipeline (e.g., GitHub Actions) to auto-deploy the main branch.

Configure the custom domain and SSL.

Set up error monitoring (Sentry) and analytics (Google Analytics, Vercel Analytics).


**Validation**: All tests pass. The application is deployed to production and accessible via the custom domain. Monitoring is active.