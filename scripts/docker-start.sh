#!/bin/bash

echo "🐳 Starting Propertifi Docker environment..."

# Build and start containers in detached mode
docker-compose up --build -d

echo ""
echo "⏳ Waiting for all services to become healthy..."
echo "(This may take a minute on the first run)"

# This is a simple way to wait. A more robust script would check health status in a loop.
sleep 15

# Display container status
echo ""
echo "📦 Container status:"
docker-compose ps

# Display access URLs
echo ""
echo "========================================"
echo "🌟 Propertifi Services Access URLs"
echo "========================================"
echo "Frontend (Next.js): http://localhost:3000"
echo "Backend (Laravel):  http://localhost:8001"
echo "phpMyAdmin:         http://localhost:8080"
echo "MailHog UI:         http://localhost:8025"
echo "MySQL Port:         33060 (for external clients)"
echo "========================================"
echo ""
echo "📊 Tailing logs... (Press Ctrl+C to stop)"
echo ""

# Follow logs
docker-compose logs -f
