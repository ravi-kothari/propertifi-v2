# 🏢 Propertifi - Property Management Platform

AI-powered property manager matching platform with comprehensive admin dashboard, user management, and financial tools.

## 🚀 Quick Start

### Option 1: Docker Setup (Recommended) 🐳

**Prerequisites:** Docker Desktop only

```bash
# Navigate to project root
cd /Users/ravi/Documents/gemini_projects/propertifi

# Start everything with one command
./docker-start.sh

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:8001
# phpMyAdmin: http://localhost:8080
# MailHog: http://localhost:8025

# Stop everything
./docker-stop.sh
```

📚 See [DOCKER_GUIDE.md](DOCKER_GUIDE.md) for detailed instructions.

### Option 2: Manual Setup

**Prerequisites:**
- PHP 8.2+ with Composer
- Node.js 18+ with npm
- MySQL 8.0+ or PostgreSQL
- Git

```bash
# Start the application
cd /Users/ravi/Documents/gemini_projects/propertifi
./start-app.sh

# Check status
./check-health.sh

# Stop the application
./stop-app.sh
```

📚 See [TESTING_GUIDE.md](TESTING_GUIDE.md) for detailed instructions.

**🤔 Not sure which to use?** See [DOCKER_VS_MANUAL.md](DOCKER_VS_MANUAL.md) for comparison.

## 📁 Project Structure

```
propertifi/
├── propertifi-backend/          # Laravel 11 API
│   ├── app/                     # Application code
│   ├── database/                # Migrations & seeders
│   ├── routes/                  # API routes
│   └── .env                     # Backend configuration
│
├── propertifi-frontend/
│   └── nextjs-app/              # Next.js 16 App Router
│       ├── app/                 # Pages & layouts
│       ├── components/          # React components
│       ├── lib/                 # Utilities & API clients
│       └── .env.local           # Frontend configuration
│
├── start-app.sh                 # Automated startup script
├── stop-app.sh                  # Stop all services
├── check-health.sh              # Health check script
├── TESTING_GUIDE.md             # Comprehensive testing guide
└── README.md                    # This file
```

## 🌟 Features

### Admin Dashboard
- **User Management**: Create, edit, delete, and verify users
- **Role Management**: Granular permissions system with 6 categories
- **Analytics**: Dashboard metrics, lead analytics, revenue tracking
- **Bulk Actions**: Activate, deactivate, or delete multiple users

### Property Management
- **PM Profiles**: Property manager verification and profiles
- **Lead Management**: Track and manage property inquiries
- **Matching Algorithm**: AI-powered PM-to-property matching

### Tools & Resources
- **ROI Calculator**: Calculate return on investment
- **Mortgage Calculator**: Estimate monthly payments
- **Rent vs Buy**: Compare renting vs buying scenarios
- **Legal Resources**: Document templates and landlord laws

### Authentication
- Multi-user types (Admin, Owner, Property Manager, Account Manager)
- Role-based access control
- Session-based authentication with Laravel Sanctum

## 🔧 Configuration

### Backend (.env)
```ini
APP_URL=http://localhost:8001
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=33060
DB_DATABASE=propertifi
DB_USERNAME=propertifi
DB_PASSWORD=password
SANCTUM_STATEFUL_DOMAINS=localhost,localhost:3000
```

### Frontend (.env.local)
```ini
NEXT_PUBLIC_API_URL=http://localhost:8001/api
NEXT_PUBLIC_MAIN_APP_URL=http://localhost:8001
```

## 🧪 Testing

See [TESTING_GUIDE.md](TESTING_GUIDE.md) for comprehensive testing instructions.

### Quick Test URLs
- **Landing Page**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **API Health**: http://localhost:8001/api/health

### Test Accounts (after seeding)
- **Admin**: admin@propertifi.com / password
- **Owner**: owner@propertifi.com / password
- **PM**: pm@propertifi.com / password

## 📱 Pages & Routes

### Public Pages
- `/` - Landing page with dual login options
- `/about` - About page
- `/blog` - Blog listing
- `/contact` - Contact form
- `/faq` - Frequently asked questions
- `/get-started` - Onboarding flow

### Admin Dashboard (`/admin`)
- `/admin` - Dashboard home
- `/admin/users` - User management
- `/admin/roles` - Role & permissions management
- `/admin/property-managers` - PM management
- `/admin/analytics` - Analytics dashboard
- `/admin/leads` - Lead management
- `/admin/settings` - System settings

### Tools & Calculators
- `/calculators/roi` - ROI Calculator
- `/calculators/mortgage` - Mortgage Calculator
- `/calculators/rent-vs-buy` - Rent vs Buy Analysis

## 🛠️ Development Commands

### Backend (Laravel)
```bash
cd propertifi-backend

# Install dependencies
composer install

# Run migrations
php artisan migrate

# Seed database
php artisan db:seed

# Start server (port 8001)
php artisan serve --port=8001

# Run tests
php artisan test

# Clear caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

### Frontend (Next.js)
```bash
cd propertifi-frontend/nextjs-app

# Install dependencies
npm install

# Development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🐛 Troubleshooting

### Backend not responding
```bash
# Check if server is running
ps aux | grep "php artisan serve"

# View Laravel logs
tail -f propertifi-backend/storage/logs/laravel.log

# Check database connection
cd propertifi-backend && php artisan db:show
```

### Frontend not loading
```bash
# Check if Next.js is running
ps aux | grep "node.*next"

# Check console for errors
# Open browser DevTools > Console tab

# Verify API URL
cat propertifi-frontend/nextjs-app/.env.local
```

### CORS Errors
Ensure `SANCTUM_STATEFUL_DOMAINS` in backend `.env` includes `localhost:3000`

### Database Connection Failed
1. Start MySQL/PostgreSQL server
2. Verify credentials in backend `.env`
3. Create database: `CREATE DATABASE propertifi;`

## 📦 Tech Stack

### Backend
- **Framework**: Laravel 11
- **Database**: MySQL 8.0 / PostgreSQL
- **Authentication**: Laravel Sanctum
- **API**: RESTful JSON API

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS 3
- **Components**: shadcn/ui (Radix UI)
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **State**: Zustand + TanStack Query
- **HTTP Client**: Axios

## 📄 License

Proprietary - All rights reserved

## 👥 Support

For issues or questions:
1. Check [TESTING_GUIDE.md](TESTING_GUIDE.md)
2. Review Laravel logs
3. Check browser DevTools Console
4. Verify environment variables

---

Built with ❤️ for modern property management
