#!/bin/bash

# Queue Worker Startup Script
# This script starts the Laravel queue worker to process delayed notifications

echo "========================================="
echo "Starting Propertifi Queue Worker"
echo "========================================="
echo ""
echo "This will process:"
echo "  - Delayed notifications for free tier users"
echo "  - Email notifications"
echo "  - Database notifications"
echo ""
echo "Press Ctrl+C to stop the worker"
echo ""
echo "========================================="
echo ""

# Start the queue worker
# --queue=default: Process the default queue
# --sleep=3: Sleep for 3 seconds when no job is available
# --tries=3: Retry failed jobs 3 times
# --timeout=90: Maximum execution time per job
php artisan queue:work database --queue=default --sleep=3 --tries=3 --timeout=90
